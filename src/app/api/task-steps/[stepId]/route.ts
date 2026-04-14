import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateStepSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "DONE", "SKIPPED"]).optional(),
  title: z.string().min(1).max(500).optional(),
  actualMinutes: z.number().optional(),
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ stepId: string }> }) {
  try {
    const { stepId } = await context.params;
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
    await prisma.taskStep.delete({ where: { id: stepId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting step:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
