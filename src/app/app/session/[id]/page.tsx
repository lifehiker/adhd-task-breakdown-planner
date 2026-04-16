"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, SkipForward, Loader2, Clock, Trophy, ArrowLeft, Plus, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";
import { getLocalSessionHeaders, rememberLocalSessionId } from "@/lib/local-session-client";

type Step = {
  id: string;
  title: string;
  estimatedMinutes: number;
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

function timerKey(sessionId: string, stepId: string) {
  return `focussteps-timer-${sessionId}-${stepId}`;
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
  const [completedStepTitle, setCompletedStepTitle] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const continuationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/task-sessions/" + id, { headers: getLocalSessionHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        rememberLocalSessionId(data.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  // Clean up continuation timer on unmount
  useEffect(() => {
    return () => {
      if (continuationTimerRef.current) clearTimeout(continuationTimerRef.current);
    };
  }, []);

  const currentStepId = session?.steps.find(
    (s) => s.status !== "DONE" && s.status !== "SKIPPED"
  )?.id;

  useEffect(() => {
    if (!currentStepId || !id) return;
    const saved = localStorage.getItem(timerKey(id, currentStepId));
    const currentStep = session?.steps.find((s) => s.id === currentStepId);
    if (saved) {
      const remaining = parseInt(saved, 10);
      if (remaining > 0) {
        setTimer(remaining);
        setTimerStarted(true);
        setTimerRunning(false);
        setTimerExpired(false);
        return;
      }
    }
    setTimer((currentStep?.estimatedMinutes ?? 5) * 60);
    setTimerStarted(false);
    setTimerRunning(false);
    setTimerExpired(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId, id]);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setTimerRunning(false);
            setTimerExpired(true);
            if (currentStepId && id) localStorage.removeItem(timerKey(id, currentStepId));
            return 0;
          }
          const next = t - 1;
          if (currentStepId && id) localStorage.setItem(timerKey(id, currentStepId), String(next));
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning, currentStepId, id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
    </div>
  );

  if (!session) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Session not found</p>
      <Button onClick={() => router.push("/app")} className="mt-4">Back to dashboard</Button>
    </div>
  );

  const activeSteps = session.steps.filter((s) => s.status !== "DONE" && s.status !== "SKIPPED");
  const doneSteps = session.steps.filter((s) => s.status === "DONE" || s.status === "SKIPPED");
  const completedDoneSteps = session.steps.filter((s) => s.status === "DONE");
  const skippedSteps = session.steps.filter((s) => s.status === "SKIPPED");
  const currentStep = activeSteps[0];
  const progress = session.steps.length > 0 ? Math.round((doneSteps.length / session.steps.length) * 100) : 0;
  const allDone = activeSteps.length === 0 && session.steps.length > 0;

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
  }

  function startTimer() {
    setTimerStarted(true);
    setTimerRunning(true);
    setTimerExpired(false);
  }

  function addMoreTime() {
    setTimer((t) => t + 300);
    setTimerExpired(false);
    setTimerRunning(true);
  }

  function advanceFromContinuation() {
    if (continuationTimerRef.current) clearTimeout(continuationTimerRef.current);
    setShowContinuation(false);
    fetchSession();
  }

  async function markStepDone(stepId: string, status: "DONE" | "SKIPPED") {
    setUpdating(true);
    const elapsed = (currentStep?.estimatedMinutes ?? 5) * 60 - timer;
    const actualMinutes = Math.max(1, Math.round(elapsed / 60));
    const isDone = status === "DONE";
    const stepTitle = currentStep?.title ?? "";
    const hasMoreSteps = activeSteps.length > 1;
    try {
      if (id) localStorage.removeItem(timerKey(id, stepId));
      await fetch("/api/task-steps/" + stepId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ status, actualMinutes }),
      });
      setTimerStarted(false);
      setTimerRunning(false);
      setTimerExpired(false);

      if (isDone && hasMoreSteps) {
        setCompletedStepTitle(stepTitle);
        setShowContinuation(true);
        continuationTimerRef.current = setTimeout(() => {
          setShowContinuation(false);
          fetchSession();
        }, 1500);
      } else {
        await fetchSession();
        if (isDone) toast.success("Great work! Step complete!");
        else toast("Step skipped — moving on.");
      }
    } catch {
      toast.error("Failed to update step");
    } finally {
      setUpdating(false);
    }
  }

  async function makeStepEasier(stepId: string) {
    setMakingEasier(true);
    try {
      const res = await fetch("/api/task-steps/" + stepId + "/make-easier", {
        method: "POST",
        headers: getLocalSessionHeaders(),
      });
      if (res.status === 403) { toast.error("Upgrade to Pro to use Make Easier"); return; }
      if (!res.ok) { toast.error("Failed to simplify step"); return; }
      if (id) localStorage.removeItem(timerKey(id, stepId));
      await fetchSession();
      setTimerStarted(false);
      setTimerRunning(false);
      setTimerExpired(false);
      toast.success("Step broken into smaller pieces!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setMakingEasier(false);
    }
  }

  async function completeSession() {
    await fetch("/api/task-sessions/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    toast.success("Session completed! Amazing work!");
    await fetchSession();
  }

  async function setStepDuration(stepId: string, minutes: number) {
    try {
      const res = await fetch("/api/task-steps/" + stepId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ estimatedMinutes: minutes }),
      });
      if (!res.ok) throw new Error("Failed to update step length");
      await fetchSession();
      setTimer(minutes * 60);
      setTimerStarted(false);
      setTimerRunning(false);
      setTimerExpired(false);
    } catch {
      toast.error("Could not update step duration");
    }
  }

  if (allDone || session.status === "COMPLETED") {
    return (
      <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Complete!</h1>
        <p className="text-gray-700 font-medium mb-4">{session.title}</p>

        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-2 flex-wrap">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <strong className="text-gray-700">{completedDoneSteps.length}</strong>&nbsp;done
          </span>
          {skippedSteps.length > 0 && (
            <>
              <span className="text-gray-300">&middot;</span>
              <span className="flex items-center gap-1">
                <SkipForward className="w-4 h-4 text-gray-400" />
                <strong className="text-gray-700">{skippedSteps.length}</strong>&nbsp;skipped
              </span>
            </>
          )}
          <span className="text-gray-300">&middot;</span>
          <span>
            <strong className="text-gray-700">{session.steps.length}</strong>&nbsp;total
          </span>
        </div>

        {session.totalMinutesSpent != null && session.totalMinutesSpent > 0 && (
          <p className="text-sm text-purple-600 flex items-center justify-center gap-1 mb-6">
            <Clock className="w-4 h-4" />
            ~{session.totalMinutesSpent} minutes focused
          </p>
        )}
        {(!session.totalMinutesSpent || session.totalMinutesSpent === 0) && <div className="mb-6" />}

        {allDone && session.status !== "COMPLETED" && (
          <Button onClick={completeSession} className="bg-green-600 hover:bg-green-700 mb-4 w-full max-w-xs">
            Mark as Complete
          </Button>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/app/new")} className="bg-[#7c3aed] hover:bg-[#6d28d9]">Start Another Task</Button>
          <Button variant="outline" onClick={() => router.push("/app")}>Dashboard</Button>
        </div>
        {!session.userId && (
          <div className="mt-6 rounded-2xl border border-line bg-white/70 p-5 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">Save this progress across devices</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              You finished this session in local mode. Create an account when you want sync, billing, and reminder emails.
            </p>
            <Button onClick={() => router.push("/login")} className="mt-4 rounded-full bg-clay text-white hover:bg-[#b45630]">
              Create account
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {showContinuation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 max-w-sm w-full mx-4 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-green-600">&#10003;</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Great work!</h2>
            <p className="text-sm text-gray-400 line-through mb-6 leading-relaxed">{completedStepTitle}</p>
            <p className="text-gray-600 mb-6 font-medium">Ready for the next tiny step?</p>
            <Button
              onClick={advanceFromContinuation}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] h-12 text-base"
            >
              Next Step &#8594;
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/app")} className="text-gray-500">
          <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {doneSteps.length + 1} of {session.steps.length}</span>
          <span>{progress}% done</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStep && (
        <Card className={"mb-6 border-2 shadow-md " + (timerExpired ? "border-red-300" : "border-[#7c3aed]/20")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-100 text-purple-700 border-0">Current Step</Badge>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{currentStep.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentStep.title}</h2>

            {!timerStarted && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Step length</p>
                <div className="flex gap-2">
                  {[5, 10, 15].map((minutes) => (
                    <Button
                      key={minutes}
                      type="button"
                      variant={currentStep.estimatedMinutes === minutes ? "default" : "outline"}
                      className={currentStep.estimatedMinutes === minutes ? "bg-[#7c3aed] hover:bg-[#6d28d9]" : ""}
                      onClick={() => setStepDuration(currentStep.id, minutes)}
                    >
                      {minutes} min
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!timerStarted ? (
              <Button onClick={startTimer} className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] h-12 text-base mb-4">
                <Play className="mr-2 w-5 h-5" /> Start Step
              </Button>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="relative w-36 h-36">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="60" fill="none" stroke="#f3f0ff" strokeWidth="10" />
                    <circle
                      cx="72" cy="72" r="60"
                      fill="none"
                      stroke={timerExpired ? "#ef4444" : timer <= 60 ? "#f97316" : "#7c3aed"}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={String(2 * Math.PI * 60)}
                      strokeDashoffset={timerExpired ? 0 : String(2 * Math.PI * 60 * (1 - timer / ((currentStep?.estimatedMinutes ?? 5) * 60)))}
                      style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {timerExpired ? (
                      <>
                        <span className="text-red-500 text-xs font-semibold">Time&apos;s up!</span>
                        <span className="text-2xl font-mono font-bold text-red-500">00:00</span>
                      </>
                    ) : (
                      <span className={"text-2xl font-mono font-bold " + (timer <= 60 ? "text-orange-500 timer-urgent" : "text-[#7c3aed]")}>
                        {formatTime(timer)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {timerExpired ? (
              <div className="space-y-2">
                <Button
                  onClick={() => markStepDone(currentStep.id, "DONE")}
                  disabled={updating}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Done!</>}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={addMoreTime} variant="outline" className="h-10">
                    <Plus className="w-4 h-4 mr-1" /> 5 More Min
                  </Button>
                  <Button onClick={() => markStepDone(currentStep.id, "SKIPPED")} disabled={updating} variant="outline" className="h-10">
                    <SkipForward className="w-4 h-4 mr-1" /> Skip
                  </Button>
                </div>
                <Button
                  onClick={() => makeStepEasier(currentStep.id)}
                  disabled={makingEasier}
                  variant="outline"
                  className="w-full text-purple-700 border-purple-200 hover:bg-purple-50"
                >
                  {makingEasier ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                  Make Easier (Pro)
                </Button>
              </div>
            ) : timerStarted ? (
              <div className="flex gap-2">
                <Button onClick={() => markStepDone(currentStep.id, "DONE")} disabled={updating} className="flex-1 bg-green-600 hover:bg-green-700">
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" /> Done</>}
                </Button>
                <Button onClick={() => markStepDone(currentStep.id, "SKIPPED")} disabled={updating} variant="outline">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button onClick={() => makeStepEasier(currentStep.id)} disabled={makingEasier} variant="outline" className="text-purple-700 border-purple-200">
                  {makingEasier ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {session.steps.map((step, i) => (
          <div
            key={step.id}
            className={"flex items-center gap-3 p-3 rounded-lg text-sm " + (step.status === "DONE" ? "text-green-700 bg-green-50" : step.status === "SKIPPED" ? "text-gray-400 line-through bg-gray-50" : step.id === currentStep?.id ? "text-gray-900 bg-purple-50 font-medium" : "text-gray-400 bg-gray-50")}
          >
            <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 " + (step.status === "DONE" ? "bg-green-200 text-green-700" : step.status === "SKIPPED" ? "bg-gray-200 text-gray-500" : step.id === currentStep?.id ? "bg-[#7c3aed] text-white" : "bg-gray-200 text-gray-500")}>
              {step.status === "DONE" ? "✓" : (i + 1)}
            </span>
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}
