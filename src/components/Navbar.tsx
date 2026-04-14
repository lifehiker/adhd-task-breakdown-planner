"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Plus, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">FocusSteps</span>
          </Link>
          <Link href="/app">
            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/app/new">
            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
              <Plus className="w-4 h-4" /> New Task
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
