import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OLD_DIR = path.join(process.cwd(), 'public', 'azlaan-media');
const NEW_DIR = path.join(process.cwd(), 'public', 'media-pro');
const JSON_DATA_PATH = path.join(process.cwd(), 'data', 'azlaan.json');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function processDirectory(currentOldDir, currentNewDir) {
  await ensureDir(currentNewDir);
  const entries = fs.readdirSync(currentOldDir, { withFileTypes: true });

  for (const entry of entries) {
    const oldPath = path.join(currentOldDir, entry.name);
    const newPathBase = path.join(currentNewDir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(oldPath, newPathBase);
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      // Force all to .webp in the new folder
      const newPath = newPathBase.replace(/\.(jpe?g|png|webp)$/i, '.webp');
      
      console.log(`Optimizing & Moving: ${entry.name} -> media-pro/.../${path.basename(newPath)}`);
      
      try {
        const buffer = fs.readFileSync(oldPath);
        const optimizedBuffer = await sharp(buffer)
          .resize(1600, null, { withoutEnlargement: true, fit: 'inside' })
          .webp({ quality: 80, effort: 6 })
          .toBuffer();
          
        fs.writeFileSync(newPath, optimizedBuffer);
        console.log(`  Done.`);
      } catch (err) {
        // If it's already an optimized webp or something sharp can't handle, just copy it if it's webp
        if (/\.webp$/i.test(entry.name)) {
            fs.copyFileSync(oldPath, newPathBase);
            console.log(`  Copied existing webp.`);
        } else {
            console.error(`  Error processing ${entry.name}:`, err.message);
        }
      }
    }
  }
}

async function updateReferences() {
  console.log('Updating all references in the project...');
  
  // 1. Update azlaan.json
  if (fs.existsSync(JSON_DATA_PATH)) {
    let content = fs.readFileSync(JSON_DATA_PATH, 'utf-8');
    content = content.replace(/\/azlaan-media\//g, '/media-pro/');
    content = content.replace(/\.(jpe?g|png)/gi, '.webp');
    fs.writeFileSync(JSON_DATA_PATH, content);
    console.log('  Updated azlaan.json');
  }

  // 2. We'll handle TSX files via shell command for efficiency
}

async function run() {
  console.log('--- Media Migration & Optimization ---');
  if (!fs.existsSync(OLD_DIR)) {
    console.error('Source directory azlaan-media not found!');
    return;
  }
  
  await processDirectory(OLD_DIR, NEW_DIR);
  await updateReferences();
  console.log('--- Migration Complete ---');
}

run();
