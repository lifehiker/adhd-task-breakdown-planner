"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, SkipForward, Loader2, Clock, Trophy, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Step = {
  id: string;
  title: string;
  estimatedMinutes: number;
  status: string;
  order: number;
};

type Session = {
  id: string;
  title: string;
  targetMinutes: number;
  status: string;
  steps: Step[];
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/task-sessions/" + id);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

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
  const currentStep = activeSteps[0];
  const progress = session.steps.length > 0 ? Math.round((doneSteps.length / session.steps.length) * 100) : 0;
  const allDone = activeSteps.length === 0 && session.steps.length > 0;

  async function markStepDone(stepId: string, status: "DONE" | "SKIPPED") {
    setUpdating(true);
    try {
      await fetch("/api/task-steps/" + stepId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, actualMinutes: Math.round(timer / 60) }),
      });
      setTimer(0);
      setTimerRunning(false);
      await fetchSession();
      if (status === "DONE") toast.success("Step complete! Great work!");
    } catch (err) {
      toast.error("Failed to update step");
    } finally {
      setUpdating(false);
    }
  }

  async function completeSession() {
    await fetch("/api/task-sessions/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    toast.success("Session completed! Amazing work!");
    await fetchSession();
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ":" + sec.toString().padStart(2, "0");
  };

  if (allDone || session.status === "COMPLETED") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Complete!</h1>
        <p className="text-gray-600 mb-2">{session.title}</p>
        <p className="text-gray-500 text-sm mb-8">You completed all {session.steps.length} steps.</p>
        {allDone && session.status !== "COMPLETED" && (
          <Button onClick={completeSession} className="bg-green-600 hover:bg-green-700 mb-4">
            Mark as Complete
          </Button>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/app/new")} className="bg-[#7c3aed] hover:bg-[#6d28d9]">Start Another Task</Button>
          <Button variant="outline" onClick={() => router.push("/app")}>Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
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
        <Card className="mb-6 border-2 border-[#7c3aed]/20 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-100 text-purple-700 border-0">Current Step</Badge>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{currentStep.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentStep.title}</h2>
            <div className="flex items-center gap-2 mb-6">
              {!timerRunning ? (
                <Button onClick={() => setTimerRunning(true)} className="bg-[#7c3aed] hover:bg-[#6d28d9] flex-1">
                  Start Timer
                </Button>
              ) : (
                <div className="flex-1 text-center">
                  <span className="text-2xl font-mono font-bold text-[#7c3aed]">{formatTime(timer)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => markStepDone(currentStep.id, "DONE")}
                disabled={updating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" /> Done!</>}
              </Button>
              <Button
                onClick={() => markStepDone(currentStep.id, "SKIPPED")}
                disabled={updating}
                variant="outline"
                className="gap-1"
              >
                <SkipForward className="w-4 h-4" /> Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {session.steps.map((step, i) => (
          <div
            key={step.id}
            className={"flex items-center gap-3 p-3 rounded-lg text-sm " + (step.status === "DONE" ? "text-green-700 bg-green-50" : step.status === "SKIPPED" ? "text-gray-400 line-through bg-gray-50" : step === currentStep ? "text-gray-900 bg-purple-50 font-medium" : "text-gray-400 bg-gray-50")}
          >
            <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 " + (step.status === "DONE" ? "bg-green-200 text-green-700" : step.status === "SKIPPED" ? "bg-gray-200 text-gray-500" : step === currentStep ? "bg-[#7c3aed] text-white" : "bg-gray-200 text-gray-500")}>
              {step.status === "DONE" ? "OK" : (i + 1)}
            </span>
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}
