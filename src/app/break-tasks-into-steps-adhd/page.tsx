import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export const metadata: Metadata = {
  title: "Break Tasks Into Steps for ADHD | FocusSteps",
  description: "Break tasks into steps for ADHD with small, concrete actions and a guided session flow that keeps you moving one step at a time.",
};

export default function BreakTasksIntoStepsAdhdPage() {
  return (
    <MarketingPageShell
      kicker="Break tasks into steps ADHD"
      title="Break tasks into steps for ADHD without turning the setup into another task."
      description="Overwhelm usually means the task is still too large in your head. FocusSteps translates it into short steps with clear verbs, realistic time blocks, and room to simplify further when one step still feels sticky."
      bullets={[
        "Generate a first-pass sequence instantly, then tune it before the session starts.",
        "Split a hard step into even smaller sub-steps with the Pro make-it-easier action.",
        "Keep the full list available when needed, but spotlight only the current step during execution.",
      ]}
      accentLabel="Smaller is faster"
      accentTitle="A step is only useful if it feels small enough to begin without bargaining."
      accentCopy="The breakdown engine aims for verb-first steps that are short, concrete, and emotionally easier to touch. That makes the difference between planning the work and actually crossing into it."
    />
  );
}
