"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalSessionHeaders, readLocalSessionIds } from "@/lib/local-session-client";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";

type SessionSummary = {
  id: string;
  title: string;
  status: string;
  targetMinutes: number;
  steps: Array<{ status: string }>;
};

export function AnonymousDashboard() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      const ids = readLocalSessionIds().reverse().slice(0, 8);
      if (!ids.length) return;

      const results = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch("/api/task-sessions/" + id, { headers: getLocalSessionHeaders() });
          if (!res.ok) return null;
          return (await res.json()) as SessionSummary;
        })
      );

      if (!cancelled) {
        setSessions(results.filter((value): value is SessionSummary => Boolean(value)));
      }
    }

    loadSessions();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSessions = sessions.filter((session) => session.status === "ACTIVE");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="animate-fade-in-up">
        <div className="focus-kicker mb-5">
          <Sparkles className="h-3.5 w-3.5" />
          Local mode
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] text-ink md:text-7xl">
          Start now.
          <span className="block text-clay">Create the account later.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">
          Your unfinished sessions stay saved on this device. Sign in only when you want sync, billing, or reminder emails.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/app/new">
            <Button className="h-14 rounded-full bg-teal px-7 text-white hover:bg-[#175553]">
              Start a new task
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-14 rounded-full border-line bg-white/75 px-7 text-ink">
              Sign in for sync
            </Button>
          </Link>
        </div>
      </section>

      <section className="animate-fade-in-up delay-200">
        <div className="focus-panel rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">Continue where you left off</p>
              <h2 className="mt-1 font-display text-4xl leading-none text-ink">Your saved local sessions</h2>
            </div>
          </div>

          <div className="space-y-3">
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => {
                const doneCount = session.steps.filter((step) => step.status === "DONE" || step.status === "SKIPPED").length;
                return (
                  <Link
                    key={session.id}
                    href={`/app/session/${session.id}`}
                    className="block rounded-[1.4rem] border border-line bg-white/75 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-ink">{session.title}</p>
                        <p className="mt-1 text-sm text-ink-soft">
                          {doneCount}/{session.steps.length} steps complete
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ink-soft">
                        <Clock3 className="h-4 w-4" />
                        {session.targetMinutes} min
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <Card className="focus-card border border-line">
                <CardContent className="p-5">
                  <p className="text-sm leading-6 text-ink-soft">
                    No local sessions yet. Start one task, and this screen will turn into your return point.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
