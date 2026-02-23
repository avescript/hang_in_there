# PWA Setup Documentation

## Overview

Hang In There is configured as a Progressive Web App (PWA) to enable:
- Offline reading of cached stories
- Browser-native push notifications
- Installation on mobile devices and desktops
- App-like experience without app store distribution

## Configuration

### 1. PWA Manifest (`public/manifest.json`)

The manifest defines the app's metadata for installation:

```json
{
  "name": "Hang In There - Daily Inspiration",
  "short_name": "Hang In There",
  "description": "Daily stories of grit, grace, and human connection",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F5DC",
  "theme_color": "#6B9AC4",
  "orientation": "portrait-primary",
  "icons": [...],
  "shortcuts": [...]
}
```

**Key Properties:**
- `display: "standalone"` - Hides browser UI for app-like experience
- `background_color` - Soft cream (#F5F5DC) for splash screen
- `theme_color` - Soft blue (#6B9AC4) for browser chrome
- `shortcuts` - Quick access to today's story

### 2. Service Worker Configuration

The service worker is configured via `next-pwa` in `next.config.mjs`:

**Caching Strategies:**

1. **CacheFirst** - For static assets that rarely change
   - Google Fonts webfonts (1 year)
   - Audio files (24 hours)
   - Video files (24 hours)

2. **StaleWhileRevalidate** - For assets that may update
   - Google Fonts stylesheets (1 week)
   - Images (24 hours)
   - JavaScript/CSS (24 hours)
   - Next.js data (24 hours)

3. **NetworkFirst** - For dynamic content
   - Story API endpoints (24 hours cache, 10s timeout)
   - General API routes (5 minutes cache, 10s timeout)
   - Same-origin requests (24 hours)

**Excluded from Cache:**
- `/api/user/*` - User-specific data requiring authentication
- `/api/notifications/*` - Real-time notification subscriptions
- `/api/donations/*` - Payment processing endpoints

### 3. Icons

PWA icons are located in `public/icons/`:

- `icon-192x192.svg` - Standard icon (needs PNG conversion)
- `icon-512x512.svg` - High-res icon (needs PNG conversion)

**Production Requirements:**
- Convert SVG to PNG before deployment
- Ensure icons work on both light and dark backgrounds
- Test on iOS Safari and Android Chrome

### 4. Meta Tags

PWA meta tags are configured in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hang In There',
  },
  icons: {
    icon: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#6B9AC4',
};
```

## Offline Functionality

### What Works Offline

1. **Previously Viewed Stories**
   - Stories are cached after first view
   - Available for 24 hours in cache
   - Includes text, images, and metadata

2. **Static Assets**
   - App shell (HTML, CSS, JavaScript)
   - Fonts and icons
   - Images from viewed stories

3. **Navigation**
   - Homepage
   - Story archive (cached pages)
   - Previously visited pages

### What Requires Network

1. **User Authentication**
   - Login/logout
   - Session management
   - OAuth flows

2. **Real-Time Features**
   - Push notification subscriptions
   - New story publication
   - Comments and reactions

3. **Donations**
   - Stripe payment processing
   - Donation confirmation

### Offline UX

When offline:
- Display cached stories with "Offline" indicator
- Show friendly message for features requiring network
- Queue actions (like saving stories) for when online
- Provide clear feedback about connection status

## Testing the PWA

### Local Testing

1. **Build the PWA:**
   ```bash
   npm run build
   npm start
   ```

2. **Test in Chrome DevTools:**
   - Open DevTools → Application tab
   - Check "Manifest" section for errors
   - Check "Service Workers" for registration
   - Use "Offline" checkbox to test offline mode

3. **Lighthouse Audit:**
   ```bash
   npm run build
   npm start
   # Open Chrome DevTools → Lighthouse
   # Run PWA audit
   ```

### Mobile Testing

**iOS Safari (iOS 16.4+):**
1. Open site in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Verify icon and splash screen
5. Test offline functionality

**Android Chrome:**
1. Open site in Chrome
2. Tap menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Verify icon and splash screen
5. Test offline functionality

### Production Testing

1. **HTTPS Required:**
   - PWA features require HTTPS
   - Service workers won't register on HTTP
   - Use Vercel/production URL for testing

2. **Push Notifications:**
   - Test on real devices (not simulators)
   - Verify notification permissions
   - Test notification delivery

3. **Installation:**
   - Verify install prompt appears
   - Test installation on multiple devices
   - Check app icon on home screen

## Browser Support

### Full Support
- Chrome 90+ (Desktop & Android)
- Edge 90+
- Safari 16.4+ (iOS & macOS)
- Firefox 90+
- Samsung Internet 14+

### Partial Support
- Safari 11-16.3 (no Web Push)
- Older browsers (graceful degradation)

### Fallbacks
- No service worker: App works normally, no offline support
- No Web Push: Offer email digest option
- No installation: App works as regular website

## Performance Optimization

### Service Worker Best Practices

1. **Cache Size Management:**
   - Limit cached entries per category
   - Set appropriate expiration times
   - Clear old caches on update

2. **Network Strategies:**
   - Use NetworkFirst for dynamic content
   - Use CacheFirst for static assets
   - Set reasonable timeouts (10s)

3. **Update Strategy:**
   - `skipWaiting: true` - Activate new SW immediately
   - `register: true` - Auto-register service worker
   - Clear old caches on activation

### Monitoring

Track these metrics:
- Service worker registration success rate
- Cache hit/miss ratio
- Offline usage patterns
- Installation conversion rate

## Troubleshooting

### Service Worker Not Registering

**Symptoms:**
- No service worker in DevTools
- Offline mode doesn't work

**Solutions:**
1. Ensure HTTPS (or localhost)
2. Check browser console for errors
3. Clear browser cache and reload
4. Verify `next-pwa` is installed
5. Check `next.config.mjs` configuration

### Icons Not Appearing

**Symptoms:**
- Default browser icon shown
- Blank icon on home screen

**Solutions:**
1. Convert SVG icons to PNG
2. Verify icon paths in manifest.json
3. Check icon sizes (192x192, 512x512)
4. Clear browser cache
5. Test with Lighthouse

### Offline Mode Not Working

**Symptoms:**
- Stories don't load offline
- "No internet" error shown

**Solutions:**
1. Visit stories while online first (to cache)
2. Check service worker is active
3. Verify caching rules in next.config.mjs
4. Check browser console for cache errors
5. Test with DevTools offline mode

### Push Notifications Not Working

**Symptoms:**
- Permission prompt doesn't appear
- Notifications not received

**Solutions:**
1. Ensure HTTPS (required for Web Push)
2. Check browser supports Web Push
3. Verify VAPID keys are configured
4. Test on real device (not simulator)
5. Check notification permissions in browser settings

## Deployment Checklist

Before deploying to production:

- [ ] Convert SVG icons to PNG (192x192, 512x512)
- [ ] Test PWA installation on iOS Safari
- [ ] Test PWA installation on Android Chrome
- [ ] Run Lighthouse PWA audit (score ≥ 90)
- [ ] Verify offline functionality works
- [ ] Test push notifications on real devices
- [ ] Ensure HTTPS is enabled
- [ ] Verify manifest.json is accessible
- [ ] Check service worker registration
- [ ] Test on multiple browsers
- [ ] Verify theme colors match design
- [ ] Test app shortcuts work
- [ ] Monitor service worker errors in production

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [next-pwa GitHub](https://github.com/shadowwalker/next-pwa)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/) - Test and validate PWA

## Future Enhancements

### Phase 2 Features
- Background sync for offline actions
- Periodic background sync for new stories
- Advanced caching strategies
- Share target API for sharing to app
- Shortcuts API for quick actions

### Phase 3 Features
- Install prompt customization
- App badging for unread stories
- File handling API
- Contact picker integration
- Web Share Target API
