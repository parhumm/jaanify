"use client";

import type { TaskResponse } from "@/types/api";
import { cn } from "@/lib/cn";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Badge } from "@/components/atoms/Badge";
import { ReasoningCard } from "@/components/organisms/ReasoningCard";

interface TaskCardProps {
  task: TaskResponse;
  onComplete: (id: string) => void;
  onOverride?: (id: string, reason: string) => void;
}

export function TaskCard({ task, onComplete, onOverride }: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const priorityVariant =
    task.priority_score >= 0.7
      ? "high"
      : task.priority_score >= 0.4
        ? "medium"
        : "low";

  return (
    <article
      className={cn(
        "rounded-xl border-l-4 bg-(--color-cream)/50 p-4",
        "transition-all duration-200",
        "motion-reduce:transition-none",
        priorityVariant === "high" && "border-l-(--color-terracotta)",
        priorityVariant === "medium" && "border-l-(--color-gold)",
        priorityVariant === "low" && "border-l-(--color-sage)",
        isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          label=""
          checked={isCompleted}
          onChange={() => onComplete(task.id)}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-(--color-text)",
              isCompleted && "line-through"
            )}
            title={task.title.length > 60 ? task.title : undefined}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {task.category && <Badge variant="default">{task.category}</Badge>}
            {task.estimated_minutes && (
              <span className="text-xs text-(--color-text)/50">
                ~{task.estimated_minutes}min
              </span>
            )}
            {task.energy_level && (
              <Badge
                variant={
                  task.energy_level === "high"
                    ? "high"
                    : task.energy_level === "medium"
                      ? "medium"
                      : "low"
                }
              >
                {task.energy_level}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {task.reasoning_json && !isCompleted && (
        <div className="mt-3">
          <ReasoningCard
            reasoning={task.reasoning_json}
            onOverride={
              onOverride
                ? (reason) => onOverride(task.id, reason)
                : undefined
            }
          />
        </div>
      )}
    </article>
  );
}
