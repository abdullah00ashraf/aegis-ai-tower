const fs = require('fs');

let c = fs.readFileSync('src/pages/Home.tsx', 'utf8');

c = c.replace(/User,\s*X,/, '');
c = c.replace(/const \[isMobileMenuOpen, setIsMobileMenuOpen\] = useState\(false\);/, '');
c = c.replace(/const navLinks = \[\s*\{ name: 'The Vision'[\s\S]*?\];/m, '');
c = c.replace(/import \{ useState \} from 'react';/, '');

fs.writeFileSync('src/pages/Home.tsx', c);
