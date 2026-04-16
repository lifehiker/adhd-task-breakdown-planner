import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export const metadata: Metadata = {
  title: "ADHD Task Breakdown App | FocusSteps",
  description: "FocusSteps is an ADHD task breakdown app that turns one overwhelming task into tiny timed steps you can actually begin.",
};

export default function AdhdTaskBreakdownAppPage() {
  return (
    <MarketingPageShell
      kicker="ADHD task breakdown app"
      title="An ADHD task breakdown app that helps you start before the task gets louder."
      description="FocusSteps is designed for task paralysis, not project management. You type one messy task, get a short sequence of concrete steps, and work through them with a timer that only asks for the next doable move."
      bullets={[
        "Break one large task into 3 to 8 steps that start with real verbs.",
        "Edit, delete, or add manual steps before starting if the AI pass misses the shape of the task.",
        "Run a step-by-step session with done, skip, more-time, and make-it-easier actions built in.",
      ]}
      accentLabel="Why it feels different"
      accentTitle="It narrows the frame until your brain can enter the work."
      accentCopy="Instead of asking for tags, projects, or a perfect plan, the product turns a vague obligation into a short runway. The interface stays deliberately narrow so momentum has somewhere to land."
    />
  );
}
