"use client";

import { useState, useEffect, useRef } from "react";
import type { Preset } from "@/lib/types";
import { Sparkles } from "lucide-react";

const MESSAGE_SETS: Record<string, string[]> = {
  "restore-only": ["Analyzing photo…", "Removing damage…", "Fixing scratches…"],
  "restore-colorize": [
    "Analyzing photo…",
    "Removing damage…",
    "Fixing scratches…",
    "Enhancing details…",
    "Adding color…",
  ],
  "colorize-only": ["Analyzing photo…", "Enhancing details…", "Adding color…"],
  enhance: ["Analyzing photo…", "Enhancing details…", "Sharpening image…"],
};

const STEP_INTERVAL_MS = 4000;
const FADE_DURATION_MS = 300;

interface ProcessingSpinnerProps {
  preset: Preset;
  exiting?: boolean;
}

export function ProcessingSpinner({ preset, exiting }: ProcessingSpinnerProps) {
  const [displayedStep, setDisplayedStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  const messages = MESSAGE_SETS[preset] ?? MESSAGE_SETS["restore-colorize"];
  const totalSteps = messages.length;


  // Step messages: cycle with cross-fade
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const current = stepRef.current;
      if (current < totalSteps - 1) {
        const next = current + 1;
        stepRef.current = next;
        setAnimating(true);
        setTimeout(() => {
          setDisplayedStep(next);
          setAnimating(false);
        }, FADE_DURATION_MS);
      }
    }, STEP_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSteps]);

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 space-y-6 ${exiting
      ? 'animate-[spinnerFadeOut_0.4s_ease_0.5s_forwards]'
      : 'animate-[spinnerFadeIn_0.5s_ease_both]'
      }`}>
      <div className="relative">
        {/* Sparkles animation */}
        <div className=" flex items-center justify-center relative mb-20">
          <Sparkles className="size-12 text-primary/80 absolute -top-18 sparkle-shoot animation-delay-600 opacity-0" />
          <Sparkles className="size-8 text-primary/80 absolute top-0 left-2 sparkle-shoot animation-delay-1200 opacity-0" />
          <Sparkles className="size-5 text-primary/80 absolute top-0 right-4 sparkle-shoot opacity-0" />
        </div>
        {/* Loading animation */}
        <div className="absolute w-full max-w-lg -top-20">
          <div className="absolute top-0 -right-3 w-36 rounded-full h-36  bg-[#EDB74D] mix-blend-hue filter blur-lg  opacity-50 blob-translation"></div>
          <div className="absolute -top-2 -right-5 w-30 rounded-full h-30 bg-[#EB6666] mix-blend-hue filter blur-lg  opacity-50 blob-translation animation-delay-4000"></div>
          <div className="absolute top-0 -left-5 w-36 rounded-full h-36 bg-[#6FB18A] mix-blend-hue filter blur-lg  opacity-50 blob-translation animation-delay-8000"></div>
        </div>
      </div>
      {/* Status text */}
      <p className={`relative z-10 text-lg font-medium text-foreground text-center transition-all duration-300 ease-out ${animating
        ? 'opacity-0 scale-95 translate-y-1'
        : 'opacity-100 scale-100 translate-y-0'
        }`}>
        {messages[displayedStep]}
      </p>
    </div>
  );
}
