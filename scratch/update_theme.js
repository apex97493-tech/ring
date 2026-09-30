const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  { from: /#022C22/gi, to: '#4A3B3C' }, // Dark Emerald -> Deep Dusty Rose / Brown
  { from: /#064E3B/gi, to: '#D49A89' }, // Emerald -> Dusty Pink
  { from: /#D4AF37/gi, to: '#E5C29F' }, // Gold -> Champagne
  { from: /#FDFBF7/gi, to: '#FEF7F6' }, // Cream -> Soft Blush
  { from: /#F3E5AB/gi, to: '#F5DAC1' }, // Light Gold -> Light Champagne
  { from: /#B89035/gi, to: '#C6A664' }, // Hover Gold -> Hover Champagne
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
console.log('Color theme updated successfully!');
