import { prisma } from "./db";

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

export async function isUserPro(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;
  if (subscription.status !== "active") return false;
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) return false;
  return true;
}

export async function getMonthlyUsageCount(
  userId: string | null,
  localSessionKey: string | null
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const where = userId
    ? { userId, type: "AI_BREAKDOWN_CREATED", createdAt: { gte: startOfMonth } }
    : { localSessionKey, type: "AI_BREAKDOWN_CREATED", createdAt: { gte: startOfMonth } };

  return prisma.usageEvent.count({ where });
}

export const FREE_TIER_LIMIT = 5;
