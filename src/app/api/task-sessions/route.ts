import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateSessionSchema = z.object({
  title: z.string().min(1).max(500),
  targetMinutes: z.number().min(5).max(120).default(25),
  localSessionKey: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const data = CreateSessionSchema.parse(body);

    const taskSession = await prisma.taskSession.create({
      data: {
        title: data.title,
        targetMinutes: data.targetMinutes,
        userId: session?.user?.id ?? null,
        localSessionKey: data.localSessionKey ?? null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(taskSession, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating task session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.taskSession.findMany({
      where: { userId: session.user.id },
      include: {
        steps: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
