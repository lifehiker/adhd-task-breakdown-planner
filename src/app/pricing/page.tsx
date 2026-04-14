import { CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
    "Priority support",
    "All future features",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">FocusSteps</span>
          </Link>
          <Link href="/app/new"><Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9]">Start Free</Button></Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Honest Pricing</h1>
          <p className="text-xl text-gray-600">Start free. Upgrade when you love it.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <div className="text-5xl font-bold mb-6">Free forever</div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/app/new">
                <Button variant="outline" size="lg" className="w-full">Get Started Free</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#7c3aed] relative shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#7c3aed] text-white border-0 px-4 py-1 text-sm">Most Popular</Badge>
            </div>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <div className="text-5xl font-bold mb-1">$7.99/mo</div>
              <p className="text-gray-500 mb-6">or $39/year (save 59%)</p>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#7c3aed] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button size="lg" className="w-full bg-[#7c3aed] hover:bg-[#6d28d9]">Get Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
