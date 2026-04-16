import { CheckCircle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BillingButton } from "@/components/BillingButton";

export default function PricingPage() {
  const freeFeatures = [
    "5 AI task breakdowns per month",
    "Unlimited manual steps",
    "Session history",
    "Basic progress tracking",
  ];

  const proFeatures = [
    "Unlimited AI task breakdowns",
    "Make step easier (AI sub-steps)",
    "Email reminders to continue sessions",
    "Unlimited saved history",
    "Account billing controls",
  ];

  return (
    <div className="min-h-screen px-5 py-5 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-line bg-white/65 px-4 py-3 backdrop-blur md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white shadow-glow">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-2xl leading-none text-ink">FocusSteps</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-soft">Task initiation atelier</p>
          </div>
        </Link>
        <Link href="/app/new">
          <Button className="rounded-full bg-teal px-5 text-white hover:bg-[#175553]">
            Start Free
          </Button>
        </Link>
      </nav>

      <main className="mx-auto max-w-6xl px-0 py-12 md:py-16">
        <div className="text-center">
          <p className="focus-kicker mx-auto mb-6">Pricing</p>
          <h1 className="font-display text-5xl leading-[0.94] tracking-[-0.03em] text-ink md:text-7xl">
            Simple pricing,
            <span className="block text-clay">without productivity theater.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
            Start free in local mode. Upgrade only when you want unlimited AI help, reminders, and account-level sync.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-full border border-line bg-white/75 px-4 py-2 text-sm text-ink-soft">
          <Sparkles className="h-4 w-4 text-clay" />
          Annual is the default recommendation: lower cost, less decision fatigue, same product.
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
          <Card className="focus-card border border-line rounded-[2rem]">
            <CardContent className="p-8 md:p-9">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">Free</p>
                <h2 className="mt-3 font-display text-5xl leading-none text-ink">Free forever</h2>
                <p className="mt-3 text-base leading-7 text-ink-soft">
                  Enough to start tasks fast and see whether the workflow fits your brain.
                </p>
              </div>

              <ul className="space-y-4">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-ink-soft">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span className="leading-7">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/app/new" className="mt-8 block">
                <Button variant="outline" size="lg" className="h-14 w-full rounded-full border-line bg-white/80 text-ink">
                  Get started free
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="focus-panel relative overflow-hidden rounded-[2rem] border border-line">
            <div className="absolute right-5 top-5">
              <Badge className="rounded-full border-0 bg-clay px-4 py-1 text-white">Most popular</Badge>
            </div>
            <CardContent className="p-8 md:p-9">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">Pro</p>
                <h2 className="mt-3 font-display text-5xl leading-none text-ink">$39/year</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-ink-soft">Default plan. Or $7.99/month.</p>
                <p className="mt-4 text-base leading-7 text-ink-soft">
                  Built for people who keep coming back and want the AI layer, reminders, and billing tied to an account.
                </p>
              </div>

              <ul className="space-y-4">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-ink-soft">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
                    <span className="leading-7">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                <BillingButton
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY}
                  label="Start annual plan"
                  className="h-14 w-full rounded-full bg-clay text-white hover:bg-[#b45630]"
                />
                <BillingButton
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY}
                  label="Choose monthly instead"
                  variant="outline"
                  className="h-12 w-full rounded-full border-line bg-white/80 text-ink"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
