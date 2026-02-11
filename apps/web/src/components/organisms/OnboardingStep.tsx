"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface OnboardingStepProps {
  step: 1 | 2 | 3 | 4;
  children: ReactNode;
  isActive: boolean;
}

export function OnboardingStep({ step, children, isActive }: OnboardingStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isActive && headingRef.current) {
      headingRef.current.focus();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <section
      aria-label={`Onboarding step ${step}`}
      className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] px-6",
        "animate-in fade-in slide-in-from-right-4 duration-500",
        "motion-reduce:animate-none"
      )}
    >
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        Step {step}
      </h2>
      {children}
    </section>
  );
}
