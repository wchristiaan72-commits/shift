const fs = require('fs');
let content = fs.readFileSync('src/components/UserApp.tsx', 'utf8');

// Replacements
content = content.replace(/dark:hover:border-neutral-800/g, 'dark:hover:border-white\/10');
content = content.replace(/dark:bg-white\/5\/20/g, 'dark:bg-white\/5');
content = content.replace(/dark:hover:bg-neutral-700/g, 'dark:hover:bg-white\/10');

fs.writeFileSync('src/components/UserApp.tsx', content);
console.log('Theme updated!');
