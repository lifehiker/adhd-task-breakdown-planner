import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canAccessTaskSession } from "@/lib/task-access";
import { z } from "zod";

export const dynamic = "force-dynamic";

const AddStepSchema = z.object({
  title: z.string().min(1).max(500),
  estimatedMinutes: z.number().min(1).max(60).default(5),
});

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const authSession = await auth();
    const taskSession = await prisma.taskSession.findUnique({
      where: { id },
      select: { id: true, userId: true, localSessionKey: true },
    });
    if (!taskSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const localSessionKey = req.headers.get("x-local-session-key");
    if (!canAccessTaskSession({
      taskSession,
      userId: authSession?.user?.id,
      localSessionKey,
    })) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = AddStepSchema.parse(body);
    const maxOrder = await prisma.taskStep.aggregate({
      where: { taskSessionId: id },
      _max: { order: true },
    });
    const newOrder = (maxOrder._max.order ?? -1) + 1;
    const step = await prisma.taskStep.create({
      data: {
        taskSessionId: id,
        order: newOrder,
        title: data.title,
        estimatedMinutes: data.estimatedMinutes,
        status: "PENDING",
      },
    });
    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
    console.error("Error adding step:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
