import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Zap, LayoutDashboard, Plus, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isPro = subscription?.status === "active" &&
    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date());

  async function createPortalSession() {
    "use server";
    const { stripe } = await import("@/lib/stripe");
    const sub = await prisma.subscription.findUnique({
      where: { userId: session!.user!.id },
    });
    if (!sub?.stripeCustomerId) return;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: appUrl + "/settings",
    });
    redirect(portalSession.url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">FocusSteps</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/app/new">
                <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <Button type="submit" variant="ghost" size="sm" className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </form>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {session.user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="w-12 h-12 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-sm text-gray-500">{session.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={isPro ? "bg-[#7c3aed] text-white border-0" : "bg-gray-100 text-gray-600 border-0"}>
                    {isPro ? "Pro" : "Free Plan"}
                  </Badge>
                  {isPro && subscription?.currentPeriodEnd && (
                    <span className="text-sm text-gray-500">
                      Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {isPro ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">You have unlimited AI breakdowns and all Pro features.</p>
                    <form action={createPortalSession}>
                      <Button type="submit" variant="outline">Manage Billing</Button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Upgrade to Pro for unlimited AI breakdowns and more.</p>
                    <Link href="/pricing">
                      <Button className="bg-[#7c3aed] hover:bg-[#6d28d9]">Upgrade to Pro</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
