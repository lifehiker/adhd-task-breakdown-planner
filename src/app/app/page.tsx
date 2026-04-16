import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Clock3, PlayCircle, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnonymousDashboard } from "@/components/AnonymousDashboard";

export const dynamic = "force-dynamic";

const taskSessionSummarySelect = {
  id: true,
  title: true,
  status: true,
  targetMinutes: true,
  updatedAt: true,
  steps: {
    orderBy: { order: "asc" as const },
    select: {
      id: true,
      status: true,
    },
  },
};

function getProgress(steps: Array<{ status: string }>) {
  if (!steps.length) return 0;
  const done = steps.filter((step) => step.status === "DONE" || step.status === "SKIPPED").length;
  return Math.round((done / steps.length) * 100);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <AnonymousDashboard />;
  }

  const sessions = await prisma.taskSession.findMany({
    where: { userId: session.user.id },
    select: taskSessionSummarySelect,
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const activeSessions = sessions.filter((item) => item.status === "ACTIVE");
  const completedSessions = sessions.filter((item) => item.status === "COMPLETED");
  const abandonedSessions = sessions.filter((item) => item.status === "ABANDONED");

  function SessionCard({ item }: { item: (typeof sessions)[number] }) {
    const steps = item.steps ?? [];
    const progress = getProgress(steps);
    const doneSteps = steps.filter((step) => step.status === "DONE" || step.status === "SKIPPED").length;

    return (
      <Card className="focus-card border border-line">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-soft">
                Updated {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
              </p>
            </div>
            <span className="rounded-full bg-[#16313a] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#f6f0e5]">
              {item.status.toLowerCase()}
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-ink-soft">
              <span>{doneSteps}/{steps.length} steps</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              <Clock3 className="h-4 w-4" />
              {item.targetMinutes} min
            </span>

            <Link href={`/app/session/${item.id}`}>
              <Button
                size="sm"
                className={item.status === "ACTIVE" ? "rounded-full bg-teal text-white hover:bg-[#175553]" : "rounded-full bg-clay text-white hover:bg-[#b45630]"}
              >
                {item.status === "ACTIVE" ? (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Review
                  </>
                )}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="animate-fade-in-up">
          <div className="focus-kicker mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Dashboard
          </div>
          <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] text-ink md:text-7xl">
            Keep momentum
            <span className="block text-clay">without managing a whole system.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
            Active sessions stay ready to resume. Completed ones stay visible without turning into a guilt archive.
          </p>
        </div>

        <Link href="/app/new" className="animate-fade-in-up delay-100">
          <Button className="h-14 rounded-full bg-teal px-8 text-base text-white hover:bg-[#175553]">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </section>

      <Tabs defaultValue="active" className="animate-fade-in-up delay-200">
        <TabsList className="rounded-full border border-line bg-white/70 p-1">
          <TabsTrigger value="active" className="rounded-full">Active ({activeSessions.length})</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full">Completed ({completedSessions.length})</TabsTrigger>
          <TabsTrigger value="abandoned" className="rounded-full">Abandoned ({abandonedSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeSessions.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeSessions.map((item) => <SessionCard key={item.id} item={item} />)}
            </div>
          ) : (
            <Card className="focus-panel border border-line">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-ink">No active tasks yet.</p>
                <p className="mt-2 text-sm text-ink-soft">Start one task, get the breakdown, and work step by step.</p>
                <Link href="/app/new" className="mt-5 inline-block">
                  <Button className="rounded-full bg-clay px-6 text-white hover:bg-[#b45630]">Start a New Task</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedSessions.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {completedSessions.map((item) => <SessionCard key={item.id} item={item} />)}
            </div>
          ) : (
            <Card className="focus-panel border border-line">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-ink">No completed sessions yet.</p>
                <p className="mt-2 text-sm text-ink-soft">Your wins will show up here once you finish a session.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="abandoned" className="mt-6">
          {abandonedSessions.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {abandonedSessions.map((item) => <SessionCard key={item.id} item={item} />)}
            </div>
          ) : (
            <Card className="focus-panel border border-line">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-ink">No abandoned sessions.</p>
                <p className="mt-2 text-sm text-ink-soft">The pauses are staying contained so far.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
