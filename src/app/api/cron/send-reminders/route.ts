import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendContinueSessionEmail } from "@/lib/email";
import { isUserPro } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fortyFiveMinutesAgo = new Date(Date.now() - 45 * 60 * 1000);

    const activeSessions = await prisma.taskSession.findMany({
      where: {
        status: "ACTIVE",
        updatedAt: { lt: fortyFiveMinutesAgo },
        userId: { not: null },
      },
      include: {
        user: true,
        reminderLogs: {
          where: { sentAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        },
      },
    });

    let sent = 0;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const session of activeSessions) {
      if (!session.user?.email || !session.userId) continue;
      if ((session.reminderLogs?.length ?? 0) > 0) continue;
      if (!(await isUserPro(session.userId))) continue;

      await sendContinueSessionEmail({
        to: session.user.email,
        sessionTitle: session.title,
        sessionId: session.id,
        appUrl,
      });

      await prisma.reminderLog.create({
        data: { taskSessionId: session.id, type: "CONTINUE_EMAIL" },
      });

      sent++;
    }

    return NextResponse.json({ sent, total: activeSessions.length });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
