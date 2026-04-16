import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export const metadata: Metadata = {
  title: "ADHD Task Initiation Help | FocusSteps",
  description: "Get ADHD task initiation help with tiny action prompts, gentle timers, and continuation cues instead of another overwhelming planner.",
};

export default function AdhdTaskInitiationHelpPage() {
  return (
    <MarketingPageShell
      kicker="ADHD task initiation help"
      title="Task initiation help for ADHD brains that already know what they should do."
      description="The hard part is often not deciding that a task matters. It is converting intention into motion. FocusSteps helps by shrinking the entry point, timing the first move, and guiding the return after interruptions."
      bullets={[
        "Start with a single text field instead of a system setup ritual.",
        "Use timed steps that can be extended by five minutes when momentum is present but unfinished.",
        "Come back to unfinished sessions with a clear in-app prompt instead of a guilt pile.",
      ]}
      accentLabel="Built for friction"
      accentTitle="The product assumes starting is the problem and designs around that reality."
      accentCopy="Every screen is tuned to reduce pre-work. The session only foregrounds the current step, which makes it easier to re-enter after avoidance, distraction, or a mid-task derail."
    />
  );
}
