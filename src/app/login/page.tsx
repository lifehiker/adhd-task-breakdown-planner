import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Clock3, Sparkles, Zap } from "lucide-react";
import { isPrismaAvailable } from "@/lib/db";
import { AuthPanel } from "@/components/AuthPanel";
import { Button } from "@/components/ui/button";

const googleEnabled =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

function AuthPanelFallback() {
  return (
    <div className="focus-panel rounded-[2rem] border border-line p-6 md:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="h-8 w-36 rounded-full bg-white/70" />
          <div className="h-12 w-64 rounded-2xl bg-white/70" />
        </div>
        <div className="hidden h-10 w-28 rounded-full bg-white/70 md:block" />
      </div>
      <div className="space-y-4">
        <div className="h-14 rounded-[1.2rem] bg-white/75" />
        <div className="h-14 rounded-[1.2rem] bg-white/75" />
        <div className="h-14 rounded-full bg-[rgba(30,106,103,0.18)]" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen px-5 py-5 md:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-line bg-white/65 px-4 py-3 backdrop-blur md:px-6">
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
          <Button variant="outline" className="rounded-full border-line bg-white/75 text-ink">
            Try local mode
          </Button>
        </Link>
      </header>

      <main className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="animate-fade-in-up rounded-[2.2rem] border border-line bg-[#16313a] p-6 text-white shadow-glow md:p-8">
          <div className="focus-kicker mb-6 border-white/10 bg-white/10 text-white/72">
            <Sparkles className="h-3.5 w-3.5" />
            Account benefits
          </div>
          <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.03em] md:text-7xl">
            Keep the next tiny step
            <span className="block text-[#f0c2ad]">waiting for you tomorrow.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/72">
            Local mode is fast. Accounts add memory: saved history, billing, and reminders without making the product heavier.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Resume sessions across devices once you sign in.",
              "Upgrade to Pro when you need unlimited AI breakdowns.",
              "Add reminder emails without losing the one-task workflow.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-[1.35rem] border border-white/12 bg-white/8 px-4 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-xs font-semibold">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-white/78">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/12 bg-white/7 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
              <Clock3 className="h-4 w-4" />
              Local mode still available
            </div>
            <p className="mt-3 text-sm leading-6 text-white/72">
              If you just need to start the task right now, skip the account and go straight into a fresh session.
            </p>
            <Link href="/app/new" className="mt-4 inline-flex items-center text-sm text-[#f0c2ad]">
              Start without signing in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="animate-fade-in-up delay-200">
          <Suspense fallback={<AuthPanelFallback />}>
            <AuthPanel credentialsEnabled={isPrismaAvailable} googleEnabled={googleEnabled} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
