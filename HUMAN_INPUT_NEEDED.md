# Human Input Needed

Before deploying, you must supply real values for all credentials listed below.

## Required Credentials

### Database
- **DATABASE_URL** - PostgreSQL connection string
  Format: `postgresql://user:password@host:5432/dbname`
  Provision a database (e.g. Supabase, Neon, Railway, or self-hosted Postgres) and paste the connection string here.

### Authentication
- **AUTH_SECRET** - Secret used to sign NextAuth sessions
  Generate: `openssl rand -base64 32`
- **AUTH_GOOGLE_ID** - Google OAuth Client ID
  From: Google Cloud Console -> APIs & Services -> Credentials -> Create OAuth 2.0 Client
- **AUTH_GOOGLE_SECRET** - Google OAuth Client Secret
  From the same Google Cloud Console OAuth credential above

### Stripe (Payments)
- **STRIPE_SECRET_KEY** - Stripe secret API key (starts with `sk_live_` or `sk_test_`)
  From: Stripe Dashboard -> Developers -> API Keys
- **STRIPE_PUBLISHABLE_KEY** - Stripe publishable key (starts with `pk_live_` or `pk_test_`)
  From: Stripe Dashboard -> Developers -> API Keys
- **STRIPE_WEBHOOK_SECRET** - Stripe webhook signing secret (starts with `whsec_`)
  From: Stripe Dashboard -> Developers -> Webhooks -> Add endpoint -> your-domain/api/webhooks/stripe
- **NEXT_PUBLIC_STRIPE_PRICE_MONTHLY** - Stripe Price ID for monthly plan (starts with `price_`)
  From: Stripe Dashboard -> Products -> create a product with a monthly recurring price
- **NEXT_PUBLIC_STRIPE_PRICE_YEARLY** - Stripe Price ID for yearly plan (starts with `price_`)
  From: Stripe Dashboard -> Products -> create a product with a yearly recurring price

### Email
- **RESEND_API_KEY** - Resend API key for sending emails
  From: Resend.com -> API Keys -> Create API Key
- **EMAIL_FROM** - Sender email address (must be a verified domain in Resend)
  Example: `noreply@yourdomain.com`

### AI
- **ANTHROPIC_API_KEY** - Anthropic API key for Claude (starts with `sk-ant-`)
  From: Anthropic Console -> API Keys

### App
- **NEXT_PUBLIC_APP_URL** - Your production app URL
  Example: `https://focussteps.app`
- **CRON_SECRET** - A secret string to protect the cron endpoint
  Generate: `openssl rand -base64 32`

## Steps to Go Live

1. Provision a PostgreSQL database and set `DATABASE_URL`
2. Run `npx prisma db push` (or `npx prisma migrate deploy`) against your production database
3. Set up Google OAuth and fill in `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`
4. Generate `AUTH_SECRET` with `openssl rand -base64 32`
5. Create Stripe products/prices and fill in all Stripe variables
6. Verify your sending domain in Resend and set `RESEND_API_KEY` + `EMAIL_FROM`
7. Get an Anthropic API key and set `ANTHROPIC_API_KEY`
8. Set `NEXT_PUBLIC_APP_URL` to your production URL
9. Register the Stripe webhook pointing to `https://your-domain/api/webhooks/stripe`
10. Deploy the app with all environment variables set
