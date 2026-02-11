"use client";

import { cn } from "@/lib/cn";

interface ReasoningTier1Props {
  summary: string;
  isExpanded: boolean;
  onToggle: () => void;
  expandLabel?: string;
}

export function ReasoningTier1({
  summary,
  isExpanded,
  onToggle,
  expandLabel = "See why",
}: ReasoningTier1Props) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left",
        "text-sm text-(--color-text)/70",
        "hover:bg-(--color-sage-light)/10 transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage)",
        "motion-reduce:transition-none"
      )}
    >
      <svg
        className="h-4 w-4 text-(--color-sage) flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <span className="flex-1 truncate">{summary}</span>
      <svg
        className={cn(
          "h-4 w-4 text-(--color-text)/40 transition-transform duration-200",
          isExpanded && "rotate-180"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
      <span className="sr-only">{isExpanded ? "Collapse reasoning" : expandLabel}</span>
    </button>
  );
}
