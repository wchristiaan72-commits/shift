import express from "express";
import cors from "cors";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const JWT_SECRET =
  process.env.JWT_SECRET || "development_secret_change_me";

const YOCO_SECRET = process.env.YOCO_SECRET_KEY;

let pool: Pool | null = null;

function getDb() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is missing. Please add it to the AI Studio Secrets panel.");
    }

    if (process.env.DATABASE_URL.includes(".internal")) {
      throw new Error("You are using an internal Railway URL (.internal). You must use the Public TCP URL provided by Railway to connect from outside.");
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }

  return pool;
}

//
// DATABASE INIT
//

async function initDb() {
  try {
    const db = getDb();

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if they don't exist (for existing databases)
    try {
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);`);
      await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);`);
    } catch (e) {
      console.log("Columns might already exist or error adding them:", e);
    }

    console.log("Database initialized");
  } catch (err: any) {
    console.error("DB init error:", err.message);
  }
}

if (process.env.DATABASE_URL) {
  initDb();
}

//
// AUTH ROUTES
//

const MOCK_USER = { id: 1, email: "test@example.com", password: "password" };

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    let user;

    const isDbConfigured = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes(".internal");

    if (!isDbConfigured) {
      // Fallback if DB is not configured or is an internal URL
      user = { id: Date.now(), email, firstName, lastName };
    } else {
      const db = getDb();
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.query(
        "INSERT INTO users (email,password,first_name,last_name) VALUES ($1,$2,$3,$4) RETURNING id,email,first_name,last_name",
        [email, hashedPassword, firstName || null, lastName || null]
      );
      user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name
      };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (err: any) {

    if (err.code === "23505") {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({ error: err.message });
  }
});


app.post("/api/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    let user;
    let valid = false;

    const isDbConfigured = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes(".internal");

    if (!isDbConfigured) {
      // Fallback if DB is not configured or is an internal URL
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        user = { id: MOCK_USER.id, email: MOCK_USER.email };
        valid = true;
      } else {
        return res.status(401).json({
          error: "Invalid credentials. (Hint: use test@example.com / password since DB is not connected)"
        });
      }
    } else {
      const db = getDb();

      const result = await db.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );

      const dbUser = result.rows[0];

      if (!dbUser) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }

      valid = await bcrypt.compare(password, dbUser.password);

      if (!valid) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }

      user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name
      };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }

});


//
// YOCO CHECKOUT PAYMENT
//

app.post("/api/pay/yoco", async (req, res) => {

  try {

    const { token, amountInCents, currency } = req.body;

    if (!YOCO_SECRET) {
      return res.status(500).json({
        error: "YOCO_SECRET_KEY missing"
      });
    }

    const response = await fetch(
      "https://online.yoco.com/v1/charges/",
      {
        method: "POST",
        headers: {
          "X-Auth-Secret-Key": YOCO_SECRET,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          amountInCents: amountInCents,
          currency: currency || "ZAR"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Payment creation failed"
    });

  }

});


//
// PAYMENT STATUS PAGES
//

app.get("/payment-success", (req, res) => {
  res.send("Payment successful");
});

app.get("/payment-cancel", (req, res) => {
  res.send("Payment cancelled");
});


//
// START SERVER
//

async function startServer() {

  if (process.env.NODE_ENV !== "production") {

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });

    app.use(vite.middlewares);

  } else {

    app.use(express.static("dist"));

  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

}

startServer();