const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(/margin: -100 as any/g, 'margin: "-100px"');
fs.writeFileSync('src/App.tsx', c);
