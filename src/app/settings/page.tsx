import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
    const res = await fetch((process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: "" },
    });
    const data = await res.json();
    if (data.url) redirect(data.url);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {session.user.image && (
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
  );
}
