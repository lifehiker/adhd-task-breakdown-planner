import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Zap, CheckCircle, BookOpen, ListChecks, Sparkles } from "lucide-react";

const serifStyle = { fontFamily: "var(--font-serif)" };

const painPoints = [
  { icon: BookOpen, title: "You've tried 5 different planners", desc: "Notion, Things, Todoist, a paper journal, and that one app everyone recommended. None of them stuck." },
  { icon: ListChecks, title: "You open your to-do list and freeze", desc: "The task is right there. You know what it is. But starting? That's where it all falls apart." },
  { icon: Sparkles, title: "You spend more time planning than doing", desc: "Color-coding, reorganizing, adding subtasks — anything to feel productive without actually starting." },
];

const howItWorks = [
  { num: "1", title: "Type your task", desc: "Just one field. No projects, tags, or setup. Write it the way you'd say it out loud." },
  { num: "2", title: "Get tiny steps", desc: "AI breaks it into 3–8 concrete steps in seconds. Each one is small enough to actually start." },
  { num: "3", title: "Do one step at a time", desc: "See one step. Hit done. Move on. Your brain handles this. We've seen it work." },
];

const testimonials = [
  { quote: "FocusSteps broke my taxes into 6 steps and I finished in one sitting. First time ever.", name: "Sarah M.", role: "Freelance Designer, ADHD" },
  { quote: "The Make it easier button is everything for executive dysfunction days.", name: "Jordan K.", role: "Software Engineer" },
  { quote: "No login, no setup, just paste and go. Finally an app that gets how my brain works.", name: "Alex T.", role: "Graduate Student" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7", color: "#1C1917" }}>
      {/* NAV */}
      <nav className="relative z-10 px-6 py-5" style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#7c3aed" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "#1C1917" }}>FocusSteps</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: "#78716C" }}>Pricing</Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" style={{ color: "#44403C" }}>Sign In</Button>
            </Link>
            <Link href="/app/new">
              <Button size="sm" className="font-semibold" style={{ backgroundColor: "#7c3aed", color: "white" }}>Try It Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
              style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
              Built for ADHD brains &middot; No setup required
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight mb-7 animate-fade-in-up delay-100 max-w-3xl"
            style={{ ...serifStyle, color: "#1C1917", letterSpacing: "-0.01em" }}>
            That task you&apos;ve been avoiding?{" "}
            <em style={{ color: "#7c3aed", fontStyle: "italic" }}>Let&apos;s start right now.</em>
          </h1>
          <p className="text-lg md:text-xl mb-10 animate-fade-in-up delay-200 max-w-xl leading-relaxed" style={{ color: "#57534E" }}>
            Describe what you need to do. Get tiny, timed steps instantly.{" "}
            <strong style={{ color: "#1C1917", fontWeight: 600 }}>Your brain can handle this.</strong>
          </p>
          <div className="animate-fade-in-up delay-300">
            <Link href="/app/new">
              <Button size="lg" className="text-base font-semibold px-7 py-6 rounded-xl shadow-lg"
                style={{ backgroundColor: "#7c3aed", color: "white", boxShadow: "0 4px 24px rgba(124,58,237,0.3)" }}>
                Break My Task Down &mdash; It&apos;s Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm animate-fade-in-up delay-400" style={{ color: "#A8A29E" }}>
            No account required &middot; 5 AI breakdowns free every month
          </p>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "#FEF9F0" }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #fbbf24 30%, #f59e0b 60%, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 max-w-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl leading-tight mb-4" style={{ ...serifStyle, color: "#1C1917" }}>
              You know what needs to be done.{" "}
              <em style={{ color: "#b45309" }}>Starting is the hard part.</em>
            </h2>
            <p className="text-base" style={{ color: "#78716C" }}>
              It&apos;s not laziness. It&apos;s not lack of motivation. It&apos;s how your brain works &mdash; and most apps make it worse.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="p-7 rounded-2xl animate-fade-in-up"
                  style={{ backgroundColor: "#FFFBF0", border: "1px solid #fde68a", animationDelay: i * 120 + 100 + "ms", boxShadow: "3px 3px 0px #fbbf24" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "#fef3c7" }}>
                    <Icon className="w-5 h-5" style={{ color: "#d97706" }} />
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "#1C1917" }}>{point.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
            <h2 className="text-4xl md:text-5xl leading-tight max-w-sm animate-fade-in-up" style={{ ...serifStyle, color: "#1C1917" }}>
              Three steps. Start in under 30 seconds.
            </h2>
            <p className="text-sm max-w-xs animate-fade-in-up delay-100" style={{ color: "#A8A29E", lineHeight: "1.6" }}>
              No onboarding. No tutorial. Just type and go.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.num} className="animate-fade-in-up" style={{ animationDelay: i * 150 + 100 + "ms" }}>
                <div className="text-8xl font-bold leading-none mb-5 select-none"
                  style={{ ...serifStyle, color: "transparent", WebkitTextStroke: "1.5px #D6D3D1" }}>
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#1C1917" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl leading-tight mb-14 text-center animate-fade-in-up" style={{ ...serifStyle, color: "#1C1917" }}>
            Real people. Real relief.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="p-7 rounded-2xl animate-fade-in-up"
                style={{ backgroundColor: "#FAFAF7", border: "1px solid rgba(28,25,23,0.07)", animationDelay: i * 120 + 100 + "ms" }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: "#44403C" }}>&ldquo;{t.quote}&rdquo;</p>
                <p className="font-semibold text-sm" style={{ color: "#1C1917" }}>{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#A8A29E" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl mb-3" style={{ ...serifStyle, color: "#1C1917" }}>Simple pricing.</h2>
            <p className="text-base" style={{ color: "#78716C" }}>Start free. Upgrade when you love it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="animate-fade-in-up delay-100" style={{ backgroundColor: "#FAFAF7", border: "1px solid rgba(28,25,23,0.12)" }}>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1" style={{ color: "#1C1917" }}>Free</h3>
                <p className="text-4xl font-extrabold mb-1" style={{ ...serifStyle, color: "#1C1917" }}>$0</p>
                <p className="text-xs mb-7" style={{ color: "#A8A29E" }}>No card required</p>
                <ul className="space-y-3 mb-8">
                  {["5 AI breakdowns/month","Unlimited manual steps","Session history","No account required"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#44403C" }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/app/new">
                  <Button variant="outline" className="w-full font-semibold" style={{ borderColor: "rgba(28,25,23,0.2)", color: "#1C1917" }}>Start for Free</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="animate-fade-in-up delay-200 relative" style={{ backgroundColor: "#FAFAF7", border: "2px solid #7c3aed", boxShadow: "0 8px 32px rgba(124,58,237,0.12)" }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="text-xs font-bold px-3 py-1" style={{ backgroundColor: "#7c3aed", color: "white", border: "none" }}>Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1" style={{ color: "#1C1917" }}>Pro</h3>
                <p className="text-4xl font-extrabold mb-0.5" style={{ ...serifStyle, color: "#1C1917" }}>
                  $7.99<span className="text-base font-normal ml-1" style={{ color: "#A8A29E" }}>/mo</span>
                </p>
                <p className="text-xs mb-7" style={{ color: "#A8A29E" }}>or $39/year &mdash; save 59%</p>
                <ul className="space-y-3 mb-8">
                  {["Unlimited AI breakdowns","Make step easier (AI sub-steps)","Email reminders","Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#44403C" }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#7c3aed" }} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button className="w-full font-semibold" style={{ backgroundColor: "#7c3aed", color: "white" }}>Get Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#7c3aed" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase mb-5 animate-fade-in-up"
            style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em" }}>
            You&apos;ve read enough
          </p>
          <h2 className="text-4xl md:text-5xl leading-tight mb-6 animate-fade-in-up delay-100" style={{ ...serifStyle, color: "white" }}>
            Your brain works differently.{" "}
            <em style={{ color: "#fbbf24" }}>That&apos;s okay.</em>
          </h2>
          <p className="text-lg mb-10 animate-fade-in-up delay-200" style={{ color: "rgba(255,255,255,0.75)" }}>
            Built for the moments when your to-do list feels impossible. One task. One step. Right now.
          </p>
          <div className="animate-fade-in-up delay-300">
            <Link href="/app/new">
              <Button size="lg" className="text-base font-semibold px-8 py-6 rounded-xl"
                style={{ backgroundColor: "white", color: "#7c3aed", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
                Start Your First Task &mdash; Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm animate-fade-in-up delay-400" style={{ color: "rgba(255,255,255,0.45)" }}>
            No account required &middot; Works on any device
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8" style={{ backgroundColor: "#FAFAF7", borderTop: "1px solid rgba(28,25,23,0.08)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#7c3aed" }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: "#1C1917" }}>FocusSteps</span>
          </div>
          <p className="text-xs" style={{ color: "#A8A29E" }}>Built with care for ADHD brains everywhere.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-xs" style={{ color: "#78716C" }}>Pricing</Link>
            <Link href="/login" className="text-xs" style={{ color: "#78716C" }}>Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
