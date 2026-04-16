"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Plus, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <nav className="focus-panel sticky top-4 z-40 rounded-[2rem] px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/app" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white shadow-glow">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-2xl leading-none text-ink">FocusSteps</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-soft">Working session</p>
            </div>
          </Link>
          <Link href="/app">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-ink">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/app/new">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-ink">
              <Plus className="w-4 h-4" /> New Task
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
