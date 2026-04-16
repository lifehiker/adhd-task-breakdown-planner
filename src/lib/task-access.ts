type TaskSessionAccessRecord = {
  userId: string | null;
  localSessionKey: string | null;
};

export function canAccessTaskSession({
  taskSession,
  userId,
  localSessionKey,
}: {
  taskSession: TaskSessionAccessRecord | null | undefined;
  userId: string | null | undefined;
  localSessionKey?: string | null;
}) {
  if (!taskSession) {
    return false;
  }

  if (taskSession.userId) {
    return taskSession.userId === userId;
  }

  if (taskSession.localSessionKey) {
    return taskSession.localSessionKey === localSessionKey;
  }

  return true;
}
