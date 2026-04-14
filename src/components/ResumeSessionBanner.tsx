"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle, X } from "lucide-react";

interface ResumeSessionBannerProps {
  sessionId: string;
  sessionTitle: string;
  onDismiss?: () => void;
}

export function ResumeSessionBanner({ sessionId, sessionTitle, onDismiss }: ResumeSessionBannerProps) {
  const sessionUrl = "/app/session/" + sessionId;
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between gap-4 mb-6">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-blue-900 text-sm">Want to continue where you left off?</p>
        <p className="text-blue-600 text-xs truncate mt-0.5">{sessionTitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href={sessionUrl}>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1">
            <PlayCircle className="w-3.5 h-3.5" /> Resume
          </Button>
        </Link>
        {onDismiss && (
          <Button variant="ghost" size="icon" onClick={onDismiss} className="w-7 h-7 text-blue-400 hover:text-blue-600">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
