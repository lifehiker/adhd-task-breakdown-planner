import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarketingPageShellProps = {
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  accentLabel: string;
  accentTitle: string;
  accentCopy: string;
};

export function MarketingPageShell({
  kicker,
  title,
  description,
  bullets,
  accentLabel,
  accentTitle,
  accentCopy,
}: MarketingPageShellProps) {
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
          <Button className="rounded-full bg-teal px-5 text-white hover:bg-[#175553]">Start Free</Button>
        </Link>
      </header>

      <main className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="animate-fade-in-up">
          <p className="focus-kicker mb-6">{kicker}</p>
          <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.03em] text-ink md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{description}</p>

          <div className="mt-8 space-y-3">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3 rounded-[1.4rem] border border-line bg-white/75 px-4 py-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                <p className="text-sm leading-6 text-ink-soft">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/app/new">
              <Button className="h-14 rounded-full bg-clay px-7 text-base text-white hover:bg-[#b45630]">
                Try the planner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-14 rounded-full border-line bg-white/80 px-7 text-base text-ink">
                See Pro
              </Button>
            </Link>
          </div>
        </section>

        <section className="animate-fade-in-up delay-200">
          <div className="focus-panel rounded-[2.2rem] p-6 md:p-7">
            <div className="rounded-[1.8rem] border border-line bg-[#16313a] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">{accentLabel}</p>
              <h2 className="mt-3 font-display text-4xl leading-none">{accentTitle}</h2>
              <p className="mt-4 text-base leading-7 text-white/74">{accentCopy}</p>

              <div className="mt-6 space-y-3">
                {[
                  "Write the task without organizing it first",
                  "Get a short, verb-first action sequence",
                  "Work one timed step before seeing the next one",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-[1.3rem] border border-white/12 bg-white/8 px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 text-xs font-semibold">
                      0{index + 1}
                    </span>
                    <span className="text-sm text-white/78">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
