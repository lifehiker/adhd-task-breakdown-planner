# Features

## FocusSteps - ADHD Task Breakdown Planner

---

### 1. Task Session Creation
**Description:** Users enter a task title and a target session length (in minutes). The app creates a focused work session for that single task.
**User Benefit:** Removes the friction of setting up a complex plan — one input, one task, start immediately.
**Status:** Completed
**Implementation Notes:** POST /api/task-sessions creates the session in the database; redirects to AI breakdown generation.
**Date Added:** 2026-04-13

---

### 2. AI-Powered Task Breakdown
**Description:** Claude (claude-haiku-4-5) automatically breaks any task into 3-8 concrete, actionable, verb-first steps sized to fit the session length.
**User Benefit:** Eliminates executive function overhead; users don't have to figure out where to start.
**Status:** Completed
**Implementation Notes:** POST /api/task-sessions/[id]/generate-breakdown calls Anthropic SDK with structured JSON output. Falls back to mock steps if no API key is present.
**Date Added:** 2026-04-13

---

### 3. Step-by-Step Session View
**Description:** Users work through steps one at a time. Each step is shown individually with a start timer button.
**User Benefit:** Reduces overwhelm by hiding future steps and focusing on exactly one thing right now.
**Status:** Completed
**Implementation Notes:** /app/session/[id] page with client-side state, Progress bar from shadcn/ui, step status tracking.
**Date Added:** 2026-04-13

---

### 4. Built-in Step Timer
**Description:** Each step has a start timer button. The timer counts up while the user works, and the elapsed time is saved when the step is marked done.
**User Benefit:** Encourages time awareness without the pressure of a countdown; provides data on actual vs. estimated time.
**Status:** Completed
**Implementation Notes:** Client-side setInterval timer, actual minutes saved via PATCH /api/task-steps/[stepId].
**Date Added:** 2026-04-13

---

### 5. Mark Done / Skip Steps
**Description:** Users can mark each step as Done or Skip it. Both actions advance to the next step.
**User Benefit:** Skipping reduces guilt around steps that become irrelevant; keeps momentum going.
**Status:** Completed
**Implementation Notes:** PATCH /api/task-steps/[stepId] with status DONE or SKIPPED.
**Date Added:** 2026-04-13

---

### 6. Make Step Easier (AI Sub-breakdown)
**Description:** If a step feels too hard to start, users can request it be broken into 2-3 even smaller steps using Claude.
**User Benefit:** Eliminates the "I don't know how to start this step" paralysis point.
**Status:** Completed
**Implementation Notes:** POST /api/task-steps/[stepId]/make-easier replaces the step with smaller sub-steps in the DB.
**Date Added:** 2026-04-13

---

### 7. Session Completion Celebration
**Description:** When all steps are done, a celebratory screen is shown with a trophy icon, step count, and options to start another task or go to the dashboard.
**User Benefit:** Provides positive reinforcement — critical for ADHD motivation loops.
**Status:** Completed
**Implementation Notes:** Conditional render in session page when allDone is true; PATCH /api/task-sessions/[id] sets status to COMPLETED.
**Date Added:** 2026-04-13

---

### 8. Dashboard / Session History
**Description:** Lists all past and in-progress task sessions with their status, step completion counts, and links to continue or review.
**User Benefit:** Quick overview of progress and easy resumption of paused tasks.
**Status:** Completed
**Implementation Notes:** /app page fetches GET /api/task-sessions (user-scoped via NextAuth session).
**Date Added:** 2026-04-13

---

### 9. Google OAuth Authentication
**Description:** Users sign in with Google. No password required.
**User Benefit:** Zero-friction onboarding; no new account to remember.
**Status:** Completed
**Implementation Notes:** NextAuth v5 with @auth/prisma-adapter, Google provider. Session stored in DB.
**Date Added:** 2026-04-13

---

### 10. Stripe Subscription (Monthly & Yearly Plans)
**Description:** Freemium model with a paid subscription unlocking unlimited sessions. Stripe Checkout and Customer Portal integrated.
**User Benefit:** Low barrier to try; monetizes power users with unlimited access.
**Status:** Completed
**Implementation Notes:** /api/stripe/checkout creates checkout session; /api/stripe/portal opens billing portal; /api/webhooks/stripe handles subscription lifecycle events.
**Date Added:** 2026-04-13

---

### 11. Usage Limits (Free Tier)
**Description:** Free users have a limited number of task sessions per month. A usage check endpoint gates session creation.
**User Benefit:** Enables sustainable freemium model; prompts upgrade naturally when limit is hit.
**Status:** Completed
**Implementation Notes:** /api/usage/check returns current usage and limit; subscription status checked against Prisma User model.
**Date Added:** 2026-04-13

---

### 12. Email Reminders for Incomplete Sessions
**Description:** A cron job detects sessions started but not completed within a time window and sends a gentle reminder email via Resend.
**User Benefit:** ADHD-friendly re-engagement — doesn't require the user to remember to come back.
**Status:** Completed
**Implementation Notes:** /api/cron/send-reminders queried by external cron (protected by CRON_SECRET); uses Resend with branded HTML email template.
**Date Added:** 2026-04-13

---

### 13. Settings Page
**Description:** User account settings and subscription management.
**User Benefit:** Central place to manage billing and account details.
**Status:** Completed (basic)
**Implementation Notes:** /settings page with link to Stripe Customer Portal.
**Date Added:** 2026-04-13

---

### 14. Pricing Page
**Description:** Public-facing pricing page showing free vs. paid plan features and CTA to sign up.
**User Benefit:** Communicates value clearly before users commit.
**Status:** Completed
**Implementation Notes:** /pricing static page.
**Date Added:** 2026-04-13
