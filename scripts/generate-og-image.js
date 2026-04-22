/**
 * Generates a 1200x630 branded Open Graph image at client/public/og-image.jpg
 * Run: node scripts/generate-og-image.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const LOGO = path.join(ROOT, 'client', 'public', 'logo.png');
const OUT = path.join(ROOT, 'client', 'public', 'og-image.jpg');

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0f19"/>
      <stop offset="0.5" stop-color="#131a2e"/>
      <stop offset="1" stop-color="#1a1235"/>
    </linearGradient>
    <radialGradient id="glow1" cx="18%" cy="25%" r="40%">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="80%" r="50%">
      <stop offset="0" stop-color="#a855f7" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#c7d2fe"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#818cf8"/>
      <stop offset="1" stop-color="#c084fc"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- subtle grid -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
  </g>

  <!-- text -->
  <text x="80" y="260" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="700" fill="url(#title)">
    SoftIonyx
  </text>
  <text x="80" y="340" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="500" fill="url(#accent)">
    Technologies
  </text>
  <text x="80" y="420" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="400" fill="#cbd5e1">
    Professional IT Solutions
  </text>
  <text x="80" y="460" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="300" fill="#94a3b8">
    Web • Mobile • Blockchain • Backend
  </text>

  <!-- accent bar -->
  <rect x="80" y="500" width="120" height="4" rx="2" fill="url(#accent)"/>

  <!-- url -->
  <text x="80" y="560" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="400" fill="#64748b">
    softionyx.com
  </text>
</svg>
`;

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error('Logo not found at', LOGO);
    process.exit(1);
  }

  const logoBuffer = await sharp(LOGO)
    .resize({ width: 260, height: 260, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(Buffer.from(svg))
    .composite([{ input: logoBuffer, top: 185, left: W - 360 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OUT);

  console.log('Generated', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
