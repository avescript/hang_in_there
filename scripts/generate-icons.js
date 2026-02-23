/**
 * Icon Generation Script
 * 
 * This script creates placeholder PWA icons for the Hang In There application.
 * For production, replace these with professionally designed icons.
 * 
 * The icons use a simple design with the app's theme colors:
 * - Background: Soft cream (#F5F5DC)
 * - Primary: Soft blue (#6B9AC4)
 * - Text: Dark gray (#333333)
 */

const fs = require('fs');
const path = require('path');

// SVG template for the icon
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#F5F5DC" rx="${size * 0.15}"/>
  
  <!-- Decorative circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="#6B9AC4" opacity="0.2"/>
  
  <!-- Cat silhouette (simplified) -->
  <g transform="translate(${size / 2}, ${size / 2})">
    <!-- Body -->
    <ellipse cx="0" cy="${size * 0.05}" rx="${size * 0.15}" ry="${size * 0.2}" fill="#6B9AC4"/>
    <!-- Head -->
    <circle cx="0" cy="${-size * 0.15}" r="${size * 0.12}" fill="#6B9AC4"/>
    <!-- Ears -->
    <path d="M ${-size * 0.08} ${-size * 0.22} L ${-size * 0.12} ${-size * 0.28} L ${-size * 0.05} ${-size * 0.2} Z" fill="#6B9AC4"/>
    <path d="M ${size * 0.08} ${-size * 0.22} L ${size * 0.12} ${-size * 0.28} L ${size * 0.05} ${-size * 0.2} Z" fill="#6B9AC4"/>
    <!-- Paws hanging -->
    <ellipse cx="${-size * 0.08}" cy="${size * 0.25}" rx="${size * 0.04}" ry="${size * 0.06}" fill="#6B9AC4"/>
    <ellipse cx="${size * 0.08}" cy="${size * 0.25}" rx="${size * 0.04}" ry="${size * 0.06}" fill="#6B9AC4"/>
  </g>
  
  <!-- Text "HIT" (Hang In There) -->
  <text x="${size / 2}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold" fill="#333333" text-anchor="middle">HIT</text>
</svg>`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files (these can be converted to PNG using online tools or ImageMagick)
const sizes = [192, 512];

sizes.forEach((size) => {
  const svg = createSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\n📝 Note: SVG icons created. For production:');
console.log('   1. Convert SVGs to PNG using an image editor or online tool');
console.log('   2. Or use ImageMagick: convert icon.svg -resize 192x192 icon-192x192.png');
console.log('   3. Replace with professionally designed icons\n');
