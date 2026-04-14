import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, PlayCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Task Sessions</h1>
        <p className="text-gray-600 mb-6">Sign in to save your sessions from any device.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login"><Button className="bg-[#7c3aed] hover:bg-[#6d28d9]">Sign in</Button></Link>
          <Link href="/app/new"><Button variant="outline">Start without login</Button></Link>
        </div>
      </div>
    );
  }

  const sessions = await prisma.taskSession.findMany({
    where: { userId: session.user.id },
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const activeSessions = sessions.filter((s) => s.status === "ACTIVE");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");
  const abandonedSessions = sessions.filter((s) => s.status === "ABANDONED");

  function getProgress(steps: typeof sessions[0]["steps"]) {
    if (!steps.length) return 0;
    const done = steps.filter((s) => s.status === "DONE" || s.status === "SKIPPED").length;
    return Math.round((done / steps.length) * 100);
  }

  type SessionType = typeof sessions[0];

  function SessionCard({ s }: { s: SessionType }) {
    const progress = getProgress(s.steps);
    const doneSteps = s.steps.filter((st) => st.status === "DONE" || st.status === "SKIPPED").length;
    const sessionUrl = "/app/session/" + s.id;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{s.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{formatDistanceToNow(new Date(s.updatedAt), { addSuffix: true })}</p>
            </div>
            <span className={"text-xs px-2 py-0.5 rounded-full " + (s.status === "ACTIVE" ? "bg-blue-100 text-blue-700" : s.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>{s.status}</span>
          </div>
          {s.steps.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{doneSteps}/{s.steps.length} steps</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {s.targetMinutes} min
            </span>
            {s.status === "ACTIVE" && (
              <Link href={sessionUrl}>
                <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] h-7 text-xs">
                  <PlayCircle className="w-3 h-3 mr-1" /> Resume
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">{sessions.length} sessions total</p>
        </div>
        <Link href="/app/new">
          <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] gap-2">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({activeSessions.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedSessions.length})</TabsTrigger>
          <TabsTrigger value="abandoned">Abandoned ({abandonedSessions.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeSessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No active tasks. Ready to start something?</p>
              <Link href="/app/new"><Button className="bg-[#7c3aed] hover:bg-[#6d28d9]">Start a New Task</Button></Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeSessions.map((s) => <SessionCard key={s.id} s={s} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2">
            {completedSessions.map((s) => <SessionCard key={s.id} s={s} />)}
          </div>
        </TabsContent>
        <TabsContent value="abandoned">
          <div className="grid gap-4 md:grid-cols-2">
            {abandonedSessions.map((s) => <SessionCard key={s.id} s={s} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
