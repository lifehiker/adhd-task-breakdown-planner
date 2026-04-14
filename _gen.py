import os
P = "/Users/shannonkempenich/CascadeProjects/adhd-task-breakdown-planner"
def w(rel, content):
    path = os.path.join(P, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write(content)
    print("Written:", rel)

LANDING = """
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Brain, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl text-gray-900">FocusSteps</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
            <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
            <Link href="/app/new"><Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9]">Start Free</Button></Link>
          </div>
        </div>
      </nav>
