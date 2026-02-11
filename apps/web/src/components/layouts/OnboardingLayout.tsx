"use client";

import { type ReactNode } from "react";
import { ProgressDots } from "@/components/atoms/ProgressDots";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col">
      <main className="flex-1 mx-auto max-w-[480px] w-full px-4 sm:max-w-[560px]">
        {children}
      </main>
      <footer className="py-6">
        <ProgressDots totalSteps={totalSteps} currentStep={currentStep} />
      </footer>
    </div>
  );
}
