"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock3, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useSessionStore } from "@/store/session";
import { rememberLocalSessionId } from "@/lib/local-session-client";

const DURATIONS = [15, 25, 45, 60];

interface TaskInputFormProps {
  onSuccess?: (sessionId: string) => void;
  onUsageLimit?: (sessionId: string) => void;
  onBreakdownGenerated?: () => void;
}

export function TaskInputForm({ onSuccess, onUsageLimit, onBreakdownGenerated }: TaskInputFormProps) {
  const router = useRouter();
  const { localSession } = useSessionStore();
  const [title, setTitle] = useState("");
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Please describe your task"); return; }
    setLoading(true);
    try {
      const sessionRes = await fetch("/api/task-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), targetMinutes, localSessionKey: localSession.key }),
      });
      if (!sessionRes.ok) throw new Error("Failed to create session");
      const session = await sessionRes.json();
      rememberLocalSessionId(session.id);

      const breakdownRes = await fetch("/api/task-sessions/" + session.id + "/generate-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localSessionKey: localSession.key }),
      });

      if (!breakdownRes.ok) {
        const err = await breakdownRes.json();
        if (err.error === "USAGE_LIMIT_REACHED") {
          toast.error("Free limit reached. Upgrade to Pro for unlimited breakdowns.");
          onUsageLimit?.(session.id);
          if (onSuccess) onSuccess(session.id);
          return;
        }
        throw new Error(err.error || "Failed to generate breakdown");
      }

      onBreakdownGenerated?.();
      toast.success("Task broken down!");
      if (onSuccess) onSuccess(session.id);
      else router.push("/app/session/" + session.id);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
          What feels stuck right now?
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write the messy version of the task exactly how it feels in your head."
          className="h-16 rounded-[1.4rem] border-line bg-white/80 px-5 text-base shadow-none placeholder:text-ink-soft/70 focus-visible:ring-[1.5px] focus-visible:ring-[#1e6a67]"
          disabled={loading}
          autoFocus
        />
        <p className="text-sm leading-6 text-ink-soft">
          Examples: finish the proposal draft, clean the kitchen, finally email the landlord, start taxes.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
          <Clock3 className="h-4 w-4" />
          How much time do you have?
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setTargetMinutes(d)}
              className={
                "rounded-[1.3rem] border px-3 py-3 text-sm font-semibold transition-all " +
                (targetMinutes === d
                  ? "border-transparent bg-teal text-white shadow-glow"
                  : "border-line bg-white/70 text-ink hover:-translate-y-0.5 hover:border-[#1e6a67]/35")
              }
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !title.trim()}
        className="h-14 w-full rounded-full bg-clay text-base text-white hover:bg-[#b45630]"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Breaking it down...</>
        ) : (
          <>Break it into tiny steps <Zap className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </form>
  );
}
