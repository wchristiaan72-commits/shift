const fs = require('fs');

function updateTheme(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace gradients
  content = content.replace(/bg-gradient-to-br from-emerald-500 to-teal-600/g, 'bg-neutral-900');
  content = content.replace(/bg-gradient-to-br from-teal-500 to-emerald-600/g, 'bg-neutral-900');
  content = content.replace(/bg-gradient-to-br from-emerald-50 to-teal-50/g, 'bg-neutral-100');
  content = content.replace(/from-emerald-900\/40 to-teal-900\/40/g, 'from-neutral-900/40 to-neutral-800/40');

  // Replace colors
  content = content.replace(/emerald-500/g, 'neutral-900');
  content = content.replace(/emerald-600/g, 'neutral-800');
  content = content.replace(/emerald-200/g, 'neutral-300');
  content = content.replace(/emerald-100/g, 'neutral-200');
  content = content.replace(/emerald-50/g, 'neutral-100');
  
  content = content.replace(/teal-600/g, 'neutral-800');
  content = content.replace(/teal-500/g, 'neutral-700');
  content = content.replace(/teal-50/g, 'neutral-100');

  // Replace shadows
  content = content.replace(/shadow-emerald-500\/[0-9]+/g, 'shadow-neutral-900/10');
  content = content.replace(/shadow-teal-500\/[0-9]+/g, 'shadow-neutral-900/10');

  // Replace rounded corners for a more modern look
  content = content.replace(/rounded-2xl/g, 'rounded-3xl');

  fs.writeFileSync(filePath, content);
  console.log(`Updated theme in ${filePath}`);
}

updateTheme('src/components/UserApp.tsx');
updateTheme('src/components/AuthScreen.tsx');
