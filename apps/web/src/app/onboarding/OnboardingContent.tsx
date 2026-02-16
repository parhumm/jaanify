"use client";

import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";
import { OnboardingStep } from "@/components/organisms/OnboardingStep";
import { Button } from "@/components/atoms/Button";
import { ReasoningCard } from "@/components/organisms/ReasoningCard";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useCreateGuestSession, useParseTask } from "@/hooks/api";
import type { ReasoningJson } from "@/types/api";

export function OnboardingContent() {
  const router = useRouter();
  const { step, setStep, taskText, setTaskText, parsedTask, setParsedTask } =
    useOnboardingStore();
  const createGuest = useCreateGuestSession();
  const parseTask = useParseTask();

  const handleStep1Submit = async () => {
    if (taskText.length < 4) return;

    createGuest.mutate({ data_json: { first_task: taskText } });

    try {
      const result = await parseTask.mutateAsync({ input: taskText });
      setParsedTask(result);
      setStep(2);
    } catch {
      setStep(2);
    }
  };

  const handleComplete = (skippedAccount: boolean) => {
    if (skippedAccount) {
      router.push("/dashboard");
    }
    // TODO: Handle Google OAuth completion
  };

  const demoReasoning: ReasoningJson = parsedTask
    ? {
        tier1: `Prioritized because: ${parsedTask.category ?? "personal task"} with ${
          parsedTask.deadline ? "upcoming deadline" : "no deadline"
        }`,
        factors: {
          deadline: parsedTask.deadline ? 0.35 : 0.1,
          importance: 0.25,
          energy: 0.2,
          context: 0.2,
        },
        confidence: parsedTask.confidence ?? 0.85,
      }
    : {
        tier1: "High priority — deadline approaching",
        factors: { deadline: 0.35, importance: 0.25, energy: 0.2, context: 0.2 },
        confidence: 0.85,
      };

  return (
    <OnboardingLayout currentStep={step - 1} totalSteps={4}>
      <OnboardingStep step={1} isActive={step === 1}>
        <div className="text-center space-y-6 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl">
          <h1 className="text-3xl font-bold text-(--color-text)">
            What&apos;s on your mind?
          </h1>
          <p className="text-(--color-text)/60">
            Type one task. We&apos;ll show you something cool.
          </p>
          <textarea
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleStep1Submit();
              }
            }}
            placeholder="e.g. Call Sarah about the proposal by Friday"
            className="w-full bg-transparent border-0 border-b-2 border-(--color-sage-light)/30 text-xl text-(--color-text) placeholder:text-(--color-text)/30 focus:border-(--color-sage) focus:outline-none resize-none py-3 text-center"
            rows={2}
            autoFocus
            aria-label="Enter your first task"
          />
          {taskText.length >= 4 && (
            <div className="animate-in slide-in-from-bottom-2 motion-reduce:animate-none">
              <Button onClick={handleStep1Submit} loading={parseTask.isPending}>
                Show me the magic
              </Button>
            </div>
          )}
        </div>
      </OnboardingStep>

      <OnboardingStep step={2} isActive={step === 2}>
        <div className="space-y-6 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              Here&apos;s what we found
            </h2>
            <p className="text-sm text-(--color-text)/60">
              AI analyzed your task and here&apos;s the reasoning
            </p>
          </div>
          <div className="rounded-xl border border-(--color-sage-light)/20 bg-(--color-cream)/50 p-4 space-y-3">
            <h3 className="font-medium text-(--color-text)">
              {parsedTask?.title ?? taskText}
            </h3>
            {parsedTask?.deadline && (
              <p className="text-sm text-(--color-text)/60">
                Deadline: {new Date(parsedTask.deadline).toLocaleDateString()}
              </p>
            )}
            {parsedTask?.category && (
              <p className="text-sm text-(--color-text)/60">
                Category: {parsedTask.category}
              </p>
            )}
          </div>
          <ReasoningCard reasoning={demoReasoning} />
          <Button onClick={() => setStep(3)} className="w-full">
            See your day planned
          </Button>
        </div>
      </OnboardingStep>

      <OnboardingStep step={3} isActive={step === 3}>
        <div className="space-y-6 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              Your day, planned
            </h2>
            <p className="text-sm text-(--color-text)/60">
              AI orders your tasks based on deadlines, energy, and priority
            </p>
          </div>
          <div className="rounded-xl border border-(--color-sage-light)/20 bg-(--color-cream)/50 p-4 space-y-1">
            <div className="flex items-start gap-3 py-3 border-b border-(--color-sage-light)/10">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-(--color-sage)/15 text-(--color-sage) text-xs font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <p className="font-medium text-(--color-text)">{parsedTask?.title ?? taskText}</p>
                <p className="text-xs text-(--color-sage)">{demoReasoning.tier1}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3 border-b border-(--color-sage-light)/10">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-(--color-sage)/15 text-(--color-sage) text-xs font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <p className="font-medium text-(--color-text)/60">Review weekly report</p>
                <p className="text-xs text-(--color-text)/40">Medium priority — end of day</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-(--color-sage)/15 text-(--color-sage) text-xs font-bold flex items-center justify-center">
                3
              </span>
              <div>
                <p className="font-medium text-(--color-text)/60">Organize desk</p>
                <p className="text-xs text-(--color-text)/40">Low energy — whenever</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setStep(4)} className="w-full">
            Almost done
          </Button>
        </div>
      </OnboardingStep>

      <OnboardingStep step={4} isActive={step === 4}>
        <div className="space-y-6 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl text-center">
          <h2 className="text-xl font-bold text-(--color-text)">
            Save your progress?
          </h2>
          <p className="text-sm text-(--color-text)/60">
            Your tasks are saved for 7 days. Sign in to keep them forever.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              // TODO: Trigger Google OAuth flow
              handleComplete(false);
            }}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <button
            onClick={() => handleComplete(true)}
            className="text-(--color-text)/50 hover:text-(--color-text) text-sm underline underline-offset-4"
          >
            Skip for now — I&apos;ll sign in later
          </button>
          <p className="text-xs text-(--color-text)/40">
            We only use your email to sync tasks across devices. No spam, ever.
          </p>
        </div>
      </OnboardingStep>
    </OnboardingLayout>
  );
}
