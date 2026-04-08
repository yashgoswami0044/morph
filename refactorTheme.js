import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Basic Text Colors
  content = content.replace(/color:\s*['"]white['"]/g, "color: 'var(--text-main)'");
  content = content.replace(/color:\s*['"]#fff(fff)?['"]/gi, "color: 'var(--text-main)'");
  
  // Background Colors
  content = content.replace(/background:\s*['"]white['"]/gi, "background: 'var(--bg-card)'");
  content = content.replace(/background:\s*['"]#fff(fff)?['"]/gi, "background: 'var(--bg-card)'");
  
  // Glass Backgrounds & Opacities
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.?0[12]\)/g, "var(--glass-light)");
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.?0[345]\)/g, "var(--glass-hover)");
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.?0[6789]\)/g, "var(--border)");
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.?1\)/g, "var(--border)");
  
  // Border Colors with white opacity
  content = content.replace(/border:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.?0[3456789]\)['"]/g, "border: '1px solid var(--border)'");

  // Specific Dark/Light inverted logic
  content = content.replace(/color:\s*['"]#080a0f['"]/g, "color: 'var(--bg-main)'");
  content = content.replace(/color:\s*['"]#141820['"]/g, "color: 'var(--bg-card)'");
  
  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir(srcDir, processFile);
console.log('Refactoring complete!');
