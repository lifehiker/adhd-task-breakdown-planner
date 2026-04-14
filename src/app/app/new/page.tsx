"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useSessionStore } from "@/store/session";

const DURATIONS = [15, 25, 45, 60];

export default function NewTaskPage() {
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

      const breakdownRes = await fetch("/api/task-sessions/" + session.id + "/generate-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localSessionKey: localSession.key }),
      });

      if (!breakdownRes.ok) {
        const err = await breakdownRes.json();
        if (err.error === "USAGE_LIMIT_REACHED") {
          toast.error("Free limit reached. Upgrade to Pro for unlimited AI breakdowns.");
          router.push("/app/session/" + session.id);
          return;
        }
        throw new Error(err.error || "Failed to generate breakdown");
      }

      toast.success("Task broken down! Starting your session.");
      router.push("/app/session/" + session.id);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#7c3aed] flex items-center justify-center mx-auto mb-4">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">What are you trying to do?</h1>
        <p className="text-gray-500">Describe your task and we will break it into tiny steps.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Write the project proposal, Do my taxes, Clean my desk..."
                className="text-base h-12"
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How long do you have?</label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTargetMinutes(d)}
                    className={"py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors " + (targetMinutes === d ? "border-[#7c3aed] bg-purple-50 text-[#7c3aed]" : "border-gray-200 text-gray-600 hover:border-gray-300")}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] h-12 text-base"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Breaking it down...</>
              ) : (
                <>Break It Down <Zap className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-gray-400 mt-4">
        Uses AI to break your task into 5-8 tiny, timed steps
      </p>
    </div>
  );
}
