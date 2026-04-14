import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const StepSchema = z.object({
  title: z.string().min(1),
  estimatedMinutes: z.number().min(1).max(15),
});

const BreakdownSchema = z.object({
  steps: z.array(StepSchema).min(3).max(8),
});

export type TaskStep = z.infer<typeof StepSchema>;
export type TaskBreakdown = z.infer<typeof BreakdownSchema>;

export async function generateTaskBreakdown({
  title,
  targetMinutes,
}: {
  title: string;
  targetMinutes: number;
}): Promise<TaskBreakdown> {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  if (!apiKey || apiKey.startsWith("sk-ant-placeholder")) {
    // Return mock data when no API key is set
    return {
      steps: [
        { title: "Open your workspace and gather materials", estimatedMinutes: 2 },
        { title: "Review what needs to be done", estimatedMinutes: 3 },
        { title: "Start with the first small piece", estimatedMinutes: 5 },
        { title: "Complete the main work", estimatedMinutes: 10 },
        { title: "Review and wrap up", estimatedMinutes: 5 },
      ],
    };
  }

  const prompt = `You are an ADHD productivity coach. Break down the following task into ${Math.min(8, Math.max(3, Math.ceil(targetMinutes / 7)))} small, concrete, actionable steps.

Task: "${title}"
Target session length: ${targetMinutes} minutes

Rules:
- Generate exactly 3-8 steps
- Each step must start with a verb (Open, Write, Find, Create, Review, etc.)
- Each step should take 2-15 minutes
- Steps must be concrete and specific, not vague
- Keep steps small enough that they feel easy to start
- Total time should roughly equal ${targetMinutes} minutes

Return ONLY valid JSON in this exact format:
{
  "steps": [
    { "title": "verb-first step description", "estimatedMinutes": number },
    ...
  ]
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from AI");
  }

  // Extract JSON from the response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return BreakdownSchema.parse(parsed);
}

export async function makeStepEasier({
  stepTitle,
  context,
}: {
  stepTitle: string;
  context: string;
}): Promise<TaskBreakdown> {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  if (!apiKey || apiKey.startsWith("sk-ant-placeholder")) {
    return {
      steps: [
        { title: `Start by just looking at: ${stepTitle}`, estimatedMinutes: 2 },
        { title: "Do the first tiny part", estimatedMinutes: 3 },
        { title: "Finish the rest", estimatedMinutes: 5 },
      ],
    };
  }

  const prompt = `You are an ADHD productivity coach. This step feels too hard to start:

Step: "${stepTitle}"
Task context: "${context}"

Break it into 2-3 even smaller, easier steps. Make them feel so small that starting is effortless.

Return ONLY valid JSON:
{
  "steps": [
    { "title": "verb-first tiny step", "estimatedMinutes": number },
    ...
  ]
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");

  const parsed = JSON.parse(jsonMatch[0]);
  // Allow 2-3 steps for make-easier
  const schema = z.object({
    steps: z.array(StepSchema).min(2).max(3),
  });
  return schema.parse(parsed);
}
