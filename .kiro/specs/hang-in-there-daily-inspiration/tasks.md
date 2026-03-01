# Implementation Plan: Hang In There - Daily Inspiration

## Overview

This implementation plan breaks down the Hang In There PWA into discrete coding tasks. The platform delivers one curated story of human resilience daily through a Next.js/React frontend with Strapi CMS backend, browser-native push notifications, and Stripe donations.

The implementation follows a staged approach: core reading experience first, then user accounts and personalization, followed by community features, and finally donation infrastructure. Each major component includes property-based tests to validate universal correctness properties from the design document.

## Tasks

- [x] 1. Project setup and infrastructure
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and Tailwind CSS
    - Create Next.js app with App Router
    - Configure TypeScript with strict mode
    - Set up Tailwind CSS with custom theme (warm colors: soft blues, creams, earthy greens)
    - Configure ESLint and Prettier
    - _Requirements: 7.2, 8.1_

  - [x] 1.2 Set up PostgreSQL database and schema
    - Create PostgreSQL database
    - Implement all database tables from design (users, accounts, sessions, verification_tokens, user_settings, saved_stories, reading_streaks, story_reads, reactions, comments, comment_flags, push_subscriptions, donations)
    - Add indexes for performance
    - Create database migration scripts
    - _Requirements: 7.2, 7.5_

  - [x] 1.3 Configure Strapi CMS
    - Install and configure Strapi 4
    - Create Story content type with all fields (headline, narrative, subjectName, subjectIdentifier, theme, sourceUrl, sourceAttribution, publishDate, scheduledDate, status, featuredImage, commentsEnabled)
    - Set up media library for featured images
    - Configure PostgreSQL connection for Strapi
    - _Requirements: 7.2, 6.1_

  - [x] 1.4 Set up NextAuth.js authentication
    - Install and configure NextAuth.js 4
    - Implement email/password provider
    - Implement OAuth providers (Google, Apple)
    - Configure session storage in PostgreSQL
    - Create authentication API routes
    - _Requirements: 5.4.1, 7.2_

  - [x] 1.5 Configure PWA manifest and service worker
    - Create PWA manifest with app metadata
    - Implement service worker for offline story caching
    - Configure next-pwa plugin
    - _Requirements: 7.1, 10.1_

- [ ] 2. Core story feed and reading experience
  - [x] 2.1 Create story data models and API integration
    - Define TypeScript interfaces for Story type
    - Implement Strapi API client functions (getStories, getDailyStory, getStoryById)
    - Add error handling for CMS unavailability
    - _Requirements: 5.1, 5.2_

  - [x] 2.2 Implement StoryCard component
    - Create StoryCard component with all required fields (headline, narrative, subject, theme tag, source link, date)
    - Add Share and Save buttons (non-functional placeholders)
    - Style with Tailwind CSS following design system
    - Ensure responsive layout (mobile, tablet, desktop)
    - _Requirements: 5.1.1, 5.1.2, 5.1.3, 5.1.4, 5.1.5, 5.1.6, 5.1.7_

  - [ ]\* 2.3 Write property test for Story Card Completeness
    - **Property 1: Story Card Completeness**
    - **Validates: Requirements 5.1.1-5.1.6**
    - Test that all required fields render for any published story
    - Use fast-check to generate story objects
    - _Requirements: 5.1_

  - [x] 2.4 Implement StoryFeed component
    - Create StoryFeed component with reverse chronological order
    - Pin daily story at top with visual distinction
    - Implement infinite scroll with pagination fallback
    - Add loading states and error boundaries
    - _Requirements: 5.1, 5.2_

  - [x] 2.5 Create daily story API route
    - Implement GET /api/stories/daily endpoint
    - Calculate user's timezone from request or default to UTC
    - Return today's story based on timezone
    - Handle case where no story is scheduled
    - _Requirements: 5.2.1, 5.2.2_

  - [ ]\* 2.6 Write property test for Daily Story Consistency
    - **Property 2: Daily Story Consistency**
    - **Validates: Requirements 5.2.3**
    - Test that all users get the same daily story for a given date
    - _Requirements: 5.2.3_

  - [x] 2.7 Create homepage with story feed
    - Implement app/page.tsx with StoryFeed
    - Add AppShell layout with navigation header and footer
    - Implement responsive breakpoints
    - _Requirements: 5.1, 8.1_

- [ ] 3. Checkpoint - Verify core reading experience
  - Ensure all tests pass, verify stories render correctly, ask the user if questions arise.

- [ ] 4. User accounts and personalization
  - [ ] 4.1 Create authentication UI components
    - Implement AuthModal component with login/signup toggle
    - Add email/password form with validation
    - Add OAuth buttons (Google, Apple)
    - Implement password reset flow
    - Style with accessible form patterns
    - _Requirements: 5.4.1_

  - [ ] 4.2 Implement user settings page
    - Create settings page with notification preferences (on/off, time of day)
    - Add theme filter preferences
    - Add streak counter visibility toggle
    - Add account deletion option
    - _Requirements: 5.4.4, 5.4.6_

  - [ ] 4.3 Create user settings API routes
    - Implement GET /api/user/settings endpoint
    - Implement PUT /api/user/settings endpoint
    - Validate settings input (time format, theme values)
    - _Requirements: 5.4.4_

  - [ ]\* 4.4 Write property test for User Settings Round-Trip
    - **Property 3: User Settings Round-Trip**
    - **Validates: Requirements 5.2.2, 5.4.4**
    - Test that saving and retrieving settings returns equivalent object
    - _Requirements: 5.2.2, 5.4.4_

  - [ ] 4.5 Implement saved stories functionality
    - Create saved stories API routes (POST /api/user/save, GET /api/user/saved)
    - Add Save button functionality to StoryCard
    - Create SavedStories page component
    - Implement filter and search within saved stories
    - _Requirements: 5.1.8, 5.4.3_

  - [ ]\* 4.6 Write property test for Saved Stories Round-Trip
    - **Property 6: Saved Stories Round-Trip**
    - **Validates: Requirements 5.4.3**
    - Test that saved stories persist in user archive until unsaved
    - _Requirements: 5.4.3_

  - [ ]\* 4.7 Write property test for Guest Access to Stories
    - **Property 5: Guest Access to Stories**
    - **Validates: Requirements 5.4.1**
    - Test that unauthenticated users can read full story content
    - _Requirements: 5.4.1_

  - [ ] 4.8 Implement reading streak tracking
    - Create streak calculation logic
    - Implement GET /api/user/streak endpoint
    - Track story reads in story_reads table
    - Update streak on each story read
    - Display streak counter in UI (optional visibility)
    - _Requirements: 5.4.6_

  - [ ]\* 4.9 Write property test for Reading Streak Calculation
    - **Property 7: Reading Streak Calculation**
    - **Validates: Requirements 5.4.6**
    - Test that streak equals consecutive days of reading ending with today
    - _Requirements: 5.4.6_

- [ ] 5. Story archive and discovery
  - [ ] 5.1 Create story archive page
    - Implement archive page with search bar
    - Add theme filter dropdown
    - Add date range picker
    - Add sort options (newest, oldest, random)
    - Implement pagination (20 stories per page)
    - _Requirements: 5.5.1, 5.5.2, 5.5.3_

  - [ ] 5.2 Implement archive API routes
    - Create GET /api/stories endpoint with query parameters (page, limit, theme, search, dateFrom, dateTo, random)
    - Implement search logic (keyword matching in headline and narrative)
    - Implement theme filtering
    - Implement date range filtering
    - Implement random story selection
    - _Requirements: 5.5.1, 5.5.2, 5.5.4_

  - [ ]\* 5.3 Write property test for Theme Filter Accuracy
    - **Property 8: Theme Filter Accuracy**
    - **Validates: Requirements 5.4.5**
    - Test that filtered results only include stories with specified theme
    - _Requirements: 5.4.5_

  - [ ]\* 5.4 Write property test for Archive Accessibility
    - **Property 9: Archive Accessibility**
    - **Validates: Requirements 5.5.1**
    - Test that all published stories are retrievable from archive
    - _Requirements: 5.5.1_

  - [ ]\* 5.5 Write property test for Search Result Relevance
    - **Property 10: Search Result Relevance**
    - **Validates: Requirements 5.5.2**
    - Test that search results match criteria and are ordered correctly
    - _Requirements: 5.5.2_

  - [ ]\* 5.6 Write property test for Pagination Consistency
    - **Property 11: Pagination Consistency**
    - **Validates: Requirements 5.5.3**
    - Test that same page returns same stories in same order
    - _Requirements: 5.5.3_

  - [ ]\* 5.7 Write property test for Random Story Variability
    - **Property 12: Random Story Variability**
    - **Validates: Requirements 5.5.4**
    - Test that random story probability is less than 1/N for consecutive requests
    - _Requirements: 5.5.4_

- [ ] 6. Checkpoint - Verify discovery features
  - Ensure all tests pass, verify search and filters work correctly, ask the user if questions arise.

- [ ] 7. Push notifications
  - [ ] 7.1 Implement Web Push API integration
    - Generate VAPID keys for push notifications
    - Create push notification subscription logic
    - Implement POST /api/notifications/subscribe endpoint
    - Store push subscriptions in database
    - _Requirements: 5.3.1, 5.3.2, 7.2_

  - [ ] 7.2 Create notification opt-in UI
    - Add notification permission request on first visit
    - Create notification settings in user settings page
    - Add browser permission check
    - Handle permission denied gracefully
    - _Requirements: 5.3.1, 5.3.3_

  - [ ] 7.3 Implement notification scheduling system
    - Create cron job to send daily notifications
    - Calculate notification time based on user timezone and preferred time
    - Send notification with story headline and call-to-action
    - Handle failed deliveries
    - _Requirements: 5.2.1, 5.3.2_

  - [ ]\* 7.4 Write property test for Notification Rate Limiting
    - **Property 4: Notification Rate Limiting**
    - **Validates: Requirements 5.3.3**
    - Test that users never receive more than one notification per 24 hours
    - _Requirements: 5.3.3_

- [ ] 8. Community features - reactions and comments
  - [ ] 8.1 Implement reactions functionality
    - Create ReactionBar component with curated emoji set (❤️ ✊ 🌱 😢)
    - Implement POST /api/reactions endpoint
    - Add reaction toggle logic (add/remove)
    - Display reaction counts
    - Implement optimistic UI updates
    - _Requirements: 5.6.1, 5.6.2_

  - [ ]\* 8.2 Write property test for Reaction Uniqueness
    - **Property 13: Reaction Uniqueness**
    - **Validates: Requirements 5.6.1, 5.6.2**
    - Test that users can have at most one reaction per type per story
    - _Requirements: 5.6.1, 5.6.2_

  - [ ] 8.3 Implement comment system
    - Create CommentSection component with threaded comments (max depth 2)
    - Implement POST /api/comments endpoint
    - Add comment input with character limit (500 chars)
    - Display community guidelines above input
    - Implement comment pagination (20 per page)
    - _Requirements: 5.6.3, 5.6.4, 5.6.7_

  - [ ]\* 8.4 Write property test for Comment Authentication Requirement
    - **Property 14: Comment Authentication Requirement**
    - **Validates: Requirements 5.6.3**
    - Test that unauthenticated users cannot post comments
    - _Requirements: 5.6.3_

  - [ ]\* 8.5 Write property test for Comment Threading Depth Limit
    - **Property 17: Comment Threading Depth Limit**
    - **Validates: Requirements 5.6.7**
    - Test that comments cannot be nested beyond depth 2
    - _Requirements: 5.6.7_

  - [ ] 8.6 Implement comment moderation
    - Create automated content filter for prohibited content (slurs, hate speech)
    - Implement POST /api/comments/:id/flag endpoint
    - Hide flagged comments from non-moderators
    - Create moderator review queue
    - Implement DELETE /api/comments/:id endpoint for moderators
    - _Requirements: 5.6.5, 5.6.6_

  - [ ]\* 8.7 Write property test for Comment Content Filtering
    - **Property 15: Comment Content Filtering**
    - **Validates: Requirements 5.6.5**
    - Test that comments with prohibited content are rejected
    - _Requirements: 5.6.5_

  - [ ]\* 8.8 Write property test for Flagged Comment Visibility
    - **Property 16: Flagged Comment Visibility**
    - **Validates: Requirements 5.6.6**
    - Test that flagged comments are hidden from non-moderators
    - _Requirements: 5.6.6_

- [ ] 9. Audio read-aloud feature
  - [ ] 9.1 Implement AudioPlayer component
    - Create AudioPlayer component with play/pause button
    - Add progress bar with seek capability
    - Add playback speed selector (0.75x, 1x, 1.25x, 1.5x)
    - Integrate Web Speech API for text-to-speech
    - Implement keyboard controls (Space, Arrow keys)
    - _Requirements: 5.10.1, 5.10.2, 5.10.3, 5.10.4_

  - [ ]\* 9.2 Write property test for Audio Player Availability
    - **Property 26: Audio Player Availability**
    - **Validates: Requirements 5.10.1, 5.10.2**
    - Test that audio player is present and functional on all story pages
    - _Requirements: 5.10.1, 5.10.2_

  - [ ]\* 9.3 Write property test for Audio Playback Speed Control
    - **Property 27: Audio Playback Speed Control**
    - **Validates: Requirements 5.10.3**
    - Test that all playback speeds work correctly
    - _Requirements: 5.10.3_

  - [ ] 9.4 Implement audio playback navigation behavior
    - Pause audio when navigating away from story page
    - Handle browser feature detection for Web Speech API
    - Hide audio player gracefully if API unavailable
    - _Requirements: 5.10.5_

  - [ ]\* 9.5 Write property test for Audio Playback Navigation Behavior
    - **Property 28: Audio Playback Navigation Behavior**
    - **Validates: Requirements 5.10.5**
    - Test that audio pauses when navigating to different page
    - _Requirements: 5.10.5_

- [ ] 10. Checkpoint - Verify community and audio features
  - Ensure all tests pass, verify reactions, comments, and audio work correctly, ask the user if questions arise.

- [ ] 11. Donation system
  - [ ] 11.1 Set up Stripe integration
    - Create Stripe account and get API keys
    - Install Stripe SDK
    - Configure Stripe webhook endpoint
    - _Requirements: 5.8, 7.2_

  - [ ] 11.2 Create donation page
    - Implement donation page with mission statement
    - Add suggested donation tiers ($3, $5, $10/month or one-time)
    - Add custom amount input
    - Add Community Wall opt-in checkbox
    - Style with warm, supportive tone
    - _Requirements: 5.8.1, 5.8.2, 5.8.3_

  - [ ] 11.3 Implement donation API routes
    - Create POST /api/donations/create-checkout endpoint
    - Implement Stripe checkout session creation
    - Create POST /api/donations/webhook endpoint for payment events
    - Store donation records in database
    - _Requirements: 5.8.4_

  - [ ]\* 11.4 Write property test for Donation Amount Flexibility
    - **Property 18: Donation Amount Flexibility**
    - **Validates: Requirements 5.8.3**
    - Test that any amount >= $1 creates successful checkout session
    - _Requirements: 5.8.3_

  - [ ]\* 11.5 Write property test for Donor Content Parity
    - **Property 19: Donor Content Parity**
    - **Validates: Requirements 5.8.5**
    - Test that donors and non-donors see identical content and features
    - _Requirements: 5.8.5_

  - [ ] 11.6 Implement Community Wall
    - Create Community Wall page
    - Implement GET /api/donations/community-wall endpoint
    - Display donor names (first name, last initial) in grid
    - Respect opt-in preference
    - _Requirements: 5.8.6_

  - [ ]\* 11.7 Write property test for Community Wall Opt-In Round-Trip
    - **Property 20: Community Wall Opt-In Round-Trip**
    - **Validates: Requirements 5.8.6**
    - Test that opt-in donors appear on wall and opt-out donors don't
    - _Requirements: 5.8.6_

- [ ] 12. Accessibility compliance
  - [ ] 12.1 Implement semantic HTML structure
    - Audit all components for proper heading hierarchy (h1-h6)
    - Use semantic list tags (ul/ol/li) for lists
    - Add ARIA roles to interactive elements
    - Ensure all forms have proper labels
    - _Requirements: 5.9.1_

  - [ ]\* 12.2 Write property test for Semantic HTML Structure
    - **Property 21: Semantic HTML Structure**
    - **Validates: Requirements 5.9.1**
    - Test that all content uses proper semantic HTML
    - _Requirements: 5.9.1_

  - [ ] 12.3 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Implement keyboard shortcuts for audio player
    - Test tab order throughout application
    - _Requirements: 5.9.2, 5.10.4_

  - [ ]\* 12.4 Write property test for Keyboard Navigation Completeness
    - **Property 22: Keyboard Navigation Completeness**
    - **Validates: Requirements 5.9.2, 5.10.4**
    - Test that all interactive elements are keyboard operable
    - _Requirements: 5.9.2, 5.10.4_

  - [ ] 12.5 Ensure color contrast compliance
    - Audit all text for WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
    - Update Tailwind theme colors if needed
    - Test with contrast checking tools
    - _Requirements: 5.9.3_

  - [ ]\* 12.6 Write property test for Color Contrast Compliance
    - **Property 23: Color Contrast Compliance**
    - **Validates: Requirements 5.9.3**
    - Test that all text meets WCAG AA contrast standards
    - _Requirements: 5.9.3_

  - [ ] 12.7 Implement text scaling support
    - Test all pages at 200% text size
    - Fix any text overflow or overlap issues
    - Ensure responsive layout handles large text
    - _Requirements: 5.9.4_

  - [ ]\* 12.8 Write property test for Text Scaling Resilience
    - **Property 24: Text Scaling Resilience**
    - **Validates: Requirements 5.9.4**
    - Test that 200% text scaling doesn't break layout
    - _Requirements: 5.9.4_

  - [ ] 12.9 Add alternative text to all images
    - Audit all images for alt attributes
    - Write descriptive alt text for content images
    - Use empty alt for decorative images
    - _Requirements: 5.9.5_

  - [ ]\* 12.10 Write property test for Image Alternative Text
    - **Property 25: Image Alternative Text**
    - **Validates: Requirements 5.9.5**
    - Test that all images have appropriate alt attributes
    - _Requirements: 5.9.5_

- [ ] 13. Security and privacy
  - [ ] 13.1 Implement HTTPS/TLS configuration
    - Configure TLS 1.3 for all connections
    - Set up HTTPS redirect
    - Configure security headers (HSTS, CSP, X-Frame-Options)
    - _Requirements: 7.5.3_

  - [ ]\* 13.2 Write property test for HTTPS Transport Security
    - **Property 29: HTTPS Transport Security**
    - **Validates: Requirements 7.5.3**
    - Test that all requests use HTTPS with TLS 1.2+
    - _Requirements: 7.5.3_

  - [ ]\* 13.3 Write property test for Payment Data Isolation
    - **Property 30: Payment Data Isolation**
    - **Validates: Requirements 7.5.4**
    - Test that database never contains credit card data
    - _Requirements: 7.5.4_

  - [ ] 13.4 Implement privacy compliance
    - Create privacy policy page
    - Implement GDPR data export functionality
    - Implement CCPA data deletion functionality
    - Add cookie consent banner (if using cookies beyond essential)
    - Configure Plausible analytics (privacy-first)
    - _Requirements: 7.5.1, 7.5.2, 8.6_

- [ ] 14. Editorial workflow and content operations
  - [ ] 14.1 Configure Strapi editorial workflow
    - Set up user roles in Strapi (editor, reviewer, admin)
    - Configure draft → scheduled → published workflow
    - Set up version history
    - Create editorial guidelines documentation in Strapi
    - _Requirements: 6.1, 6.2_

  - [ ] 14.2 Implement story scheduling system
    - Create cron job to publish scheduled stories
    - Check for stories with scheduledDate <= now and status = 'scheduled'
    - Update status to 'published' and set publishDate
    - Trigger push notifications on publication
    - _Requirements: 5.2.1, 6.1_

  - [ ] 14.3 Create story backlog monitoring
    - Implement dashboard showing unpublished story count
    - Alert if backlog falls below 30 stories
    - Display upcoming publication schedule
    - _Requirements: 6.2_

- [ ] 15. Performance optimization
  - [ ] 15.1 Implement image optimization
    - Use Next.js Image component for all images
    - Configure image loader for Strapi media
    - Implement lazy loading for story cards
    - Add blur placeholders
    - _Requirements: 7.4_

  - [ ] 15.2 Optimize API responses
    - Implement response caching for story archive
    - Add database query optimization (indexes, query analysis)
    - Implement pagination for all list endpoints
    - Add rate limiting to prevent abuse
    - _Requirements: 7.4_

  - [ ] 15.3 Configure CDN and caching
    - Set up CDN for static assets
    - Configure cache headers for stories
    - Implement ISR (Incremental Static Regeneration) for story pages
    - Set up service worker caching strategy
    - _Requirements: 7.3, 7.4_

  - [ ]\* 15.4 Run Lighthouse CI and verify performance targets
    - Configure Lighthouse CI in GitHub Actions
    - Verify Performance ≥ 90, Accessibility = 100, Best Practices ≥ 90, SEO = 100
    - Verify Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
    - _Requirements: 7.4_

- [ ] 16. Testing and quality assurance
  - [ ] 16.1 Set up testing infrastructure
    - Configure Jest and React Testing Library
    - Configure fast-check for property-based testing
    - Configure Playwright for E2E testing
    - Configure jest-axe for accessibility testing
    - Set up test database
    - _Requirements: Testing Strategy_

  - [ ] 16.2 Write unit tests for components
    - Test StoryCard rendering with various props
    - Test AudioPlayer controls and keyboard navigation
    - Test CommentSection posting, replying, flagging
    - Test AuthModal login, signup, OAuth flows
    - Test StoryArchive search, filter, pagination
    - _Requirements: Testing Strategy_

  - [ ] 16.3 Write unit tests for API routes
    - Test /api/stories/daily with various timezones
    - Test /api/user/save and /api/user/saved
    - Test /api/reactions add/remove
    - Test /api/comments with depth limit enforcement
    - Test /api/notifications/subscribe
    - Test /api/donations/create-checkout
    - _Requirements: Testing Strategy_

  - [ ] 16.4 Write E2E tests for critical flows
    - Test guest user journey (visit → read → browse → search)
    - Test new user onboarding (signup → enable notifications → save story)
    - Test engaged user flow (login → read → react → comment → save)
    - Test donor flow (login → donate → see Community Wall)
    - Test audio listening flow (play → adjust speed → navigate away)
    - _Requirements: Testing Strategy_

  - [ ] 16.5 Run accessibility audit
    - Run axe-core on all pages
    - Test with screen readers (NVDA, JAWS, VoiceOver)
    - Test keyboard-only navigation
    - Test at 200% text size
    - Test in high contrast mode
    - _Requirements: 5.9, Testing Strategy_

- [ ] 17. Deployment and monitoring
  - [ ] 17.1 Configure Vercel deployment
    - Connect GitHub repository to Vercel
    - Configure environment variables
    - Set up preview deployments for PRs
    - Configure production domain
    - _Requirements: 7.3_

  - [ ] 17.2 Set up monitoring and alerting
    - Configure error tracking (Sentry or similar)
    - Set up Plausible analytics
    - Configure uptime monitoring
    - Set up alert thresholds (error rate, database failures, webhook failures)
    - Create monitoring dashboard
    - _Requirements: 7.5, 8.6, Error Handling_

  - [ ] 17.3 Create deployment documentation
    - Document environment variables needed
    - Document database migration process
    - Document Stripe webhook configuration
    - Document VAPID key generation
    - Create runbook for common issues
    - _Requirements: 7.3_

- [ ] 18. Final checkpoint - Production readiness
  - Ensure all tests pass (unit, property, E2E, accessibility)
  - Verify all 30 properties are tested
  - Verify Lighthouse scores meet targets
  - Verify WCAG AA compliance
  - Verify all critical user flows work end-to-end
  - Ask the user if ready to deploy

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- All 30 correctness properties from the design document are included as test tasks
- Property tests use fast-check with minimum 100 iterations
- Checkpoints ensure incremental validation at major milestones
- Implementation uses TypeScript, Next.js 14, React 18, Tailwind CSS, Strapi 4, PostgreSQL 15
- Hosting starts with Vercel Hobby (dev), upgrades to Vercel Pro (launch), migrates to self-hosted VPS (scale)
