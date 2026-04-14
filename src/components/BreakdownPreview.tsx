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

  async function deleteStep(stepId: string) {
    await fetch("/api/task-steps/" + stepId, { method: "DELETE" });
    setSteps(steps.filter((s) => s.id !== stepId));
  }

  async function updateStep(stepId: string, title: string) {
    await fetch("/api/task-steps/" + stepId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, title } : s)));
    setEditingId(null);
  }

  function startSession() {
    if (steps.length === 0) { toast.error("Please add at least one step"); return; }
    router.push("/app/session/" + sessionId);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {steps.map((step, i) => (
          <Card key={step.id} className="border border-gray-100">
            <CardContent className="p-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              {editingId === step.id ? (
                <Input
                  defaultValue={step.title}
                  onBlur={(e) => updateStep(step.id, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") updateStep(step.id, (e.target as HTMLInputElement).value); }}
                  className="h-7 text-sm flex-1"
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 text-sm text-gray-800 cursor-pointer hover:text-[#7c3aed]"
                  onClick={() => setEditingId(step.id)}
                >
                  {step.title}
                </span>
              )}
              <span className="text-xs text-gray-400 flex-shrink-0">{step.estimatedMinutes}m</span>
              <button onClick={() => deleteStep(step.id)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        onClick={startSession}
        disabled={steps.length === 0}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] h-12 text-base"
      >
        <Play className="mr-2 w-5 h-5" /> Start Session
      </Button>
    </div>
  );
}
