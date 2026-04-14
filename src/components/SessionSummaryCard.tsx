"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

type Step = { id: string; status: string; [key: string]: unknown };

interface SessionSummaryCardProps {
  title: string;
  status: string;
  steps: Step[];
  targetMinutes: number;
  totalMinutesSpent?: number;
}

export function SessionSummaryCard({ title, status, steps, targetMinutes, totalMinutesSpent }: SessionSummaryCardProps) {
  const doneSteps = steps.filter((s) => s.status === "DONE" || s.status === "SKIPPED").length;
  const progress = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 truncate flex-1">{title}</h3>
          <Badge
            className={status === "COMPLETED" ? "bg-green-100 text-green-700 border-0" : status === "ACTIVE" ? "bg-blue-100 text-blue-700 border-0" : "bg-gray-100 text-gray-600 border-0"}
          >
            {status}
          </Badge>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{doneSteps}/{steps.length} steps</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {targetMinutes} min target</span>
          {totalMinutesSpent !== undefined && totalMinutesSpent > 0 && (
            <span>{totalMinutesSpent} min spent</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
