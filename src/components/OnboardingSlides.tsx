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
    desc: "Paste your task and AI breaks it into 3-8 small, concrete, timed steps. Nothing vague.",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="focus-panel w-full max-w-md rounded-[2rem] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[#f0e4d0] text-clay">
          <Icon className="h-8 w-8" />
        </div>
        <p className="focus-kicker mx-auto mb-5">Quick onboarding</p>
        <h2 className="font-display text-4xl leading-none text-ink">{slide.title}</h2>
        <p className="mt-4 text-base leading-7 text-ink-soft">{slide.desc}</p>
        <div className="mb-7 mt-7 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={"h-2.5 rounded-full transition-all " + (i === currentSlide ? "w-8 bg-teal" : "w-2.5 bg-[#d7ccbb]")}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSkip} className="flex-1 rounded-full text-ink-soft">
            Skip
          </Button>
          <Button onClick={handleNext} className="flex-1 rounded-full bg-teal text-white hover:bg-[#175553]">
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
