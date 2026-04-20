import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMonthlyUsageCount, isUserPro, FREE_TIER_LIMIT } from "@/lib/subscription";
import { isPrismaAvailable } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!isPrismaAvailable) {
      return NextResponse.json({
        isPro: false,
        usageCount: 0,
        limit: FREE_TIER_LIMIT,
        remaining: FREE_TIER_LIMIT,
        limitReached: false,
      });
    }

    const authSession = await auth();
    const userId = authSession?.user?.id ?? null;
    const localSessionKey = req.nextUrl.searchParams.get("localSessionKey");
    const isPro = userId ? await isUserPro(userId) : false;
    const usageCount = await getMonthlyUsageCount(userId, localSessionKey);
    return NextResponse.json({
      isPro,
      usageCount,
      limit: isPro ? null : FREE_TIER_LIMIT,
      remaining: isPro ? null : Math.max(0, FREE_TIER_LIMIT - usageCount),
      limitReached: !isPro && usageCount >= FREE_TIER_LIMIT,
    });
  } catch (error) {
    console.error("Error checking usage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
