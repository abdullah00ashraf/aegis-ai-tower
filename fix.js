const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(/ease: "easeOut"( as const)?/g, 'ease: "easeOut" as any');
fs.writeFileSync('src/App.tsx', c);
