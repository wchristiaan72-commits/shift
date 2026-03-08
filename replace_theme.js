const fs = require('fs');
let content = fs.readFileSync('src/components/UserApp.tsx', 'utf8');

// Replacements
content = content.replace(/dark:bg-\[\#0a0a0c\]/g, 'dark:bg-zinc-950');
content = content.replace(/dark:bg-black/g, 'dark:bg-zinc-950');
content = content.replace(/dark:bg-\[\#121214\]/g, 'dark:bg-zinc-900/50');
content = content.replace(/dark:border-neutral-800/g, 'dark:border-white\/10');
content = content.replace(/dark:bg-neutral-900/g, 'dark:bg-white\/10');
content = content.replace(/dark:bg-neutral-800\/50/g, 'dark:bg-white\/5');
content = content.replace(/dark:bg-neutral-800/g, 'dark:bg-white\/5');
content = content.replace(/dark:hover:bg-neutral-800\/50/g, 'dark:hover:bg-white\/5');
content = content.replace(/dark:hover:bg-neutral-800/g, 'dark:hover:bg-white\/10');
content = content.replace(/dark:text-white/g, 'dark:text-zinc-100');
content = content.replace(/dark:text-neutral-400/g, 'dark:text-zinc-400');
content = content.replace(/dark:text-neutral-300/g, 'dark:text-zinc-300');
content = content.replace(/sm:border-neutral-800/g, 'sm:border-white\/10');

fs.writeFileSync('src/components/UserApp.tsx', content);
console.log('Theme updated!');
