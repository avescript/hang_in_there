# PWA Icons

This directory contains the Progressive Web App icons for Hang In There.

## Current Icons

- `icon-192x192.svg` - SVG version of the 192x192 icon
- `icon-512x512.svg` - SVG version of the 512x512 icon

## Production Icons Needed

For production deployment, you need to create PNG versions of these icons:

### Required Sizes
- **192x192px** - Standard PWA icon size
- **512x512px** - High-resolution PWA icon size

### How to Create PNG Icons

**Option 1: Using ImageMagick (Command Line)**
```bash
convert icon-192x192.svg -resize 192x192 icon-192x192.png
convert icon-512x512.svg -resize 512x512 icon-512x512.png
```

**Option 2: Using Online Tools**
- Upload the SVG files to [CloudConvert](https://cloudconvert.com/svg-to-png)
- Set the output size to match the filename (192x192 or 512x512)
- Download and replace the SVG files

**Option 3: Using Design Software**
- Open the SVG in Figma, Adobe Illustrator, or Inkscape
- Export as PNG at the required sizes
- Save with the correct filenames

## Design Guidelines

The icons should:
- Use the app's color palette (soft blues, creams, earthy greens)
- Feature the "Hang In There" cat motif
- Be simple and recognizable at small sizes
- Work well on both light and dark backgrounds
- Follow PWA icon best practices

## Testing

After creating PNG icons, test them:
1. Run `npm run build` to build the PWA
2. Deploy to a test environment with HTTPS
3. Test installation on mobile devices (iOS Safari, Android Chrome)
4. Verify icons appear correctly on home screen and splash screen
