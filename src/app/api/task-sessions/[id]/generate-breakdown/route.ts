import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateTaskBreakdown } from "@/lib/ai";
import { getMonthlyUsageCount, isUserPro, FREE_TIER_LIMIT } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const authSession = await auth();
    const userId = authSession?.user?.id ?? null;
    const body = await req.json();
    const localSessionKey = body.localSessionKey ?? null;

    const taskSession = await prisma.taskSession.findUnique({ where: { id } });
    if (!taskSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    if (!userId || !(await isUserPro(userId))) {
      const usageCount = await getMonthlyUsageCount(userId, localSessionKey);
      if (usageCount >= FREE_TIER_LIMIT) {
        return NextResponse.json(
          { error: "USAGE_LIMIT_REACHED", limit: FREE_TIER_LIMIT, current: usageCount },
          { status: 429 }
        );
      }
    }

    await prisma.taskStep.deleteMany({ where: { taskSessionId: id } });

    const breakdown = await generateTaskBreakdown({
      title: taskSession.title,
      targetMinutes: taskSession.targetMinutes,
    });

    const steps = await Promise.all(
      breakdown.steps.map((step, index) =>
        prisma.taskStep.create({
          data: {
            taskSessionId: id,
            order: index,
            title: step.title,
            estimatedMinutes: step.estimatedMinutes,
            status: "PENDING",
          },
        })
      )
    );

    await prisma.usageEvent.create({
      data: { userId, localSessionKey, type: "AI_BREAKDOWN_CREATED" },
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Error generating breakdown:", error);
    return NextResponse.json({ error: "Failed to generate breakdown" }, { status: 500 });
  }
}
