const fs = require('fs');
let content = fs.readFileSync('src/components/UserApp.tsx', 'utf8');

// Replacements
content = content.replace(/bg-\[\#0a0a0c\]/g, 'bg-[#09090b]');
content = content.replace(/bg-black/g, 'bg-[#09090b]');
content = content.replace(/bg-\[\#121214\]/g, 'bg-white\/5');

fs.writeFileSync('src/components/UserApp.tsx', content);
console.log('Theme updated!');
