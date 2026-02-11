"use client";

import type { DailyPlanSlot, TaskResponse } from "@/types/api";
import { ReasoningTier1 } from "@/components/molecules/ReasoningTier1";

interface PlanTaskRowProps {
  slot: DailyPlanSlot;
  task: TaskResponse;
  onToggleReasoning: () => void;
  reasoningExpanded: boolean;
}

export function PlanTaskRow({
  slot,
  task,
  onToggleReasoning,
  reasoningExpanded,
}: PlanTaskRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-(--color-sage-light)/10 last:border-0">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-(--color-sage)/15 text-(--color-sage) text-xs font-bold flex items-center justify-center">
        {slot.position}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-(--color-text) font-medium truncate">{task.title}</p>
        {task.estimated_minutes && (
          <span className="text-xs text-(--color-text)/50">
            ~{task.estimated_minutes}min
          </span>
        )}
        {slot.reasoning_json && (
          <ReasoningTier1
            summary={(slot.reasoning_json as any).tier1}
            isExpanded={reasoningExpanded}
            onToggle={onToggleReasoning}
          />
        )}
      </div>
    </div>
  );
}
