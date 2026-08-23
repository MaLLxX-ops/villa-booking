const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C25E3E" />
      <stop offset="100%" stop-color="#A8482A" />
    </linearGradient>
    <linearGradient id="svGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2D6" />
      <stop offset="50%" stop-color="#F4D090" />
      <stop offset="100%" stop-color="#E9B263" />
    </linearGradient>
    <linearGradient id="svWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1EDE4" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Tropical Villa Arch / Roofline Architecture -->
  <path
    d="M 85 384 L 256 128 L 427 384"
    stroke="url(#svWhiteGrad)"
    stroke-width="37"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Interlocking V and Sun Structure -->
  <path
    d="M 160 277 L 256 405 L 352 277"
    stroke="url(#svGoldGrad)"
    stroke-width="34"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />

  <!-- Monogram S Wave Bridge in Center -->
  <path
    d="M 224 224 C 224 192, 288 192, 288 224 C 288 256, 224 256, 224 288 C 224 320, 288 320, 288 288"
    stroke="url(#svWhiteGrad)"
    stroke-width="26"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Luxury Apex Sparkle Node -->
  <circle cx="256" cy="117" r="26" fill="url(#svGoldGrad)" />
</svg>`;

// OG Image SVG (1200x630) with StayVilla branding and luxury aesthetics
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141E2D" />
      <stop offset="60%" stop-color="#1D2D44" />
      <stop offset="100%" stop-color="#0E1520" />
    </linearGradient>
    <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C25E3E" />
      <stop offset="100%" stop-color="#A8482A" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2D6" />
      <stop offset="50%" stop-color="#F4D090" />
      <stop offset="100%" stop-color="#E9B263" />
    </linearGradient>
    <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1EDE4" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />

  <!-- Ambient Luxury Glow -->
  <circle cx="950" cy="180" r="320" fill="#C25E3E" opacity="0.18" />
  <circle cx="250" cy="480" r="280" fill="#D4A373" opacity="0.12" />

  <!-- Logo Mark Container (180x180) -->
  <g transform="translate(100, 225)">
    <rect width="180" height="180" rx="42" fill="url(#logoBgGrad)" filter="drop-shadow(0 15px 30px rgba(194, 94, 62, 0.4))" />
    <g transform="translate(18, 18) scale(0.28125)">
      <!-- Tropical Villa Arch -->
      <path
        d="M 85 384 L 256 128 L 427 384"
        stroke="url(#whiteGrad)"
        stroke-width="37"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- Interlocking V -->
      <path
        d="M 160 277 L 256 405 L 352 277"
        stroke="url(#goldGrad)"
        stroke-width="34"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- Monogram S -->
      <path
        d="M 224 224 C 224 192, 288 192, 288 224 C 288 256, 224 256, 224 288 C 224 320, 288 320, 288 288"
        stroke="url(#whiteGrad)"
        stroke-width="26"
        stroke-linecap="round"
        fill="none"
      />
      <!-- Sparkle Node -->
      <circle cx="256" cy="117" r="26" fill="url(#goldGrad)" />
    </g>
  </g>

  <!-- Typography -->
  <text x="320" y="295" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="78" fill="#FFFFFF" letter-spacing="-1">
    Stay<tspan fill="#F4D090">Villa</tspan>
  </text>
  
  <text x="325" y="355" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28" fill="#D4A373" letter-spacing="1">
    LUXURY PRIVATE VILLA BOOKING · BALI
  </text>
  
  <text x="325" y="405" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="22" fill="#EAE0D5" opacity="0.85">
    Direct WhatsApp Booking · Zero High OTA Commission · Curated Luxury
  </text>

  <!-- Bottom Accent Line -->
  <rect x="0" y="622" width="1200" height="8" fill="url(#logoBgGrad)" />
</svg>`;

async function generateAll() {
  if (!fs.existsSync("./public")) fs.mkdirSync("./public", { recursive: true });

  const buf = Buffer.from(svgIcon);

  // 1. Vector SVGs
  fs.writeFileSync("./public/icon.svg", svgIcon.trim());
  fs.writeFileSync("./app/icon.svg", svgIcon.trim());

  // 2. Standard Favicon PNGs in public/
  await sharp(buf).resize(16, 16).png().toFile("./public/favicon-16x16.png");
  await sharp(buf).resize(32, 32).png().toFile("./public/favicon-32x32.png");
  await sharp(buf).resize(48, 48).png().toFile("./public/favicon-48x48.png");
  await sharp(buf).resize(180, 180).png().toFile("./public/apple-touch-icon.png");
  await sharp(buf).resize(192, 192).png().toFile("./public/android-chrome-192x192.png");
  await sharp(buf).resize(512, 512).png().toFile("./public/android-chrome-512x512.png");

  // 3. Next.js App Router root convention icons (app/icon.png & app/apple-icon.png)
  await sharp(buf).resize(32, 32).png().toFile("./app/icon.png");
  await sharp(buf).resize(180, 180).png().toFile("./app/apple-icon.png");

  // 4. OpenGraph Image (1200x630)
  const ogBuf = Buffer.from(ogSvg);
  await sharp(ogBuf).resize(1200, 630).png().toFile("./public/og-image.png");
  await sharp(ogBuf).resize(1200, 630).png().toFile("./app/opengraph-image.png");

  // 5. Binary .ICO generator (Multi-size 48x48, 32x32, 16x16)
  const p48 = await sharp(buf).resize(48, 48).png().toBuffer();
  const p32 = await sharp(buf).resize(32, 32).png().toBuffer();
  const p16 = await sharp(buf).resize(16, 16).png().toBuffer();

  function createIco(images) {
    const count = images.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    let offset = headerSize + count * dirEntrySize;

    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type 1 = ICO
    header.writeUInt16LE(count, 4); // count

    const dirEntries = [];
    for (const img of images) {
      const entry = Buffer.alloc(dirEntrySize);
      entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
      entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
      entry.writeUInt8(0, 2); // color count
      entry.writeUInt8(0, 3); // reserved
      entry.writeUInt16LE(1, 4); // color planes
      entry.writeUInt16LE(32, 6); // bit count
      entry.writeUInt32LE(img.buffer.length, 8); // bytes in res
      entry.writeUInt32LE(offset, 12); // offset
      offset += img.buffer.length;
      dirEntries.push(entry);
    }

    return Buffer.concat([header, ...dirEntries, ...images.map((i) => i.buffer)]);
  }

  const ico = createIco([
    { width: 48, height: 48, buffer: p48 },
    { width: 32, height: 32, buffer: p32 },
    { width: 16, height: 16, buffer: p16 },
  ]);

  fs.writeFileSync("./public/favicon.ico", ico);
  fs.writeFileSync("./app/favicon.ico", ico);

  console.log("🎉 Successfully generated all StayVilla favicons, Apple touch icons, PWA icons, and OG image!");
}

generateAll().catch(console.error);
