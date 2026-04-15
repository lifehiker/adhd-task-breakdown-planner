# Human Input Needed

The app runs out of the box with zero configuration. The credentials below unlock optional and premium features.

## Recommended — AI Task Breakdown (Core Feature)

### Anthropic API Key
- **Variable**: `ANTHROPIC_API_KEY`
- **How to get it**: Sign up at https://console.anthropic.com, create an API key (starts with `sk-ant-`)
- **Without this**: App uses 5 generic placeholder steps — still functional, not personalized
- **Where to add**: Coolify environment variables or `.env.local` for local dev

## Optional — Subscriptions / Payments (Stripe)

Without Stripe, the app works in free-tier mode only — upgrade flows show but do not process.

1. **`STRIPE_SECRET_KEY`** — Stripe Dashboard > Developers > API Keys
2. **`STRIPE_WEBHOOK_SECRET`** — Stripe Dashboard > Webhooks > Add endpoint > `https://yourdomain.com/api/webhooks/stripe`
3. **`NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`** — Create product at $7.99/month, copy the price ID
4. **`NEXT_PUBLIC_STRIPE_PRICE_YEARLY`** — Create product at $39/year, copy the price ID

Required webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Optional — Email Reminders (Resend)

Without Resend, continuation reminder emails are silently skipped.

1. **`RESEND_API_KEY`** — Sign up at https://resend.com, create an API key
2. **`EMAIL_FROM`** — A verified sender address (e.g. `noreply@yourdomain.com`). Must verify your domain in Resend first.

## Production Security

### Auth Secret
- **Variable**: `AUTH_SECRET`
- **Generate with**: `openssl rand -base64 32`
- **Default**: A placeholder is in `.env` — override it in Coolify for production

### App URL (for email links)
- **Variable**: `NEXT_PUBLIC_APP_URL`
- **Example**: `https://focussteps.app`

## Optional — Cron Protection
- **Variable**: `CRON_SECRET`
- Protects `/api/cron/send-reminders`. Pass as `Authorization: Bearer <secret>` in Coolify cron job.

## Summary

| Variable | Required | Without it |
|----------|----------|-----------|
| `ANTHROPIC_API_KEY` | Recommended | Generic mock steps used |
| `STRIPE_SECRET_KEY` | For payments | No subscription upgrades |
| `STRIPE_WEBHOOK_SECRET` | For payments | Webhooks fail verification |
| `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | For payments | Monthly plan unavailable |
| `NEXT_PUBLIC_STRIPE_PRICE_YEARLY` | For payments | Annual plan unavailable |
| `RESEND_API_KEY` | For emails | Reminder emails skipped |
| `EMAIL_FROM` | For emails | Reminder emails skipped |
| `AUTH_SECRET` | Production | Default used (override recommended) |
| `NEXT_PUBLIC_APP_URL` | For links | Links point to localhost |
| `CRON_SECRET` | Optional | Cron endpoint unprotected |
| `DATABASE_URL` | Auto-set in Docker | `file:/data/app.db` used |

## Database
Uses **SQLite** stored at `/data/app.db` in the Docker container (persisted via Coolify volume). No external database service needed.

## Authentication
Uses **email + password** authentication. Users register directly on the `/login` page. No OAuth credentials needed.
