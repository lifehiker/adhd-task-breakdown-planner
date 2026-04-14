"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  async function deleteStep(stepId: string) {
    await fetch("/api/task-steps/" + stepId, { method: "DELETE" });
    setSteps(steps.filter((s) => s.id !== stepId));
    toast("Step removed");
  }

  async function updateStep(stepId: string, title: string) {
    if (!title.trim()) return;
    await fetch("/api/task-steps/" + stepId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, title: title.trim() } : s)));
    setEditingId(null);
  }

  async function addStep() {
    if (!newStepTitle.trim()) return;
    try {
      const res = await fetch("/api/task-sessions/" + sessionId + "/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newStepTitle.trim(), estimatedMinutes: 5 }),
      });
      if (!res.ok) throw new Error("Failed to add step");
      const step = await res.json();
      setSteps([...steps, step]);
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {steps.map((step, i) => (
          <Card key={step.id} className="border border-gray-100 hover:border-purple-200 transition-colors">
            <CardContent className="p-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              {editingId === step.id ? (
                <Input
                  defaultValue={step.title}
                  onBlur={(e) => updateStep(step.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateStep(step.id, (e.target as HTMLInputElement).value);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="h-7 text-sm flex-1"
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 text-sm text-gray-800 cursor-pointer hover:text-[#7c3aed] transition-colors"
                  onClick={() => setEditingId(step.id)}
                  title="Click to edit"
                >
                  {step.title}
                </span>
              )}
              <span className="text-xs text-gray-400 flex-shrink-0">{step.estimatedMinutes}m</span>
              <button
                onClick={() => deleteStep(step.id)}
                className="text-gray-300 hover:text-red-400 flex-shrink-0 transition-colors"
                title="Remove step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ))}

        {addingStep ? (
          <Card className="border-2 border-[#7c3aed]/30 border-dashed">
            <CardContent className="p-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{steps.length + 1}</span>
              <Input
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addStep();
                  if (e.key === "Escape") { setAddingStep(false); setNewStepTitle(""); }
                }}
                placeholder="Describe the step (start with a verb)..."
                className="h-7 text-sm flex-1"
                autoFocus
              />
              <button onClick={addStep} className="text-[#7c3aed] hover:text-[#6d28d9] flex-shrink-0 font-medium text-xs">
                Add
              </button>
              <button onClick={() => { setAddingStep(false); setNewStepTitle(""); }} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ) : (
          <button
            onClick={() => setAddingStep(true)}
            className="w-full flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-purple-300 hover:text-[#7c3aed] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add a step manually
          </button>
        )}
      </div>

      <Button
        onClick={startSession}
        disabled={steps.length === 0}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] h-12 text-base shadow-md shadow-purple-100"
      >
        <Play className="mr-2 w-5 h-5" /> Start Session
      </Button>
    </div>
  );
}
