import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocalSession {
  key: string;
  onboardingCompleted: boolean;
  aiUsageCount: number;
}

interface SessionStore {
  localSession: LocalSession;
  setOnboardingCompleted: () => void;
  incrementUsageCount: () => void;
  getOrCreateKey: () => string;
}

function generateKey() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      localSession: {
        key: generateKey(),
        onboardingCompleted: false,
        aiUsageCount: 0,
      },
      setOnboardingCompleted: () =>
        set((state) => ({
          localSession: { ...state.localSession, onboardingCompleted: true },
        })),
      incrementUsageCount: () =>
        set((state) => ({
          localSession: {
            ...state.localSession,
            aiUsageCount: state.localSession.aiUsageCount + 1,
          },
        })),
      getOrCreateKey: () => get().localSession.key,
    }),
    { name: "adhd-planner-session" }
  )
);
