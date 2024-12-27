// src/scripts/generateIcons.js
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const ICON_SIZES = {
  favicon: [32],
  android: [192, 512],
  ios: [120, 152, 167, 180],
  // Add maskable icons for Android
  maskable: [192, 512]
};

const INPUT_SVG = './src/assets/app-icon.svg';
const OUTPUT_DIR = './public';

async function generateIcons() {
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Generate favicon
    for (const size of ICON_SIZES.favicon) {
      await sharp(INPUT_SVG)
        .resize(size, size)
        .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
    }

    // Generate Android icons
    for (const size of ICON_SIZES.android) {
      await sharp(INPUT_SVG)
        .resize(size, size)
        .toFile(path.join(OUTPUT_DIR, `pwa-${size}x${size}.png`));
    }

    // Generate iOS icons
    for (const size of ICON_SIZES.ios) {
      await sharp(INPUT_SVG)
        .resize(size, size)
        .toFile(path.join(OUTPUT_DIR, `apple-touch-icon-${size}x${size}.png`));
    }

    // Generate maskable icons (with padding)
    for (const size of ICON_SIZES.maskable) {
      await sharp(INPUT_SVG)
        .resize(Math.floor(size * 0.8), Math.floor(size * 0.8))
        .extend({
          top: Math.floor(size * 0.1),
          bottom: Math.floor(size * 0.1),
          left: Math.floor(size * 0.1),
          right: Math.floor(size * 0.1),
          background: { r: 79, g: 70, b: 229, alpha: 1 } // #4F46E5
        })
        .toFile(path.join(OUTPUT_DIR, `maskable-icon-${size}x${size}.png`));
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();