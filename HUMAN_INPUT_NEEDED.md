# Human Input Needed

The app now builds cleanly, but a few account and billing flows cannot be fully exercised in this environment without configuration.

## Required for account auth

- `DATABASE_URL`
  Set this in `.env.local`. For local development, `file:./dev.db` matches the repo example.

- `AUTH_SECRET`
  Generate one with `openssl rand -base64 32` and set it in `.env.local`.

## Optional for Google sign-in

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
  Create OAuth credentials in Google Cloud Console, then add both to `.env.local` if you want Google login enabled.

## Optional for live AI breakdowns

- `ANTHROPIC_API_KEY`
  Add this to `.env.local` if you want real AI-generated task breakdowns and "make easier" suggestions. Without it, the app falls back to mock step data so the core flow still works.

## Optional for Stripe checkout and billing portal

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`
- `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`
- `NEXT_PUBLIC_APP_URL`
  Create the Stripe products and prices, then copy the IDs and keys into `.env.local`.

## Optional for reminder emails

- `RESEND_API_KEY`
- `EMAIL_FROM`
  Add these if you want reminder delivery to work.

## Optional for protected cron access

- `CRON_SECRET`
  Add this if you want to lock down the reminder cron endpoint in non-local environments.

## After adding env vars

1. Restart the dev server.
2. If this is the first local database setup, run Prisma migrations or database setup for the project.
3. Re-test `/login`, registration, billing, and reminders.
