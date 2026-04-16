import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Sparkles, TimerReset, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const pains = [
  "Lists become museums of guilt instead of launchpads.",
  "Most planners ask you to organize before they help you begin.",
  "AI tools stop at the outline and leave you alone with the hard part.",
];

const steps = [
  { title: "Say the task out loud", copy: "Type the messy version. No categories, no cleanup, no shame." },
  { title: "Shrink it instantly", copy: "FocusSteps turns it into 3 to 8 tiny actions with realistic timing." },
  { title: "Work one card at a time", copy: "Only the current step is loud. Everything else fades into the background." },
];

const proof = [
  "Built for active session momentum, not project management theater.",
  "Anonymous trial mode works before signup or billing.",
  "Pro users unlock unlimited AI breakdowns, make-easier mode, and reminder emails.",
];

export default function HomePage() {
  return (
    <div className="min-h-screen text-ink">
      <header className="px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-line bg-white/65 px-4 py-3 backdrop-blur md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white shadow-glow">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-2xl leading-none">FocusSteps</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-soft">Task initiation atelier</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/pricing" className="hidden text-sm text-ink-soft md:block">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="rounded-full text-ink">
                Sign In
              </Button>
            </Link>
            <Link href="/app/new">
              <Button className="rounded-full bg-teal px-5 text-white hover:bg-[#175553]">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-10">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-in-up">
            <div className="focus-kicker mb-6">
              <span className="h-2 w-2 rounded-full bg-clay" />
              For ADHD brains that need traction, not another system
            </div>
            <h1 className="font-display text-6xl leading-[0.92] tracking-[-0.03em] md:text-8xl">
              Start the task
              <span className="block text-clay">before your brain negotiates you out of it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft md:text-xl">
              FocusSteps is a fast, warm, one-task workspace. It breaks one overwhelming thing into tiny timed actions,
              then keeps your attention on the next doable move.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/app/new">
                <Button className="h-14 rounded-full bg-teal px-7 text-base text-white hover:bg-[#175553]">
                  Break down my task
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-14 rounded-full border-line bg-white/60 px-7 text-base">
                  See Pro features
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
              {proof.map((item) => (
                <div key={item} className="focus-card rounded-[1.5rem] p-4">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up delay-200">
            <div className="focus-panel focus-grid relative overflow-hidden rounded-[2rem] p-5 md:p-7">
              <div className="absolute right-5 top-5 rounded-full border border-line bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-ink-soft">
                Live session
              </div>
              <div className="rounded-[1.6rem] border border-line bg-[#16313a] p-6 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/60">Today&apos;s task</p>
                    <h2 className="mt-2 font-display text-4xl leading-none">Finish the proposal draft</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em]">
                    25 min
                  </div>
                </div>

                <div className="mt-7 rounded-[1.4rem] bg-white/8 p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/55">
                    <span>Current step</span>
                    <span>Step 2 of 5</span>
                  </div>
                  <p className="mt-4 text-2xl leading-tight">
                    Open the rough notes and pull three key points into a clean outline.
                  </p>
                  <div className="mt-6 flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45">Timer</p>
                      <p className="font-display text-4xl">04:37</p>
                    </div>
                    <Button className="rounded-full bg-[#f0e4d0] px-5 text-[#16313a] hover:bg-white">
                      Done with this step
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: TimerReset, label: "Need more time" },
                    { icon: Sparkles, label: "Make easier" },
                    { icon: CheckCircle2, label: "Skip shame-free" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="rounded-[1.2rem] border border-white/12 bg-white/6 p-4">
                      <Icon className="h-4 w-4 text-[#f0c2ad]" />
                      <p className="mt-3 text-sm text-white/78">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {pains.map((pain) => (
                  <div key={pain} className="rounded-[1.4rem] border border-line bg-white/65 p-4 text-sm leading-6 text-ink-soft">
                    {pain}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="focus-kicker mb-4">How it works</p>
              <h2 className="font-display text-5xl leading-none md:text-6xl">A calmer runway into action.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ink-soft">
              The product is intentionally narrow: one task, one working session, one next step.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((item, index) => (
              <article key={item.title} className="focus-card rounded-[1.8rem] p-6">
                <p className="font-display text-6xl leading-none text-clay/70">0{index + 1}</p>
                <h3 className="mt-4 text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-ink-soft">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-5xl">
          <div className="focus-panel overflow-hidden rounded-[2.2rem] border border-line px-6 py-8 md:px-10 md:py-10">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="focus-kicker mb-4">
                  <Clock3 className="h-3.5 w-3.5" />
                  No setup tax
                </p>
                <h2 className="font-display text-5xl leading-none md:text-6xl">
                  One field. One button. One next tiny thing.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
                  You can try the full product loop without creating an account. Sign up later if you want saved history,
                  reminders, and billing.
                </p>
              </div>
              <Link href="/app/new">
                <Button className="h-14 rounded-full bg-clay px-8 text-base text-white hover:bg-[#b45630]">
                  Start your first session
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
