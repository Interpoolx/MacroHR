const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const oldContent = content;
  
  // Fix all import paths
  content = content.split('@shared/components/ui/').join('@/components/ui/');
  content = content.split('@shared/config/site').join('@config/site');
  content = content.split('@shared/config/modules').join('@config/modules');
  content = content.split('@shared/config/SiteConfigContext').join('@config/SiteConfigFromDB');
  content = content.split('@shared/config/SiteConfigFromDB').join('@config/SiteConfigFromDB');
  
  if (content !== oldContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  files.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    
    if (stat.isDirectory()) {
      count += walkDir(full);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !full.includes('node_modules')) {
      if (fixFile(full)) {
        console.log('Fixed: ' + full.replace(/\\/g, '/'));
        count++;
      }
    }
  });
  
  return count;
}

const fixed = walkDir('web/src');
console.log(`\nTotal files fixed: ${fixed}`);
