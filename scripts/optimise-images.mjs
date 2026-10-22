/**
 * Generates web assets from assets/source/ into public/.
 * Run manually when brand assets change:  node scripts/optimise-images.mjs
 * Uses `sharp` (installed as an optional dependency of Astro).
 *
 * Source: assets/source/meehelp-logo-square.png — the official MeeHelp mark,
 * white lettering on a near-black square (512×512).
 *
 *   public/brand/meehelp-logo.png  light-safe website logo: the same lettering in
 *                                  the mark's near-black (#161616) on a TRANSPARENT
 *                                  background, cropped to the lettering. Used in the
 *                                  header, footer and Organization schema.
 *   public/icon.png (192), public/apple-icon.png (180)
 *                                  the original black square mark (tab icon / home screen)
 *   public/og/meehelp-og.png       1200×630 share image with the light-safe logo
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const square = "assets/source/meehelp-logo-square.png";
const INK = { r: 0x16, g: 0x16, b: 0x16 };
await mkdir("public/brand", { recursive: true });
await mkdir("public/og", { recursive: true });

// 1. Light-safe logo: lettering → alpha, filled with the mark's own near-black.
const { data: grey, info } = await sharp(square).greyscale().raw().toBuffer({ resolveWithObject: true });
let [minX, minY, maxX, maxY] = [info.width, info.height, 0, 0];
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++)
    if (grey[y * info.width + x] > 128) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
const pad = 6;
const box = { left: Math.max(0, minX - pad), top: Math.max(0, minY - pad), width: maxX - minX + 1 + 2 * pad, height: maxY - minY + 1 + 2 * pad };
// Background is ~#161616 and lettering ~#ffffff: map luminance to alpha, keeping the anti-aliased edges.
const bg = 22;
const alpha = Buffer.alloc(info.width * info.height);
for (let i = 0; i < alpha.length; i++) alpha[i] = Math.max(0, Math.min(255, Math.round(((grey[i] - bg) / (255 - bg)) * 255)));
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < alpha.length; i++) {
  rgba[i * 4] = INK.r;
  rgba[i * 4 + 1] = INK.g;
  rgba[i * 4 + 2] = INK.b;
  rgba[i * 4 + 3] = alpha[i];
}
const logo = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).extract(box);
const logoPng = await logo.png({ compressionLevel: 9 }).toBuffer();
await sharp(logoPng).toFile("public/brand/meehelp-logo.png");
console.log(`logo ${box.width}×${box.height}`);

// 2. Tab / home-screen icons: the original black square mark.
await sharp(square).resize(192, 192, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile("public/icon.png");
await sharp(square).resize(180, 180, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile("public/apple-icon.png");

// 3. Open Graph image 1200×630 (layout unchanged; new logo top-left).
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect y="500" width="1200" height="160" fill="#e5fcff"/>
  <text x="80" y="365" font-family="Lexend, Arial, sans-serif" font-size="54" font-weight="600" fill="#10272b">House help, cooks, nannies</text>
  <text x="80" y="432" font-family="Lexend, Arial, sans-serif" font-size="54" font-weight="600" fill="#10272b">and care attendants near you</text>
  <text x="80" y="578" font-family="Arial, sans-serif" font-size="34" fill="#0a6f7a">Get the MeeHelp app on Google Play and the App Store</text>
</svg>`;
await sharp(Buffer.from(ogSvg))
  .composite([{ input: await sharp(logoPng).resize({ height: 220 }).toBuffer(), top: 64, left: 80 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og/meehelp-og.png");

console.log("Images generated.");
