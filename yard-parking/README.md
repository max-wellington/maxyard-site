## Yard Parking Booking Platform

Game-day yard parking reservations for events near Raymond James Stadium. Built with Next.js 16 App Router, Tailwind CSS, Prisma/PostgreSQL, Stripe Checkout, NextAuth admin login, and Resend/Twilio for messaging.

### Prerequisites

- Node.js 20+
- PostgreSQL instance
- Stripe account with Checkout + webhook secret
- Resend API key (for transactional email)
- Optional: Twilio SMS credentials

### Environment variables

Copy `.env.example` to `.env.local` and populate:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yard_parking
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=owner@example.com
ADMIN_PASSWORD=changeme123!
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL="Parking Host <host@yourdomain.com>"
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
LOG_LEVEL=info
```

### Install & run locally

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

The app will be available at `http://localhost:3000`.

### Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Update `STRIPE_WEBHOOK_SECRET` with the signing secret returned by Stripe CLI.

### Deploying to Netlify

This project ships with `netlify.toml` and uses `@netlify/plugin-nextjs` for SSR support.

1. Install the Netlify CLI (optional) and log in: `npm install -g netlify-cli`.
2. Create a new Netlify site and connect this repository.
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add the environment variables above (including `NEXTAUTH_URL` pointing to your Netlify domain).
6. Configure a Stripe webhook endpoint pointing to `https://your-site.netlify.app/api/stripe/webhook`.

Preview and production deploys run through Next.js’ Node runtime on Netlify serverless functions.

### Useful scripts

- `npm run dev` – local development
- `npm run build` – production build
- `npm run start` – serve the production build locally
- `npm run lint` – lint with ESLint/Next
- `npm run prisma:*` – Prisma utility commands

### Testing considerations

Add integration tests for booking flows, Stripe webhook handling, and admin workflows once core features are complete. Consider Playwright for end-to-end coverage.
