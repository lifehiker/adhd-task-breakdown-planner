"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, SkipForward, Clock, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StepTimer } from "@/components/StepTimer";

type Step = {
  id: string;
  title: string;
  estimatedMinutes: number;
  status: string;
  order: number;
};

interface ExecutionStepperProps {
  sessionId: string;
  initialSteps: Step[];
  sessionTitle: string;
  onComplete?: () => void;
}

export function ExecutionStepper({ sessionId, initialSteps, sessionTitle, onComplete }: ExecutionStepperProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [updating, setUpdating] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeSteps = steps.filter((s) => s.status !== "DONE" && s.status !== "SKIPPED");
  const doneSteps = steps.filter((s) => s.status === "DONE" || s.status === "SKIPPED");
  const currentStep = activeSteps[0];
  const progress = steps.length > 0 ? Math.round((doneSteps.length / steps.length) * 100) : 0;
  const allDone = activeSteps.length === 0 && steps.length > 0;

  async function markStep(stepId: string, status: "DONE" | "SKIPPED") {
    setUpdating(true);
    try {
      await fetch("/api/task-steps/" + stepId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, actualMinutes: Math.round(elapsedSeconds / 60) }),
      });
      setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, status } : s)));
      setTimerRunning(false);
      setElapsedSeconds(0);
      if (status === "DONE") toast.success("Step done! Great work!");
    } catch {
      toast.error("Failed to update step");
    } finally {
      setUpdating(false);
    }
  }

  async function completeSession() {
    await fetch("/api/task-sessions/" + sessionId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    toast.success("Session completed!");
    onComplete?.();
  }

  if (allDone) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Done!</h2>
        <p className="text-gray-600 mb-6">{sessionTitle}</p>
        <Button onClick={completeSession} className="bg-green-600 hover:bg-green-700">
          Mark Session Complete
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {doneSteps.length + 1} of {steps.length}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStep && (
        <Card className="border-2 border-[#7c3aed]/20 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-100 text-purple-700 border-0">Current Step</Badge>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{currentStep.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentStep.title}</h2>
            <div className="flex items-center justify-center mb-4">
              {timerRunning ? (
                <StepTimer running={timerRunning} onTick={setElapsedSeconds} />
              ) : (
                <Button onClick={() => setTimerRunning(true)} variant="outline" className="gap-2">
                  <Clock className="w-4 h-4" /> Start Timer
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => markStep(currentStep.id, "DONE")}
                disabled={updating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" /> Done!</>}
              </Button>
              <Button
                onClick={() => markStep(currentStep.id, "SKIPPED")}
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

      <div className="space-y-1.5">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={"flex items-center gap-3 p-2.5 rounded-lg text-sm transition-colors " + (step.status === "DONE" ? "text-green-700 bg-green-50" : step.status === "SKIPPED" ? "text-gray-400 line-through bg-gray-50" : step === currentStep ? "text-gray-900 bg-purple-50 font-medium" : "text-gray-400")}
          >
            <span className={"w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 " + (step.status === "DONE" ? "bg-green-200 text-green-700" : step === currentStep ? "bg-[#7c3aed] text-white" : "bg-gray-200 text-gray-500")}>
              {i + 1}
            </span>
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}
