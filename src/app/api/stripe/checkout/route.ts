import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authSession = await auth();
    if (!authSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const priceId = body.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      return NextResponse.json({ error: "Stripe billing is not configured" }, { status: 503 });
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const subscription = await prisma.subscription.findUnique({
      where: { userId: authSession.user.id },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: authSession.user.email || undefined,
        name: authSession.user.name || undefined,
        metadata: { userId: authSession.user.id },
      });
      customerId = customer.id;

      await prisma.subscription.upsert({
        where: { userId: authSession.user.id },
        create: { userId: authSession.user.id, stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: appUrl + "/settings?success=true",
      cancel_url: appUrl + "/pricing?canceled=true",
      metadata: { userId: authSession.user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
