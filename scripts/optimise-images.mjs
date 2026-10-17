/**
 * Generates web assets from assets/source/ into public/.
 * Run manually when brand assets change:  node scripts/optimise-images.mjs
 * Uses `sharp` (installed as an optional dependency of Astro).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const logo = "assets/source/meehelp-logo.png";
await mkdir("public/brand", { recursive: true });
await mkdir("public/og", { recursive: true });

// Logo: palette PNG (smaller than WebP for this flat artwork; also used by schema).
await sharp(logo).png({ compressionLevel: 9, palette: true }).toFile("public/brand/meehelp-logo.png");

// Square "M" mark from the left of the logo for favicons/app icons.
// The circle mark sits in the left ~158px of the 465x180 logo.
const mark = await sharp(logo)
  .extract({ left: 0, top: 0, width: 158, height: 180 })
  .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .toBuffer();
const iconBase = sharp({ create: { width: 512, height: 512, channels: 4, background: "#ffffff" } }).composite([
  { input: await sharp(mark).resize(440, 440).toBuffer(), top: 36, left: 36 },
]);
const icon512 = await iconBase.png().toBuffer();
await sharp(icon512).resize(192, 192).png().toFile("public/icon.png");
await sharp(icon512).resize(180, 180).png().toFile("public/apple-icon.png");

// Open Graph image 1200x630.
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect y="500" width="1200" height="160" fill="#e5fcff"/>
  <text x="80" y="365" font-family="Lexend, Arial, sans-serif" font-size="54" font-weight="600" fill="#10272b">House help, cooks, nannies</text>
  <text x="80" y="432" font-family="Lexend, Arial, sans-serif" font-size="54" font-weight="600" fill="#10272b">and care attendants near you</text>
  <text x="80" y="578" font-family="Arial, sans-serif" font-size="34" fill="#0a6f7a">Get the MeeHelp app on Google Play and the App Store</text>
</svg>`;
await sharp(Buffer.from(ogSvg))
  .composite([{ input: await sharp(logo).resize({ width: 520 }).toBuffer(), top: 70, left: 70 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og/meehelp-og.png");

console.log("Images generated.");
