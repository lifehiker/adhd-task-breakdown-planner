"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TaskInputForm } from "@/components/TaskInputForm";
import { BreakdownPreview } from "@/components/BreakdownPreview";
import { OnboardingSlides } from "@/components/OnboardingSlides";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { readLocalSessionIds, getLocalSessionHeaders, getLocalSessionKey } from "@/lib/local-session-client";
import { useSessionStore } from "@/store/session";
import { ArrowRight, Clock3, Loader2, Sparkles, Wand2 } from "lucide-react";

type Step = {
  id: string;
  title: string;
  estimatedMinutes: number;
  order: number;
  status: string;
};

type SessionSummary = {
  id: string;
  title: string;
  status: string;
  targetMinutes: number;
  steps: Step[];
  updatedAt?: string;
};

export function NewTaskExperience() {
  const { localSession } = useSessionStore();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<SessionSummary | null>(null);
  const [recentLocalSessions, setRecentLocalSessions] = useState<SessionSummary[]>([]);
  const [checkingRecents, setCheckingRecents] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usageData, setUsageData] = useState<{ isPro: boolean; remaining: number | null } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsage() {
      try {
        const res = await fetch("/api/usage/check?localSessionKey=" + encodeURIComponent(getLocalSessionKey()));
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setUsageData({ isPro: Boolean(data.isPro), remaining: data.remaining ?? null });
      } catch {
        // ignore usage fetch issues
      }
    }

    async function loadRecentSessions() {
      const ids = readLocalSessionIds().reverse().slice(0, 6);
      if (ids.length === 0) {
        if (!cancelled) setCheckingRecents(false);
        return;
      }

      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch("/api/task-sessions/" + id, { headers: getLocalSessionHeaders() });
            if (!res.ok) return null;
            const data = await res.json();
            return data as SessionSummary;
          })
        );

        if (!cancelled) {
          setRecentLocalSessions(
            results.filter((value): value is SessionSummary => value !== null && value.status !== "COMPLETED")
          );
        }
      } finally {
        if (!cancelled) setCheckingRecents(false);
      }
    }

    void loadUsage();
    loadRecentSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshUsage() {
    try {
      const res = await fetch("/api/usage/check?localSessionKey=" + encodeURIComponent(getLocalSessionKey()));
      if (!res.ok) return;
      const data = await res.json();
      setUsageData({ isPro: Boolean(data.isPro), remaining: data.remaining ?? null });
    } catch {
      // ignore usage fetch issues
    }
  }

  useEffect(() => {
    if (!activeSessionId) return;
    let cancelled = false;

    async function loadSession() {
      const res = await fetch("/api/task-sessions/" + activeSessionId, { headers: getLocalSessionHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      if (!cancelled) setActiveSession(data);
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [activeSessionId]);

  return (
    <>
      {!localSession.onboardingCompleted && <OnboardingSlides onComplete={() => undefined} />}
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="animate-fade-in-up">
          <div className="focus-kicker mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            New working session
          </div>
          <h1 className="font-display text-5xl leading-[0.94] tracking-[-0.03em] text-ink md:text-7xl">
            Turn a blurry,
            <span className="block text-clay">stuck-feeling task into motion.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">
            Write the task exactly how it feels in your head. FocusSteps will break it into tiny steps, and you can
            edit the plan before you start.
          </p>

          <div className="mt-8 rounded-[2rem] border border-line bg-white/70 p-5 shadow-glow">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
                  {usageData?.isPro ? "Pro plan" : "Free plan"}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {usageData?.isPro
                    ? "Unlimited AI breakdowns are active on your account."
                    : "You get 5 AI breakdowns per month before upgrading."}
                </p>
              </div>
              <Badge className={`rounded-full border-0 px-3 py-1 ${usageData?.isPro ? "bg-teal text-white" : "bg-[#16313a] text-[#f6f0e5]"}`}>
                {usageData == null ? "Checking..." : usageData.isPro ? "Unlimited" : `${usageData.remaining ?? 0} left`}
              </Badge>
            </div>
            <TaskInputForm
              onSuccess={(sessionId) => {
                setActiveSessionId(sessionId);
              }}
              onUsageLimit={() => {
                setShowUpgrade(true);
              }}
              onBreakdownGenerated={() => {
                void refreshUsage();
              }}
            />
          </div>
        </section>

        <section className="animate-fade-in-up delay-200 space-y-5">
          {activeSession ? (
            <div className="focus-panel rounded-[2rem] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">Step edit pass</p>
                  <h2 className="mt-1 font-display text-4xl leading-none text-ink">Shape the session before you begin.</h2>
                </div>
                <Badge className="rounded-full border-0 bg-teal px-3 py-1 text-white">{activeSession.steps.length} steps</Badge>
              </div>
              <BreakdownPreview
                sessionId={activeSession.id}
                initialSteps={activeSession.steps}
                onUsageLimit={() => {
                  setShowUpgrade(true);
                }}
                onBreakdownGenerated={() => {
                  void refreshUsage();
                }}
              />
            </div>
          ) : (
            <div className="focus-panel overflow-hidden rounded-[2rem] p-6 md:p-7">
              <div className="rounded-[1.8rem] border border-line bg-[#16313a] p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/60">Preview</p>
                    <h2 className="mt-2 font-display text-4xl leading-none">Your tiny-step plan shows up here.</h2>
                  </div>
                  <Wand2 className="h-8 w-8 text-[#f0c2ad]" />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    "Open the materials you need",
                    "Pull out the first obvious sub-task",
                    "Work one short timer at a time",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/14 text-xs font-semibold">
                        0{index + 1}
                      </span>
                      <span className="text-sm text-white/80">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Card className="focus-card border border-line">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Editable</p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      Delete, rewrite, add a manual step, or regenerate the whole sequence if the first pass feels off.
                    </p>
                  </CardContent>
                </Card>
                <Card className="focus-card border border-line">
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Execution-ready</p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      Once it looks right, launch straight into a focused current-step timer instead of another list.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="rounded-[2rem] border border-line bg-white/65 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">Continue where you left off</p>
                <p className="mt-1 text-sm text-ink-soft">Unfinished local sessions stay on this device even without an account.</p>
              </div>
              <Link href="/app">
                <Button variant="outline" className="rounded-full border-line bg-white/80 text-ink">
                  View dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {checkingRecents ? (
                <div className="flex items-center gap-2 text-sm text-ink-soft">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking your unfinished local sessions
                </div>
              ) : recentLocalSessions.length > 0 ? (
                recentLocalSessions.slice(0, 3).map((session) => {
                  const completed = session.steps.filter((step) => step.status === "DONE" || step.status === "SKIPPED").length;
                  return (
                    <Link
                      key={session.id}
                      href={`/app/session/${session.id}`}
                      className="flex items-center justify-between rounded-[1.3rem] border border-line bg-white/75 px-4 py-3 transition-transform hover:-translate-y-0.5"
                    >
                      <div>
                        <p className="font-medium text-ink">{session.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-soft">
                          {completed}/{session.steps.length} steps done
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ink-soft">
                        <Clock3 className="h-4 w-4" />
                        {session.targetMinutes} min
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-ink-soft">No unfinished local sessions yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
