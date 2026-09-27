import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'src', 'assets', 'logo', 'icon.png');
const publicDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function resizeIcons() {
  await sharp(inputPath)
    .resize(192, 192)
    .toFile(path.join(publicDir, 'icon-192.png'));
    
  await sharp(inputPath)
    .resize(512, 512)
    .toFile(path.join(publicDir, 'icon-512.png'));
    
  console.log('Icons resized successfully');
}

resizeIcons().catch(console.error);
