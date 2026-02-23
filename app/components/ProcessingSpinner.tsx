"use client";

import { useState, useEffect, useRef } from "react";
import type { Preset } from "@/lib/types";

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

  const [progress, setProgress] = useState(0);

  const messages = MESSAGE_SETS[preset] ?? MESSAGE_SETS["restore-colorize"];
  const totalSteps = messages.length;

  // Smooth progress: ticks every 100ms, fills to 90% over the total step duration
  useEffect(() => {
    const totalDuration = totalSteps * STEP_INTERVAL_MS;
    const tick = 200;
    const increment = (90 / totalDuration) * tick;

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 90));
    }, tick);

    return () => clearInterval(progressTimer);
  }, [totalSteps]);

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
      {/* Circular spinner */}
      <div className="w-[88px] h-[88px] rounded-full border-4 border-muted border-t-primary animate-spin" />

      {/* Status text */}
      <p className={`text-lg font-medium text-foreground text-center transition-all duration-300 ease-out ${animating
          ? 'opacity-0 scale-95 translate-y-1'
          : 'opacity-100 scale-100 translate-y-0'
        }`}>
        {messages[displayedStep]}
      </p>



      {/* Helper text */}
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        This usually takes 15-30 seconds. Please don&apos;t close this window.
      </p>
    </div>
  );
}
