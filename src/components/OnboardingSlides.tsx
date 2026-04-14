"use client";
import { useState } from "react";
import { useSessionStore } from "@/store/session";
import { Button } from "@/components/ui/button";
import { Zap, Brain, CheckSquare } from "lucide-react";

const slides = [
  {
    icon: Brain,
    title: "This app helps you start",
    desc: "When everything feels overwhelming, FocusSteps gives you one tiny action to take. Just one.",
  },
  {
    icon: Zap,
    title: "Break tasks into tiny steps",
    desc: "Paste your task and AI breaks it into 5-8 small, concrete, timed steps. Nothing vague.",
  },
  {
    icon: CheckSquare,
    title: "Focus on one step at a time",
    desc: "See only what is next. Complete it. Move on. Your brain can handle one thing at a time.",
  },
];

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setOnboardingCompleted } = useSessionStore();

  function handleNext() {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setOnboardingCompleted();
      onComplete();
    }
  }

  function handleSkip() {
    setOnboardingCompleted();
    onComplete();
  }

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-[#7c3aed]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{slide.title}</h2>
        <p className="text-gray-600 mb-8">{slide.desc}</p>
        <div className="flex items-center gap-1 justify-center mb-6">
          {slides.map((_, i) => (
            <div key={i} className={"w-2 h-2 rounded-full " + (i === currentSlide ? "bg-[#7c3aed]" : "bg-gray-200")} />
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSkip} className="flex-1 text-gray-500">Skip</Button>
          <Button onClick={handleNext} className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9]">
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
