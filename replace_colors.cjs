const fs = require('fs');

function updateTheme(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace indigo with emerald
  content = content.replace(/indigo/g, 'emerald');
  
  // Replace purple with teal
  content = content.replace(/purple/g, 'teal');

  fs.writeFileSync(filePath, content);
  console.log(`Updated theme in ${filePath}`);
}

updateTheme('src/components/UserApp.tsx');
updateTheme('src/components/AuthScreen.tsx');
