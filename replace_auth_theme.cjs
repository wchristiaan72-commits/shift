const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Replacements
content = content.replace(/bg-neutral-900 border-neutral-800 text-white/g, 'bg-white/10 border-white/10 text-zinc-100');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log('Auth Theme updated!');
