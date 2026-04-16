import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canAccessTaskSession } from "@/lib/task-access";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateStepSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "DONE", "SKIPPED"]).optional(),
  title: z.string().min(1).max(500).optional(),
  estimatedMinutes: z.number().min(1).max(60).optional(),
  actualMinutes: z.number().optional(),
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ stepId: string }> }) {
  try {
    const { stepId } = await context.params;
    const authSession = await auth();
    const existing = await prisma.taskStep.findUnique({
      where: { id: stepId },
      include: {
        taskSession: {
          select: { userId: true, localSessionKey: true },
        },
      },
    });
    if (!existing) return NextResponse.json({ error: "Step not found" }, { status: 404 });

    const localSessionKey = req.headers.get("x-local-session-key");
    if (!canAccessTaskSession({
      taskSession: existing.taskSession,
      userId: authSession?.user?.id,
      localSessionKey,
    })) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = UpdateStepSchema.parse(body);
    const step = await prisma.taskStep.update({ where: { id: stepId }, data });
    return NextResponse.json(step);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
    console.error("Error updating step:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ stepId: string }> }) {
  try {
    const { stepId } = await context.params;
    const authSession = await auth();
    const existing = await prisma.taskStep.findUnique({
      where: { id: stepId },
      include: {
        taskSession: {
          select: { userId: true, localSessionKey: true },
        },
      },
    });
    if (!existing) return NextResponse.json({ error: "Step not found" }, { status: 404 });

    const localSessionKey = req.headers.get("x-local-session-key");
    if (!canAccessTaskSession({
      taskSession: existing.taskSession,
      userId: authSession?.user?.id,
      localSessionKey,
    })) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.taskStep.delete({ where: { id: stepId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting step:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
