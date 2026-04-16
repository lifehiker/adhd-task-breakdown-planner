"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Play, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getLocalSessionHeaders, getLocalSessionKey } from "@/lib/local-session-client";

type Step = { id: string; title: string; estimatedMinutes: number; order: number; status: string };

interface BreakdownPreviewProps {
  sessionId: string;
  initialSteps: Step[];
}

export function BreakdownPreview({ sessionId, initialSteps }: BreakdownPreviewProps) {
  const router = useRouter();
  const [steps, setSteps] = useState(initialSteps);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingStep, setAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  async function deleteStep(stepId: string) {
    try {
      const res = await fetch("/api/task-steps/" + stepId, { method: "DELETE", headers: getLocalSessionHeaders() });
      if (!res.ok) throw new Error("Failed to delete step");
      setSteps((current) => current.filter((s) => s.id !== stepId));
      toast.success("Step removed");
    } catch {
      toast.error("Could not remove that step");
    }
  }

  async function updateStep(stepId: string, title: string) {
    if (!title.trim()) return;
    try {
      const res = await fetch("/api/task-steps/" + stepId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update step");
      setSteps((current) => current.map((s) => (s.id === stepId ? { ...s, title: title.trim() } : s)));
      setEditingId(null);
    } catch {
      toast.error("Could not save that edit");
    }
  }

  async function addStep() {
    if (!newStepTitle.trim()) return;
    try {
      const res = await fetch("/api/task-sessions/" + sessionId + "/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ title: newStepTitle.trim(), estimatedMinutes: 5 }),
      });
      if (!res.ok) throw new Error("Failed to add step");
      const step = await res.json();
      setSteps((current) => [...current, step]);
      setNewStepTitle("");
      setAddingStep(false);
      toast.success("Step added");
    } catch {
      toast.error("Failed to add step");
    }
  }

  function startSession() {
    if (steps.length === 0) { toast.error("Please add at least one step"); return; }
    router.push("/app/session/" + sessionId);
  }

  async function regenerateBreakdown() {
    setRegenerating(true);
    try {
      const res = await fetch("/api/task-sessions/" + sessionId + "/generate-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getLocalSessionHeaders() },
        body: JSON.stringify({ localSessionKey: getLocalSessionKey() }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error === "USAGE_LIMIT_REACHED" ? "Free limit reached. Upgrade to Pro for more AI breakdowns." : "Could not regenerate breakdown");
        return;
      }

      setSteps(data.steps ?? []);
      toast.success("Fresh breakdown ready");
    } catch {
      toast.error("Failed to regenerate breakdown");
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-line bg-white/65 px-4 py-3">
        <p className="text-sm text-ink-soft">Edit the steps, add one manually, or ask for a fresh AI pass.</p>
        <Button
          type="button"
          variant="outline"
          onClick={regenerateBreakdown}
          disabled={regenerating}
          className="rounded-full border-line bg-white/80 text-ink"
        >
          {regenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
          Regenerate
        </Button>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <Card key={step.id} className="focus-card border border-line transition-transform hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">{i + 1}</span>
              {editingId === step.id ? (
                <Input
                  defaultValue={step.title}
                  onBlur={(e) => updateStep(step.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateStep(step.id, (e.target as HTMLInputElement).value);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="h-8 flex-1 border-line bg-white/80 text-sm"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  className="flex-1 text-left text-sm text-ink transition-colors hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6a67]/30"
                  onClick={() => setEditingId(step.id)}
                  title="Edit step"
                >
                  {step.title}
                </button>
              )}
              <span className="flex-shrink-0 text-xs text-ink-soft">{step.estimatedMinutes}m</span>
              <button
                type="button"
                onClick={() => deleteStep(step.id)}
                className="flex-shrink-0 text-ink-soft/50 transition-colors hover:text-red-500"
                title="Remove step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ))}

        {addingStep ? (
          <Card className="border-2 border-dashed border-line bg-white/70">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f0e4d0] text-xs font-bold text-ink-soft">{steps.length + 1}</span>
              <Input
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addStep();
                  if (e.key === "Escape") { setAddingStep(false); setNewStepTitle(""); }
                }}
                placeholder="Describe the step (start with a verb)..."
                className="h-8 flex-1 border-line bg-white/80 text-sm"
                autoFocus
              />
              <button type="button" onClick={addStep} className="flex-shrink-0 text-xs font-medium text-teal hover:text-[#175553]">
                Add
              </button>
              <button type="button" onClick={() => { setAddingStep(false); setNewStepTitle(""); }} className="flex-shrink-0 text-ink-soft/50 hover:text-ink-soft">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ) : (
          <button
            type="button"
            onClick={() => setAddingStep(true)}
            className="flex w-full items-center gap-2 rounded-[1.3rem] border-2 border-dashed border-line p-4 text-sm text-ink-soft transition-colors hover:border-[#1e6a67]/35 hover:text-teal"
          >
            <Plus className="w-4 h-4" /> Add a step manually
          </button>
        )}
      </div>

      <Button
        onClick={startSession}
        disabled={steps.length === 0}
        className="h-12 w-full rounded-full bg-clay text-base text-white hover:bg-[#b45630]"
      >
        <Play className="mr-2 w-5 h-5" /> Start Session
      </Button>
    </div>
  );
}
