import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateSessionSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "ABANDONED"]).optional(),
  totalMinutesSpent: z.number().optional(),
});

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const taskSession = await prisma.taskSession.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: "asc" } } },
    });
    if (!taskSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const authSession = await auth();
    if (taskSession.userId && taskSession.userId !== authSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json(taskSession);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data = UpdateSessionSchema.parse(body);
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.totalMinutesSpent !== undefined) updateData.totalMinutesSpent = data.totalMinutesSpent;
    if (data.status === "COMPLETED") updateData.completedAt = new Date();
    const taskSession = await prisma.taskSession.update({
      where: { id },
      data: updateData,
      include: { steps: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(taskSession);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors }, { status: 400 });
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
