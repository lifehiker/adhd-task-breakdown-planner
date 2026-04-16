type UserRecord = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  password?: string | null;
};

type SubscriptionRecord = {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: string;
  currentPeriodEnd: Date | null;
};

type ReminderLogRecord = {
  taskSessionId: string;
  type: string;
  sentAt: Date;
};

type TaskStepRecord = {
  id: string;
  taskSessionId: string;
  order: number;
  title: string;
  estimatedMinutes: number;
  actualMinutes: number | null;
  status: string;
  taskSession?: TaskSessionRecord;
};

type TaskSessionRecord = {
  id: string;
  userId: string | null;
  localSessionKey: string | null;
  title: string;
  status: string;
  targetMinutes: number;
  totalMinutesSpent: number;
  updatedAt: Date;
  steps?: TaskStepRecord[];
  user?: UserRecord | null;
  reminderLogs?: ReminderLogRecord[];
};

type UserDelegate = {
  findUnique(args: unknown): Promise<UserRecord | null>;
  create(args: unknown): Promise<UserRecord>;
};

type SubscriptionDelegate = {
  findUnique(args: unknown): Promise<SubscriptionRecord | null>;
  upsert(args: unknown): Promise<SubscriptionRecord>;
  update(args: unknown): Promise<SubscriptionRecord>;
};

type UsageEventDelegate = {
  count(args: unknown): Promise<number>;
  create(args: unknown): Promise<unknown>;
};

type TaskSessionDelegate = {
  findMany(args: unknown): Promise<TaskSessionRecord[]>;
  findUnique(args: unknown): Promise<TaskSessionRecord | null>;
  create(args: unknown): Promise<TaskSessionRecord>;
  update(args: unknown): Promise<TaskSessionRecord>;
};

type TaskStepDelegate = {
  findUnique(args: unknown): Promise<TaskStepRecord | null>;
  create(args: unknown): Promise<TaskStepRecord>;
  update(args: unknown): Promise<TaskStepRecord>;
  updateMany(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<TaskStepRecord>;
  deleteMany(args: unknown): Promise<unknown>;
  aggregate(args: unknown): Promise<{ _max: { order: number | null } }>;
};

type ReminderLogDelegate = {
  create(args: unknown): Promise<ReminderLogRecord>;
};

export type PrismaClientLike = {
  user: UserDelegate;
  subscription: SubscriptionDelegate;
  usageEvent: UsageEventDelegate;
  taskSession: TaskSessionDelegate;
  taskStep: TaskStepDelegate;
  reminderLog: ReminderLogDelegate;
};

declare global {
  var __prismaClient__: PrismaClientLike | undefined;
  var __prismaInitError__: Error | undefined;
}

function createUnavailableClient(error: Error): PrismaClientLike {
  const unavailableMethod = (model: string, operation: string) => {
    return () => {
      throw new Error(
        `Database access is unavailable because Prisma Client could not initialize. ` +
          `Attempted ${model}.${operation}(). Original error: ${error.message}`
      );
    };
  };

  return {
    user: {
      findUnique: unavailableMethod("user", "findUnique") as UserDelegate["findUnique"],
      create: unavailableMethod("user", "create") as UserDelegate["create"],
    },
    subscription: {
      findUnique: unavailableMethod("subscription", "findUnique") as SubscriptionDelegate["findUnique"],
      upsert: unavailableMethod("subscription", "upsert") as SubscriptionDelegate["upsert"],
      update: unavailableMethod("subscription", "update") as SubscriptionDelegate["update"],
    },
    usageEvent: {
      count: unavailableMethod("usageEvent", "count") as UsageEventDelegate["count"],
      create: unavailableMethod("usageEvent", "create") as UsageEventDelegate["create"],
    },
    taskSession: {
      findMany: unavailableMethod("taskSession", "findMany") as TaskSessionDelegate["findMany"],
      findUnique: unavailableMethod("taskSession", "findUnique") as TaskSessionDelegate["findUnique"],
      create: unavailableMethod("taskSession", "create") as TaskSessionDelegate["create"],
      update: unavailableMethod("taskSession", "update") as TaskSessionDelegate["update"],
    },
    taskStep: {
      findUnique: unavailableMethod("taskStep", "findUnique") as TaskStepDelegate["findUnique"],
      create: unavailableMethod("taskStep", "create") as TaskStepDelegate["create"],
      update: unavailableMethod("taskStep", "update") as TaskStepDelegate["update"],
      updateMany: unavailableMethod("taskStep", "updateMany") as TaskStepDelegate["updateMany"],
      delete: unavailableMethod("taskStep", "delete") as TaskStepDelegate["delete"],
      deleteMany: unavailableMethod("taskStep", "deleteMany") as TaskStepDelegate["deleteMany"],
      aggregate: unavailableMethod("taskStep", "aggregate") as TaskStepDelegate["aggregate"],
    },
    reminderLog: {
      create: unavailableMethod("reminderLog", "create") as ReminderLogDelegate["create"],
    },
  };
}

function initPrismaClient(): PrismaClientLike {
  if (globalThis.__prismaClient__) {
    return globalThis.__prismaClient__;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client") as {
      PrismaClient: new (options?: { log?: string[] }) => PrismaClientLike;
    };

    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    globalThis.__prismaClient__ = client;
    globalThis.__prismaInitError__ = undefined;
    return client;
  } catch (error) {
    const prismaError = error instanceof Error ? error : new Error("Unknown Prisma initialization error");
    globalThis.__prismaInitError__ = prismaError;
    const unavailableClient = createUnavailableClient(prismaError);
    globalThis.__prismaClient__ = unavailableClient;
    return unavailableClient;
  }
}

export const prisma = initPrismaClient();
export const isPrismaAvailable = !globalThis.__prismaInitError__;
export const prismaInitError = globalThis.__prismaInitError__ ?? null;
