const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  { from: /#4A3B3C/gi, to: '#592D37' }, // Deep Dusty Rose -> Deep Plum/Burgundy (Dark Text/Bg)
  { from: /#D49A89/gi, to: '#B76E79' }, // Dusty Pink -> Classic Rose Gold (Buttons/Accents)
  { from: /#E5C29F/gi, to: '#D39EAA' }, // Champagne -> Soft Rose Gold (Secondary Accents)
  { from: /#FEF7F6/gi, to: '#FFF0F5' }, // Soft Blush -> Lavender Blush (Backgrounds)
  { from: /#F5DAC1/gi, to: '#FADBD8' }, // Light Champagne -> Lighter Pink (Hover Bgs)
  { from: /#C6A664/gi, to: '#C88E91' }, // Hover Champagne -> Hover Rose Gold
];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      for (const r of replacements) {
        content = content.replace(r.from, r.to);
      }
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

walkDir(srcDir);
console.log('Theme successfully changed to Rose Gold & Pink!');
