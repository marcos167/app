# Changelog

All notable changes to Chefex will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-21

### 🎉 Initial Production Release

This is the first stable release of Chefex, ready for Play Store publication as a PWA.

### Added

#### Authentication & Security
- JWT-based authentication with access and refresh tokens
- Google OAuth integration for social login
- Email/password registration and login
- Rate limiting on login (5/min), signup (3/min), and payments (5/min)
- Role-based access control (user, moderator, admin)
- CEO bypass for administrative access
- Password hashing with bcrypt

#### Feed & Content
- Unified feed with pagination and filtering
- Recipe creation with AI moderation
- Category filtering and search
- Trending recipes based on weekly likes
- Following feed for subscribed users

#### Social Features
- User profiles with public statistics
- Follow/unfollow system
- Followers and following lists
- Recipe likes with real-time counting
- Save recipes for later viewing
- Comments on recipes with ratings

#### Monetization
- Premium subscription (MasterChef tier)
- Stripe integration for payments
- Hardcore monetization system with eligibility requirements
- Points and financial ledger tracking
- Admin review for monetization applications

#### Admin Panel
- Full admin dashboard
- User management (view, edit, ban)
- Recipe moderation (approve, reject, delete)
- Monetization application review
- Analytics and reports
- Export to CSV/Excel

#### Legal & Compliance
- Terms of Use (LGPD compliant)
- Privacy Policy
- Monetization Policy
- Antifraud Policy
- All pages publicly accessible

#### PWA
- Manifest with full icon set
- Service worker with offline support
- Offline fallback page
- Push notification support (infrastructure ready)
- App shortcuts for quick actions

### Technical Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLModel + PostgreSQL
- **Authentication**: JWT + Refresh Tokens
- **Payments**: Stripe
- **Hosting**: Vercel (frontend) + Render (backend)

### Security
- Rate limiting on critical endpoints
- Input validation and sanitization
- CORS configuration
- HTTPS enforced
- Secure cookie handling
- Admin action logging

---

## Roadmap

### [1.1.0] - Planned
- Video recipes (up to 60 seconds)
- PayPal integration
- Push notifications
- Recipe sharing to social media
- Advanced search filters

### [1.2.0] - Planned
- AI recipe suggestions
- Meal planning
- Shopping list generation
- Nutritional information

---

## Contributing

For bug reports and feature requests, contact: axissoftware025@gmail.com

## License

Copyright © 2024 Axis Software. All rights reserved.
