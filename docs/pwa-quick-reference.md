# PWA Quick Reference

## Files and Configuration

### Core Files
- `public/manifest.json` - PWA manifest with app metadata
- `next.config.mjs` - Service worker configuration via next-pwa
- `app/layout.tsx` - PWA meta tags and theme colors
- `public/icons/` - App icons (SVG, need PNG conversion)

### Generated Files (Auto-created by next-pwa)
- `public/sw.js` - Service worker script
- `public/workbox-*.js` - Workbox runtime files
- `public/sw.js.map` - Service worker source map

## Quick Commands

```bash
# Install dependencies
npm install

# Development (PWA disabled)
npm run dev

# Build with PWA
npm run build

# Start production server
npm start

# Generate icons
node scripts/generate-icons.js

# Test PWA
npm run build && npm start
# Then open http://localhost:3000 in Chrome
```

## Testing Checklist

### Desktop (Chrome)
1. Build and start: `npm run build && npm start`
2. Open DevTools → Application
3. Check Manifest (no errors)
4. Check Service Workers (registered)
5. Test offline mode (DevTools → Network → Offline)
6. Run Lighthouse PWA audit

### Mobile (iOS Safari)
1. Deploy to HTTPS URL (Vercel/production)
2. Open in Safari
3. Tap Share → Add to Home Screen
4. Open installed app
5. Test offline functionality

### Mobile (Android Chrome)
1. Deploy to HTTPS URL
2. Open in Chrome
3. Tap menu → Install app
4. Open installed app
5. Test offline functionality

## Common Issues

### Service Worker Not Working
- Ensure HTTPS (or localhost)
- Check `npm run build` completed successfully
- Clear browser cache
- Check console for errors

### Icons Not Showing
- Convert SVG to PNG (see `public/icons/README.md`)
- Verify paths in `manifest.json`
- Clear browser cache
- Test with Lighthouse

### Offline Mode Not Working
- Visit pages while online first (to cache them)
- Check service worker is active
- Verify caching rules in `next.config.mjs`

## Caching Strategy Summary

| Content Type | Strategy | Cache Duration |
|--------------|----------|----------------|
| Stories API | NetworkFirst | 24 hours |
| Images | StaleWhileRevalidate | 24 hours |
| Fonts | CacheFirst | 1 year |
| JS/CSS | StaleWhileRevalidate | 24 hours |
| User API | No cache | - |
| Donations | No cache | - |

## Key Configuration

### Manifest Colors
- Background: `#F5F5DC` (soft cream)
- Theme: `#6B9AC4` (soft blue)

### Service Worker
- Disabled in development
- Auto-registers in production
- Skip waiting enabled (immediate activation)

### Icon Sizes
- 192x192px (standard)
- 512x512px (high-res)

## Production Deployment

1. Convert icons to PNG
2. Build: `npm run build`
3. Deploy to Vercel (or hosting with HTTPS)
4. Test installation on mobile devices
5. Verify offline functionality
6. Monitor service worker errors

## Resources

- Full docs: `docs/pwa-setup.md`
- Icon guide: `public/icons/README.md`
- next-pwa: https://github.com/shadowwalker/next-pwa
- PWA checklist: https://web.dev/pwa-checklist/
