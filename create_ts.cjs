const fs = require('fs');
let content = fs.readFileSync('c:/FRAMEWORK(AI TOWER)/Aegis_Tower_Project_Report.md', 'utf8');
content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
const fileContent = 'export const reportContent = `\n' + content + '\n`;';
fs.writeFileSync('c:/FRAMEWORK(AI TOWER)/src/assets/reportData.ts', fileContent);
