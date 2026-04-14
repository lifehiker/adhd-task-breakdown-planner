import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Brain, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">FocusSteps</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</Link>
            <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
            <Link href="/app/new"><Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9]">Start Free</Button></Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/60 to-white pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Badge className="mb-6 bg-purple-100 text-purple-700 border-0 animate-fade-in-up">Built for ADHD brains</Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up delay-100">
            Break Any Task Into <span className="text-[#7c3aed]">Tiny Steps</span><br />And Actually Start
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Task paralysis stops here. Get 3–8 tiny actionable steps in seconds. No setup. No calendar. Just start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/app/new">
              <Button size="lg" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-lg px-8 py-6 shadow-lg shadow-purple-200">
                Start for Free — No Setup <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">See Pricing</Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-400 animate-fade-in-up delay-400">No account required. 5 AI breakdowns free per month.</p>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12">Three steps. Start in under 30 seconds.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Type Your Task", desc: "Paste anything. The AI figures it out. No formatting required." },
              { step: "2", title: "AI Breaks It Down", desc: "Claude AI creates 3–8 tiny, concrete, timed steps in seconds." },
              { step: "3", title: "Work One Step at a Time", desc: "See one step. Hit Done. Move on. Your brain can handle this." },
            ].map((item, i) => (
              <div
                key={item.step}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${i * 120 + 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-lg mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-purple-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "FocusSteps broke my taxes into 6 steps and I finished in one sitting.", name: "Sarah M.", role: "Freelance Designer, ADHD" },
              { quote: "The Make it easier button is everything for executive dysfunction.", name: "Jordan K.", role: "Software Engineer" },
              { quote: "No login, no setup, just paste and go. Finally an app for ADHD brains.", name: "Alex T.", role: "Graduate student" },
            ].map((t) => (
              <Card key={t.name} className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-3">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />))}</div>
                  <p className="text-gray-700 text-sm mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 mb-12">Start free. Upgrade when you love it.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <p className="text-3xl font-extrabold text-gray-900 mb-6">$0</p>
                <ul className="text-left space-y-3 mb-8">
                  {["5 AI breakdowns/month","Unlimited manual steps","Session history","No account required"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
                <Link href="/app/new"><Button variant="outline" className="w-full">Start for Free</Button></Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#7c3aed] relative shadow-lg shadow-purple-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-[#7c3aed] text-white border-0">Most Popular</Badge></div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <p className="text-3xl font-extrabold text-gray-900 mb-0.5">$7.99<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-400 mb-6">or $39/year (save 59%)</p>
                <ul className="text-left space-y-3 mb-8">
                  {["Unlimited AI breakdowns","Make step easier (AI sub-steps)","Email reminders","Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-[#7c3aed] flex-shrink-0" />{f}</li>
                  ))}
                </ul>
                <Link href="/pricing"><Button className="w-full bg-[#7c3aed] hover:bg-[#6d28d9]">Get Pro</Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-[#7c3aed] px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <Brain className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Your brain works differently. That&apos;s okay.</h2>
          <p className="text-purple-200 text-lg mb-8">Built for the moments when your to-do list feels impossible.</p>
          <Link href="/app/new">
            <Button size="lg" className="bg-white text-[#7c3aed] hover:bg-gray-50 text-lg px-8 py-6 shadow-lg">
              Start Your First Task Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-gray-900">FocusSteps</span>
          <p className="text-sm text-gray-400">Built with care for ADHD brains everywhere.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="hover:text-gray-900">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
