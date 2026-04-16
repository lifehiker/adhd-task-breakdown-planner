"use client";

import { useSessionStore } from "@/store/session";

const LOCAL_SESSION_IDS_KEY = "focussteps-local-session-ids";

export function getLocalSessionKey() {
  return useSessionStore.getState().localSession.key;
}

export function getLocalSessionHeaders(): Record<string, string> {
  const key = getLocalSessionKey();
  return key ? { "x-local-session-key": key } : {};
}

export function rememberLocalSessionId(sessionId: string) {
  if (typeof window === "undefined") return;

  const ids = new Set(readLocalSessionIds());
  ids.delete(sessionId);
  ids.add(sessionId);
  localStorage.setItem(LOCAL_SESSION_IDS_KEY, JSON.stringify(Array.from(ids).slice(-12)));
}

export function readLocalSessionIds() {
  if (typeof window === "undefined") return [] as string[];

  try {
    const raw = localStorage.getItem(LOCAL_SESSION_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}
