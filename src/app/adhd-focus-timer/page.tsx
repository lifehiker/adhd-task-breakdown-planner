import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export const metadata: Metadata = {
  title: "ADHD Focus Timer With Task Breakdown | FocusSteps",
  description: "Use an ADHD focus timer that pairs short countdowns with tiny steps, so you always know what to do during the timer.",
};

export default function AdhdFocusTimerPage() {
  return (
    <MarketingPageShell
      kicker="ADHD focus timer"
      title="An ADHD focus timer is more useful when it also tells you what to do."
      description="A plain timer can help once you are already moving, but it does not solve the blank-start problem. FocusSteps pairs each countdown with one specific action, then offers done, more time, skip, or make-it-easier when the timer ends."
      bullets={[
        "Default step timers start at five minutes to lower the cost of beginning.",
        "Adjust a step to 10 or 15 minutes when it genuinely needs more room.",
        "Use continuation prompts between steps so the next action feels immediate instead of abstract.",
      ]}
      accentLabel="Timer plus guidance"
      accentTitle="The countdown supports the step instead of replacing the plan."
      accentCopy="This keeps the timer from becoming another empty productivity ritual. You are not just watching a clock. You are moving through a guided sequence with clear choices when your attention changes."
    />
  );
}
