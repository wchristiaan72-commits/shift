const fs = require('fs');

function cleanAuthScreen() {
  let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');
  
  // Remove theme prop
  content = content.replace(/theme: 'dark' \| 'light';\n/, '');
  content = content.replace(/, theme }: AuthScreenProps/, '}: AuthScreenProps');
  
  // Replace conditionals
  content = content.replace(/className=\{`flex items-center justify-center h-full w-full \$\{theme === 'dark' \? 'bg-\[#09090b\]' : 'bg-neutral-100'\}`\}/g, 'className="flex items-center justify-center h-full w-full bg-neutral-100"');
  content = content.replace(/className=\{`w-full max-w-md p-8 \$\{theme === 'dark' \? 'text-zinc-100' : 'text-neutral-900'\}`\}/g, 'className="w-full max-w-md p-8 text-neutral-900"');
  content = content.replace(/className=\{`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors \$\{theme === 'dark' \? 'bg-white\/10 border-white\/10 text-zinc-100' : 'bg-white border-neutral-200 text-neutral-900'\}`\}/g, 'className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors bg-white border-neutral-200 text-neutral-900"');

  fs.writeFileSync('src/components/AuthScreen.tsx', content);
  console.log('AuthScreen cleaned');
}

function cleanApp() {
  let content = fs.readFileSync('src/App.tsx', 'utf8');
  
  // Remove theme state
  content = content.replace(/const \[theme, setTheme\] = useState<'dark' \| 'light'>\(\(\) => \{\n\s*return \(localStorage\.getItem\('subtrack_theme'\) as 'dark' \| 'light'\) \|\| 'dark';\n\s*\}\);\n\n\s*useEffect\(\(\) => \{\n\s*if \(theme === 'dark'\) \{\n\s*document\.documentElement\.classList\.add\('dark'\);\n\s*\} else \{\n\s*document\.documentElement\.classList\.remove\('dark'\);\n\s*\}\n\s*\}, \[theme\]\);/g, '');
  
  // Remove theme prop passing
  content = content.replace(/theme=\{theme\}/g, '');
  
  // Ensure dark class is removed
  content = content.replace(/export default function App\(\) \{/g, "export default function App() {\n  useEffect(() => {\n    document.documentElement.classList.remove('dark');\n  }, []);\n");

  fs.writeFileSync('src/App.tsx', content);
  console.log('App cleaned');
}

function cleanUserApp() {
  let content = fs.readFileSync('src/components/UserApp.tsx', 'utf8');
  
  // Remove theme state
  content = content.replace(/const \[theme, setTheme\] = useState<'dark' \| 'light'>\(\(\) => \{\n\s*return \(localStorage\.getItem\('subtrack_theme'\) as 'dark' \| 'light'\) \|\| 'dark';\n\s*\}\);\n/g, '');
  
  // Remove theme useEffect
  content = content.replace(/useEffect\(\(\) => \{\n\s*localStorage\.setItem\('subtrack_theme', theme\);\n\s*if \(theme === 'dark'\) \{\n\s*document\.documentElement\.classList\.add\('dark'\);\n\s*\} else \{\n\s*document\.documentElement\.classList\.remove\('dark'\);\n\s*\}\n\s*\}, \[theme\]\);\n/g, '');
  
  // Remove Appearance section
  content = content.replace(/<div className="flex justify-between items-center p-4 border-b dark:border-white\/10 border-neutral-200">[\s\S]*?<\/div>\n\s*<\/div>/, '');

  // Replace conditionals
  content = content.replace(/\$\{theme === 'dark' \? '[^']*' : '([^']*)'\}/g, '$1');
  content = content.replace(/\{theme === 'dark' \? <Moon[^>]*> : (<Sun[^>]*>)\}/g, '$1');
  content = content.replace(/theme=\{theme\} setTheme=\{setTheme\}/g, '');
  
  // Remove dark: classes
  content = content.replace(/dark:[a-zA-Z0-9/\[\]#-]+\s?/g, '');
  
  // Clean up empty classNames or double spaces
  content = content.replace(/  +/g, ' ');
  content = content.replace(/className=" "/g, 'className=""');

  fs.writeFileSync('src/components/UserApp.tsx', content);
  console.log('UserApp cleaned');
}

cleanAuthScreen();
cleanApp();
cleanUserApp();
