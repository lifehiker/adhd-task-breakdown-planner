import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { makeStepEasier } from "@/lib/ai";
import { isUserPro } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, context: { params: Promise<{ stepId: string }> }) {
  try {
    const { stepId } = await context.params;
    const authSession = await auth();
    const userId = authSession?.user?.id;

    if (!userId || !(await isUserPro(userId))) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    const step = await prisma.taskStep.findUnique({
      where: { id: stepId },
      include: { taskSession: true },
    });
    if (!step) return NextResponse.json({ error: "Step not found" }, { status: 404 });

    const breakdown = await makeStepEasier({
      stepTitle: step.title,
      context: step.taskSession.title,
    });

    const currentOrder = step.order;
    await prisma.taskStep.updateMany({
      where: { taskSessionId: step.taskSessionId, order: { gt: currentOrder } },
      data: { order: { increment: breakdown.steps.length - 1 } },
    });
    await prisma.taskStep.delete({ where: { id: stepId } });

    const newSteps = await Promise.all(
      breakdown.steps.map((s, i) =>
        prisma.taskStep.create({
          data: {
            taskSessionId: step.taskSessionId,
            order: currentOrder + i,
            title: s.title,
            estimatedMinutes: s.estimatedMinutes,
            status: "PENDING",
          },
        })
      )
    );

    return NextResponse.json({ steps: newSteps });
  } catch (error) {
    console.error("Error making step easier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
