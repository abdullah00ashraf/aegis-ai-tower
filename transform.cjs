const fs = require('fs');

let c = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Rename App to Home
c = c.replace('export default function App() {', `export const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(10px)' },
  transition: { duration: 0.8, ease: 'easeInOut' }
};

export default function Home() {`);

// Remove Navbar
c = c.replace(/<nav className="relative z-50.*?<\/nav>/s, '');

// Wrap the main content with motion.div using pageVariants
c = c.replace(
  /<div className="relative w-full flex flex-col bg-black font-sans text-white selection:bg-white selection:text-black">/,
  `<motion.div
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="relative w-full flex flex-col bg-black font-sans text-white selection:bg-white selection:text-black"
    >`
);

// We need to close the motion.div at the very end instead of div
const lastDivIndex = c.lastIndexOf('</div>');
if (lastDivIndex !== -1) {
  c = c.substring(0, lastDivIndex) + '</motion.div>' + c.substring(lastDivIndex + 6);
}

fs.writeFileSync('src/pages/Home.tsx', c);
