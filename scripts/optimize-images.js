/**
 * Optimizes large images in client/public:
 *   - Converts to AVIF (best compression) + WebP
 *   - Converts to WebP @ quality 82 (typical 60-80% smaller than PNG)
 *   - Keeps original as JPG fallback at 85% quality
 *   - Generates two widths (1600w, 800w) for responsive <picture>
 * Run: node scripts/optimize-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'client', 'public');

// Only optimize images that are referenced as project thumbnails; keep logo.png untouched.
const TARGETS = [
  { file: 'rightmob.png' },
  { file: 'Work2Now.png' },
  { file: 'easywaste-removal.png' },
  { file: 'CetatetiaRo-Main.jpg' },
];

const WIDTHS = [1600, 800];

async function processOne(file) {
  const inPath = path.join(PUBLIC_DIR, file);
  if (!fs.existsSync(inPath)) {
    console.warn('  MISSING:', file);
    return;
  }

  const base = file.replace(/\.(png|jpg|jpeg)$/i, '');
  const origSize = fs.statSync(inPath).size;

  const results = [];

  for (const w of WIDTHS) {
    const avifOut = path.join(PUBLIC_DIR, `${base}-${w}.avif`);
    const webpOut = path.join(PUBLIC_DIR, `${base}-${w}.webp`);
    const jpgOut = path.join(PUBLIC_DIR, `${base}-${w}.jpg`);

    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 52, effort: 6 })
      .toFile(avifOut);

    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(webpOut);

    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgOut);

    results.push({
      width: w,
      avif: fs.statSync(avifOut).size,
      webp: fs.statSync(webpOut).size,
      jpg: fs.statSync(jpgOut).size,
    });
  }

  console.log(`\n${file}  (original: ${(origSize / 1024).toFixed(0)} KB)`);
  for (const r of results) {
    console.log(
      `  ${r.width}w: avif ${(r.avif / 1024).toFixed(0)} KB, webp ${(r.webp / 1024).toFixed(0)} KB, jpg ${(r.jpg / 1024).toFixed(0)} KB`
    );
  }
}

async function main() {
  console.log('Optimizing images in', PUBLIC_DIR);
  for (const t of TARGETS) {
    await processOne(t.file);
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
