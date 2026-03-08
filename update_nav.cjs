const fs = require('fs');
let content = fs.readFileSync('src/components/UserApp.tsx', 'utf8');

const regex = /\{\/\* Bottom Navigation \*\/\}[\s\S]*?<\/div>\n\s*\)\}/;

const newNav = `{/* Bottom Navigation */}
        {(activeScreen === 'dashboard' || activeScreen === 'settings' || activeScreen === 'analytics') && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 rounded-full backdrop-blur-xl border flex items-center justify-around px-6 bg-neutral-900/95 border-neutral-800 shadow-2xl z-50">
            <button onClick={() => setActiveScreen('dashboard')} className={\`flex flex-col items-center gap-1 \${activeScreen === 'dashboard' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}\`}>
              <Home size={22} />
            </button>
            <button onClick={() => {
              if (userPlan === 'Free' && subscriptions.length >= 3) {
                setActiveScreen('upgrade');
              } else {
                setActiveScreen('add');
              }
            }} className="w-12 h-12 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Plus size={24} />
            </button>
            <button onClick={() => {
              if (userPlan === 'Free') {
                setActiveScreen('upgrade');
              } else {
                setActiveScreen('analytics');
              }
            }} className={\`flex flex-col items-center gap-1 \${activeScreen === 'analytics' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}\`}>
              <PieChart size={22} />
            </button>
            <button onClick={() => setActiveScreen('settings')} className={\`flex flex-col items-center gap-1 \${activeScreen === 'settings' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}\`}>
              <Settings size={22} />
            </button>
          </div>
        )}`;

content = content.replace(regex, newNav);
content = content.replace(/pb-24/g, 'pb-32');

fs.writeFileSync('src/components/UserApp.tsx', content);
console.log('Nav updated');
