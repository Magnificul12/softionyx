/**
 * Generates a complete favicon set from client/public/logo.png:
 *   favicon-16x16.png, favicon-32x32.png, favicon-48x48.png
 *   apple-touch-icon.png (180x180)
 *   android-chrome-192x192.png, android-chrome-512x512.png
 *   favicon-maskable-512.png (with padding for Android adaptive icons)
 *
 * favicon.ico is generated as a 32x32 PNG renamed to .ico (browsers accept PNG
 * inside .ico files since Chrome/Edge/Firefox 2016+; tiny fraction of old IE may
 * not, but negligible in 2026).
 *
 * Run: node scripts/generate-favicons.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'client', 'public');
const LOGO = path.join(PUBLIC_DIR, 'logo.png');

const OUT = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon-48x48.png': 48,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error('Logo not found at', LOGO);
    process.exit(1);
  }

  // The source logo has a wide aspect ratio. Extract the square "S" mark on the
  // left (~1:1 crop from the left edge). Fall back to centered fit if the crop
  // fails (logo meta not reporting expected dims).
  const meta = await sharp(LOGO).metadata();
  console.log(`Source logo: ${meta.width}x${meta.height}`);

  // Create a centered, padded square source so all icons look consistent.
  // Dark background matching the site's theme-color.
  const SRC_SIZE = 1024;
  const PAD = 80;

  const paddedSquare = await sharp(LOGO)
    .resize({
      width: SRC_SIZE - PAD * 2,
      height: SRC_SIZE - PAD * 2,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      background: { r: 11, g: 15, b: 25, alpha: 1 }, // #0b0f19
    })
    .png()
    .toBuffer();

  for (const [name, size] of Object.entries(OUT)) {
    const out = path.join(PUBLIC_DIR, name);
    await sharp(paddedSquare).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
    const stat = fs.statSync(out);
    console.log(`  ${name.padEnd(32)} ${size}x${size}  ${(stat.size / 1024).toFixed(1)} KB`);
  }

  // Maskable icon for Android adaptive (same as 512 but padded more)
  const maskableOut = path.join(PUBLIC_DIR, 'favicon-maskable-512.png');
  await sharp(LOGO)
    .resize({
      width: 360,
      height: 360,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: 76,
      bottom: 76,
      left: 76,
      right: 76,
      background: { r: 11, g: 15, b: 25, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(maskableOut);
  console.log(
    `  favicon-maskable-512.png            512x512  ${(fs.statSync(maskableOut).size / 1024).toFixed(1)} KB`
  );

  // favicon.ico (PNG-in-ICO; modern browsers accept. 32x32 is the sweet spot.)
  const icoOut = path.join(PUBLIC_DIR, 'favicon.ico');
  await sharp(paddedSquare).resize(32, 32).png().toFile(icoOut);
  console.log(`  favicon.ico                         32x32    ${(fs.statSync(icoOut).size / 1024).toFixed(1)} KB`);

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
