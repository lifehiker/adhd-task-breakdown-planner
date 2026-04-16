"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  PauseCircle,
  Play,
  SkipForward,
  Sparkles,
  TimerReset,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLocalSessionHeaders, rememberLocalSessionId } from "@/lib/local-session-client";

type Step = {
  id: string;
  title: string;
  estimatedMinutes: number;
  actualMinutes?: number | null;
  status: string;
  order: number;
};

type Session = {
  id: string;
  userId?: string | null;
  title: string;
  targetMinutes: number;
  status: string;
  totalMinutesSpent: number | null;
  steps: Step[];
};

function timerStorageKey(sessionId: string, stepId: string) {
  return `focussteps-timer-${sessionId}-${stepId}`;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [makingEasier, setMakingEasier] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showContinuation, setShowContinuation] = useState(false);
  const [completedStepTitle, setCompletedStepTitle] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const continuationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchSession() {
    try {
      const res = await fetch(`/api/task-sessions/${id}`, {
        headers: getLocalSessionHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to load session");
      }

      const data = (await res.json()) as Session;
      setSession(data);
      rememberLocalSessionId(data.id);
    } catch (error) {
      console.error(error);
      toast.error("Could not load this session.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (continuationTimerRef.current) clearTimeout(continuationTimerRef.current);
    };
  }, []);

  const actionableSteps = session?.steps.filter((step) => step.status !== "DONE" && step.status !== "SKIPPED") ?? [];
  const doneSteps = session?.steps.filter((step) => step.status === "DONE" || step.status === "SKIPPED") ?? [];
  const completedSteps = session?.steps.filter((step) => step.status === "DONE") ?? [];
  const skippedSteps = session?.steps.filter((step) => step.status === "SKIPPED") ?? [];
  const currentStep = actionableSteps[0] ?? null;
  const progress = session?.steps.length ? Math.round((doneSteps.length / session.steps.length) * 100) : 0;
  const allDone = Boolean(session?.steps.length) && actionableSteps.length === 0;
  const showResumeNudge = Boolean(currentStep && doneSteps.length > 0 && !timerStarted && !timerExpired);

  useEffect(() => {
    if (!id || !currentStep) return;

    const stored = localStorage.getItem(timerStorageKey(id, currentStep.id));
    if (stored) {
      const remaining = Number.parseInt(stored, 10);
      if (remaining > 0) {
        setTimer(remaining);
        setTimerStarted(true);
        setTimerRunning(false);
        setTimerExpired(false);
        return;
      }
    }

    setTimer(currentStep.estimatedMinutes * 60);
    setTimerStarted(false);
    setTimerRunning(false);
    setTimerExpired(false);
  }, [currentStep, id]);

  useEffect(() => {
    if (!timerRunning || !currentStep) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((currentValue) => {
        if (currentValue <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerRunning(false);
          setTimerExpired(true);
          localStorage.removeItem(timerStorageKey(id, currentStep.id));
          return 0;
        }

        const nextValue = currentValue - 1;
        localStorage.setItem(timerStorageKey(id, currentStep.id), String(nextValue));
        return nextValue;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentStep, id, timerRunning]);

  function startTimer() {
    setTimerStarted(true);
    setTimerRunning(true);
    setTimerExpired(false);
  }

  function pauseTimer() {
    setTimerRunning(false);
    toast("Timer paused. You can resume when you are ready.");
  }

  function addMoreTime() {
    setTimer((value) => value + 300);
    setTimerExpired(false);
    setTimerRunning(true);
  }

  async function setSessionStatus(status: "ACTIVE" | "ABANDONED" | "COMPLETED") {
    const res = await fetch(`/api/task-sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Could not update session status");
    }

    return (await res.json()) as Session;
  }

  async function markStepDone(stepId: string, status: "DONE" | "SKIPPED") {
    if (!currentStep) return;

    setUpdating(true);
    const elapsedSeconds = currentStep.estimatedMinutes * 60 - timer;
    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const isDone = status === "DONE";
    const hasMoreSteps = actionableSteps.length > 1;

    try {
      localStorage.removeItem(timerStorageKey(id, stepId));

      const res = await fetch(`/api/task-steps/${stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ status, actualMinutes }),
      });

      if (!res.ok) {
        throw new Error("Could not update step");
      }

      setTimerStarted(false);
      setTimerRunning(false);
      setTimerExpired(false);

      if (isDone && hasMoreSteps) {
        setCompletedStepTitle(currentStep.title);
        setShowContinuation(true);
        continuationTimerRef.current = setTimeout(() => {
          setShowContinuation(false);
          fetchSession();
        }, 1500);
      } else {
        await fetchSession();
        toast(isDone ? "Step complete." : "Step skipped.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not update this step.");
    } finally {
      setUpdating(false);
    }
  }

  async function makeCurrentStepEasier() {
    if (!currentStep) return;

    setMakingEasier(true);
    try {
      const res = await fetch(`/api/task-steps/${currentStep.id}/make-easier`, {
        method: "POST",
        headers: getLocalSessionHeaders(),
      });

      if (res.status === 403) {
        toast.error("Make Easier is part of Pro.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to simplify step");
      }

      localStorage.removeItem(timerStorageKey(id, currentStep.id));
      setTimerStarted(false);
      setTimerRunning(false);
      setTimerExpired(false);
      await fetchSession();
      toast.success("Current step broken into smaller pieces.");
    } catch (error) {
      console.error(error);
      toast.error("Could not simplify this step.");
    } finally {
      setMakingEasier(false);
    }
  }

  async function setStepDuration(stepId: string, minutes: number) {
    try {
      const res = await fetch(`/api/task-steps/${stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ estimatedMinutes: minutes }),
      });

      if (!res.ok) {
        throw new Error("Failed to update step length");
      }

      setTimer(minutes * 60);
      setTimerStarted(false);
      setTimerRunning(false);
      setTimerExpired(false);
      localStorage.removeItem(timerStorageKey(id, stepId));
      await fetchSession();
    } catch (error) {
      console.error(error);
      toast.error("Could not update step length.");
    }
  }

  async function completeSession() {
    try {
      await setSessionStatus("COMPLETED");
      toast.success("Session completed.");
      await fetchSession();
    } catch (error) {
      console.error(error);
      toast.error("Could not complete this session.");
    }
  }

  async function abandonSession() {
    try {
      await setSessionStatus("ABANDONED");
      toast("Session moved to abandoned.");
      router.push("/app");
    } catch (error) {
      console.error(error);
      toast.error("Could not update this session.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-28">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-white/70 p-8 text-center">
        <p className="text-lg text-ink">Session not found.</p>
        <Button onClick={() => router.push("/app")} className="mt-5 rounded-full bg-teal text-white hover:bg-[#175553]">
          Back to dashboard
        </Button>
      </div>
    );
  }

  if (allDone || session.status === "COMPLETED") {
    return (
      <div className="mx-auto max-w-3xl animate-fade-in-up">
        <Card className="focus-panel overflow-hidden rounded-[2.2rem] border border-line">
          <CardContent className="p-7 md:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f5eb] text-[#1f7a4c] shadow-glow">
              <Trophy className="h-10 w-10" />
            </div>
            <div className="mt-6 text-center">
              <p className="focus-kicker mx-auto">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Session complete
              </p>
              <h1 className="mt-5 font-display text-5xl leading-none text-ink md:text-6xl">Task complete.</h1>
              <p className="mt-4 text-lg leading-8 text-ink-soft">{session.title}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="focus-card rounded-[1.6rem] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Done</p>
                <p className="mt-2 font-display text-5xl leading-none text-ink">{completedSteps.length}</p>
              </div>
              <div className="focus-card rounded-[1.6rem] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Skipped</p>
                <p className="mt-2 font-display text-5xl leading-none text-ink">{skippedSteps.length}</p>
              </div>
              <div className="focus-card rounded-[1.6rem] p-5 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Minutes spent</p>
                <p className="mt-2 font-display text-5xl leading-none text-ink">{session.totalMinutesSpent ?? 0}</p>
              </div>
            </div>

            {allDone && session.status !== "COMPLETED" ? (
              <Button
                onClick={completeSession}
                className="mt-8 h-14 w-full rounded-full bg-teal text-base text-white hover:bg-[#175553]"
              >
                Mark session complete
              </Button>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => router.push("/app/new")}
                className="h-12 rounded-full bg-clay px-6 text-white hover:bg-[#b45630]"
              >
                Start another task
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/app")}
                className="h-12 rounded-full border-line bg-white/80 px-6 text-ink"
              >
                Back to dashboard
              </Button>
            </div>

            {!session.userId ? (
              <div className="mt-8 rounded-[1.7rem] border border-line bg-white/75 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Save progress across devices</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  You completed this session in local mode. Create an account when you want sync, billing, and reminder emails.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="mt-4 rounded-full bg-clay text-white hover:bg-[#b45630]"
                >
                  Create account
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {showContinuation ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="focus-panel w-full max-w-md rounded-[2rem] p-7 text-center animate-fade-in-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f5eb] text-[#1f7a4c]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.24em] text-ink-soft">Step complete</p>
            <h2 className="mt-2 font-display text-4xl leading-none text-ink">Ready for the next tiny step?</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft line-through">{completedStepTitle}</p>
            <Button
              onClick={() => {
                if (continuationTimerRef.current) clearTimeout(continuationTimerRef.current);
                setShowContinuation(false);
                fetchSession();
              }}
              className="mt-6 h-12 w-full rounded-full bg-teal text-white hover:bg-[#175553]"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push("/app")}
          className="rounded-full px-0 text-ink hover:bg-transparent hover:text-teal"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/app")}
            className="rounded-full border-line bg-white/80 text-ink"
          >
            <PauseCircle className="mr-2 h-4 w-4" />
            Save for later
          </Button>
          <Button
            variant="outline"
            onClick={abandonSession}
            className="rounded-full border-line bg-white/80 text-ink-soft"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Abandon
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="focus-panel rounded-[2.2rem] p-6 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="focus-kicker mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Active session
                </p>
                <h1 className="font-display text-4xl leading-[0.92] text-ink md:text-6xl">{session.title}</h1>
              </div>
              <Badge className="rounded-full border-0 bg-[#16313a] px-4 py-1.5 text-[#f6f0e5]">
                {doneSteps.length + 1} / {session.steps.length}
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="focus-card rounded-[1.6rem] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Progress</p>
                <p className="mt-2 font-display text-5xl leading-none text-ink">{progress}%</p>
              </div>
              <div className="focus-card rounded-[1.6rem] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Target length</p>
                <p className="mt-2 font-display text-5xl leading-none text-ink">{session.targetMinutes}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-soft">minutes</p>
              </div>
              <div className="focus-card rounded-[1.6rem] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Focused time</p>
                <p className="mt-2 font-display text-5xl leading-none text-ink">{session.totalMinutesSpent ?? 0}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-soft">minutes logged</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-ink-soft">
                <span>{doneSteps.length} steps behind you</span>
                <span>{session.steps.length - doneSteps.length} left</span>
              </div>
              <Progress value={progress} className="h-2.5" />
            </div>
          </div>

          {showResumeNudge ? (
            <div className="rounded-[1.8rem] border border-line bg-white/75 px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Continue where you left off</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Want to continue where you left off? Your next step is already queued up.
              </p>
            </div>
          ) : null}

          {currentStep ? (
            <Card className={`overflow-hidden rounded-[2.2rem] border ${timerExpired ? "border-[#d97757]/40" : "border-line"} bg-[#16313a] text-white shadow-glow`}>
              <CardContent className="p-6 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/55">Current step</p>
                    <h2 className="mt-3 text-2xl leading-tight md:text-3xl">{currentStep.title}</h2>
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                    {currentStep.estimatedMinutes} min
                  </div>
                </div>

                {!timerStarted ? (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/48">Choose step length</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[5, 10, 15].map((minutes) => (
                        <Button
                          key={minutes}
                          type="button"
                          variant="outline"
                          onClick={() => setStepDuration(currentStep.id, minutes)}
                          className={
                            currentStep.estimatedMinutes === minutes
                              ? "rounded-full border-[#f0e4d0] bg-[#f0e4d0] text-[#16313a] hover:bg-white"
                              : "rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                          }
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-7 grid gap-6 md:grid-cols-[0.56fr_0.44fr] md:items-center">
                  <div className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/50">
                      <Clock3 className="h-4 w-4" />
                      Timer
                    </div>
                    <p className={`mt-4 font-display text-7xl leading-none ${timerExpired ? "text-[#f0c2ad]" : timer <= 60 ? "timer-urgent text-[#f0c2ad]" : "text-[#f6f0e5]"}`}>
                      {timerExpired ? "00:00" : formatTime(timer)}
                    </p>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-white/62">
                      {timerExpired
                        ? "Time is up. Choose the cleanest next move: done, more time, skip, or make it easier."
                        : timerStarted
                          ? "Keep your attention on just this one action."
                          : "Start the step when you are ready. The rest of the plan can stay quiet for a minute."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {!timerStarted ? (
                      <Button
                        onClick={startTimer}
                        className="h-14 w-full rounded-full bg-[#f0e4d0] text-base text-[#16313a] hover:bg-white"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start step
                      </Button>
                    ) : timerExpired ? (
                      <>
                        <Button
                          onClick={() => markStepDone(currentStep.id, "DONE")}
                          disabled={updating}
                          className="h-12 w-full rounded-full bg-[#e7f5eb] text-[#174f35] hover:bg-white"
                        >
                          {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Done</>}
                        </Button>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Button
                            onClick={addMoreTime}
                            variant="outline"
                            className="h-11 rounded-full border-white/15 bg-white/6 text-white hover:bg-white/10"
                          >
                            <TimerReset className="mr-2 h-4 w-4" />
                            5 more min
                          </Button>
                          <Button
                            onClick={() => markStepDone(currentStep.id, "SKIPPED")}
                            disabled={updating}
                            variant="outline"
                            className="h-11 rounded-full border-white/15 bg-white/6 text-white hover:bg-white/10"
                          >
                            <SkipForward className="mr-2 h-4 w-4" />
                            Skip
                          </Button>
                        </div>
                        <Button
                          onClick={makeCurrentStepEasier}
                          disabled={makingEasier}
                          variant="outline"
                          className="h-11 w-full rounded-full border-[#f0c2ad]/35 bg-white/6 text-[#f0c2ad] hover:bg-white/10"
                        >
                          {makingEasier ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Make easier
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => markStepDone(currentStep.id, "DONE")}
                          disabled={updating}
                          className="h-12 w-full rounded-full bg-[#e7f5eb] text-[#174f35] hover:bg-white"
                        >
                          {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Done</>}
                        </Button>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Button
                            onClick={pauseTimer}
                            variant="outline"
                            className="h-11 rounded-full border-white/15 bg-white/6 text-white hover:bg-white/10"
                          >
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Pause
                          </Button>
                          <Button
                            onClick={() => markStepDone(currentStep.id, "SKIPPED")}
                            disabled={updating}
                            variant="outline"
                            className="h-11 rounded-full border-white/15 bg-white/6 text-white hover:bg-white/10"
                          >
                            <SkipForward className="mr-2 h-4 w-4" />
                            Skip
                          </Button>
                        </div>
                        <Button
                          onClick={makeCurrentStepEasier}
                          disabled={makingEasier}
                          variant="outline"
                          className="h-11 w-full rounded-full border-[#f0c2ad]/35 bg-white/6 text-[#f0c2ad] hover:bg-white/10"
                        >
                          {makingEasier ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Make easier
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        <aside className="space-y-6">
          <Card className="focus-card rounded-[2rem] border border-line">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Step queue</p>
                  <h2 className="mt-1 font-display text-4xl leading-none text-ink">One thing at a time.</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {session.steps.map((step, index) => {
                  const isCurrent = step.id === currentStep?.id;
                  const isDone = step.status === "DONE";
                  const isSkipped = step.status === "SKIPPED";

                  return (
                    <div
                      key={step.id}
                      className={`rounded-[1.35rem] border px-4 py-4 transition-transform ${
                        isCurrent
                          ? "border-transparent bg-[#16313a] text-white shadow-glow"
                          : isDone
                            ? "border-[rgba(31,122,76,0.12)] bg-[#eef7f1] text-[#1d5c40]"
                            : isSkipped
                              ? "border-line bg-white/65 text-ink-soft"
                              : "border-line bg-white/85 text-ink"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            isCurrent
                              ? "bg-white/12 text-white"
                              : isDone
                                ? "bg-[#cde6d7] text-[#1d5c40]"
                                : isSkipped
                                  ? "bg-[#ece4d8] text-ink-soft"
                                  : "bg-[#f0e4d0] text-ink"
                          }`}
                        >
                          {isDone ? "✓" : index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm leading-6 ${isSkipped ? "line-through" : ""}`}>{step.title}</p>
                          <p className={`mt-1 text-xs uppercase tracking-[0.16em] ${isCurrent ? "text-white/55" : "text-ink-soft"}`}>
                            {step.estimatedMinutes} min
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {!session.userId && completedSteps.length > 0 ? (
            <Card className="focus-panel rounded-[2rem] border border-line">
              <CardContent className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Want this saved beyond this device?</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Create an account after your first finished step to keep history, sync sessions, and unlock reminder emails later.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="mt-4 rounded-full bg-clay text-white hover:bg-[#b45630]"
                >
                  Create account
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
