"use client";

import { useState } from "react";
import type { DailyPlanResponse, TaskResponse } from "@/types/api";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PlanTaskRow } from "@/components/molecules/PlanTaskRow";

type DailyPlanState = "loading" | "success" | "error" | "empty" | "refreshing";

interface DailyPlanComponentProps {
  plan: DailyPlanResponse | null;
  tasks: Map<string, TaskResponse>;
  state: DailyPlanState;
  onGenerate: () => void;
  onAddTask: () => void;
  onRefresh: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DailyPlanComponent({ plan, tasks, state, onGenerate, onAddTask, onRefresh }: DailyPlanComponentProps) {
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  if (state === "loading") {
    return (
      <section className="space-y-4" aria-label="Daily plan loading">
        <div className="rounded-xl bg-(--color-cream)/50 p-4 space-y-3">
          <p className="text-sm text-(--color-sage) animate-pulse motion-reduce:animate-none">
            AI is planning your day...
          </p>
          <Skeleton className="h-12 w-full" variant="rectangular" />
          <Skeleton className="h-12 w-full" variant="rectangular" />
          <Skeleton className="h-12 w-full" variant="rectangular" />
        </div>
      </section>
    );
  }

  if (state === "empty") {
    return (
      <section className="rounded-xl bg-(--color-cream)/50 p-8 text-center" aria-label="No tasks">
        <div className="text-4xl mb-3" aria-hidden="true">
          <span className="text-(--color-sage-light)">&#9728;</span>
        </div>
        <h2 className="text-lg font-medium text-(--color-text) mb-2">
          No tasks for today
        </h2>
        <p className="text-sm text-(--color-text)/60 mb-4">
          Add your first task and let AI plan your day
        </p>
        <Button variant="primary" onClick={onAddTask}>
          Add a task
        </Button>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section className="rounded-xl bg-(--color-cream)/50 p-6" aria-label="Plan error">
        <p className="text-sm text-(--color-terracotta) mb-3">
          Couldn&apos;t generate your daily plan.
        </p>
        <Button variant="secondary" onClick={onRefresh}>
          Try again
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="Today's plan">
      {state === "refreshing" && (
        <div className="text-xs text-(--color-sage) animate-pulse motion-reduce:animate-none">
          Updating plan...
        </div>
      )}
      <div className="rounded-xl bg-(--color-cream)/50 p-4">
        <h2 className="text-sm font-medium text-(--color-text)/60 mb-3 uppercase tracking-wide">
          Today&apos;s Plan
        </h2>
        {plan?.slots.map((slot) => {
          const task = tasks.get(slot.task_id);
          if (!task) return null;
          return (
            <PlanTaskRow
              key={slot.id}
              slot={slot}
              task={task}
              reasoningExpanded={expandedSlot === slot.id}
              onToggleReasoning={() =>
                setExpandedSlot((s) => (s === slot.id ? null : slot.id))
              }
            />
          );
        })}
      </div>
    </section>
  );
}
