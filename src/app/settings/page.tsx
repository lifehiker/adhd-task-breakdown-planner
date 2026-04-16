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
    const { getStripe } = await import("@/lib/stripe");
    const sub = await prisma.subscription.findUnique({
      where: { userId: session!.user!.id },
    });
    if (!sub?.stripeCustomerId) return;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: appUrl + "/settings",
    });
    redirect(portalSession.url);
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen px-5 py-5 md:px-8">
      <nav className="focus-panel sticky top-4 z-40 mx-auto flex max-w-6xl items-center justify-between rounded-[2rem] px-4 py-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/app" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white shadow-glow">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-3xl leading-none text-ink">FocusSteps</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-soft">Account settings</p>
            </div>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-ink">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/app/new">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-ink">
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </Link>
          </div>
        </div>
        <form action={handleSignOut}>
          <Button type="submit" variant="outline" size="sm" className="gap-1.5 rounded-full border-line bg-white/75 text-red-700">
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </form>
      </nav>

      <main className="mx-auto max-w-6xl py-10">
        <div className="mb-8 max-w-3xl">
          <p className="focus-kicker mb-5">Settings</p>
          <h1 className="font-display text-5xl leading-[0.94] tracking-[-0.03em] text-ink md:text-6xl">
            Account details,
            <span className="block text-clay">without dashboard clutter.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
            Billing and identity live here so the working session surface can stay narrow and calm.
          </p>
        </div>

        <div className="grid max-w-4xl gap-6">
          <Card className="focus-card border border-line rounded-[2rem]">
            <CardHeader>
              <CardTitle className="font-display text-3xl text-ink">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {session.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="" className="h-14 w-14 rounded-full object-cover" />
                )}
                <div>
                  <p className="text-lg font-medium text-ink">{session.user.name || "FocusSteps user"}</p>
                  <p className="text-sm text-ink-soft">{session.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="focus-panel border border-line rounded-[2rem]">
            <CardHeader>
              <CardTitle className="font-display text-3xl text-ink">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={isPro ? "border-0 bg-teal px-3 py-1 text-white" : "border-0 bg-[#f0e4d0] px-3 py-1 text-ink"}>
                  {isPro ? "Pro" : "Free plan"}
                </Badge>
                {isPro && subscription?.currentPeriodEnd && (
                  <span className="text-sm text-ink-soft">
                    Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                )}
              </div>

              {isPro ? (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-ink-soft">
                    Unlimited AI breakdowns and account-level features are active.
                  </p>
                  <form action={createPortalSession}>
                    <Button type="submit" variant="outline" className="rounded-full border-line bg-white/80 text-ink">
                      Manage billing
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-ink-soft">
                    Upgrade when you want unlimited AI breakdowns, reminders, and full billing controls.
                  </p>
                  <Link href="/pricing">
                    <Button className="rounded-full bg-clay text-white hover:bg-[#b45630]">Upgrade to Pro</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
