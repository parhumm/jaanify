"use client";

import { cn } from "@/lib/cn";

interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}

export function ProgressDots({ totalSteps, currentStep }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2" role="group" aria-label="Progress">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          role="presentation"
          aria-current={i === currentStep ? "step" : undefined}
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-out",
            "motion-reduce:transition-none",
            i === currentStep
              ? "w-6 bg-(--color-sage)"
              : "w-2 bg-(--color-sage-light)/30"
          )}
        />
      ))}
      <span className="sr-only">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
}
