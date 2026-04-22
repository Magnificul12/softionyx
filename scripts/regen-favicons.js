// Regenerate all favicons + PWA icons from Logo Original.png.
//
// The source logo is horizontal ("S" mark + "SOFT IONIX GROUP" wordmark) which
// makes it unusable as a tiny square icon. We produce two flavors:
//   - app icons (android-chrome / apple-touch / maskable): pad into a square,
//     keep the whole logo visible.
//   - small favicons (16/32/48): crop to the "S" wave mark on the left so the
//     brand is still recognizable at icon size.
//
// All outputs land in client/public next to logo.png so index.html references
// keep working unchanged.

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.resolve(__dirname, '..', 'assets', 'source', 'Logo Original.png');
const OUT = path.resolve(__dirname, '..', 'client', 'public');

if (!fs.existsSync(SRC)) {
  console.error(`Source not found: ${SRC}`);
  process.exit(1);
}

async function trimAlpha(buf) {
  // Auto-trim surrounding transparent pixels so the logo fills the canvas.
  return sharp(buf).trim().toBuffer({ resolveWithObject: true });
}

async function padToSquare(innerBuf, size, background = { r: 11, g: 15, b: 25, alpha: 1 }) {
  // innerBuf is expected to already be the trimmed logo. Fit it into a size x size
  // canvas with ~12% padding so it doesn't touch the edges (PWA safe zone).
  const inset = Math.round(size * 0.88);
  const resized = await sharp(innerBuf)
    .resize({
      width: inset,
      height: inset,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function squareMarkOnly(innerBuf, size, background = { r: 11, g: 15, b: 25, alpha: 1 }) {
  // Grab the left third of the trimmed logo (the "S" wave mark). Works with a
  // horizontal wordmark where the symbol sits to the left of the text.
  const meta = await sharp(innerBuf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) {
    return padToSquare(innerBuf, size, background);
  }
  const side = Math.min(h, Math.round(w * 0.36));
  const markBuf = await sharp(innerBuf)
    .extract({
      left: 0,
      top: Math.max(0, Math.round((h - side) / 2)),
      width: Math.min(w, side),
      height: Math.min(h, side),
    })
    .toBuffer();

  const inset = Math.round(size * 0.78);
  const resized = await sharp(markBuf)
    .resize({
      width: inset,
      height: inset,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

(async () => {
  const srcBuf = fs.readFileSync(SRC);
  const trimmed = await trimAlpha(srcBuf);
  const inner = trimmed.data;

  const write = (name, buf) => {
    const p = path.join(OUT, name);
    fs.writeFileSync(p, buf);
    console.log(`wrote ${name} (${buf.length} bytes)`);
  };

  // PWA / app icons — keep whole wordmark.
  write('android-chrome-192x192.png', await padToSquare(inner, 192));
  write('android-chrome-512x512.png', await padToSquare(inner, 512));
  write('apple-touch-icon.png', await padToSquare(inner, 180));
  write('favicon-maskable-512.png', await padToSquare(inner, 512));

  // Small favicons — just the "S" mark so it's readable at 16x16.
  write('favicon-16x16.png', await squareMarkOnly(inner, 16));
  write('favicon-32x32.png', await squareMarkOnly(inner, 32));
  write('favicon-48x48.png', await squareMarkOnly(inner, 48));

  // Refresh the main logo too (same bytes, but bust caches by writing).
  fs.copyFileSync(SRC, path.join(OUT, 'logo.png'));
  console.log('wrote logo.png');

  console.log('✓ favicons regenerated from Logo Original.png');
})();
