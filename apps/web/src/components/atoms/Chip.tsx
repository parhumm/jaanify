"use client";

import { cn } from "@/lib/cn";

interface ChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export function Chip({
  label,
  onClick,
  active = false,
  removable = false,
  onRemove,
}: ChipProps) {
  const isInteractive = !!onClick;

  return (
    <span
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
        "transition-all duration-150",
        "motion-reduce:transition-none",
        isInteractive && "cursor-pointer hover:bg-(--color-sage)/20",
        isInteractive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage)",
        active
          ? "bg-(--color-sage)/20 text-(--color-sage) font-medium"
          : "bg-(--color-cream-dark)/50 text-(--color-text)/70"
      )}
    >
      {label}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          className="ml-0.5 h-4 w-4 rounded-full hover:bg-(--color-terracotta)/20 inline-flex items-center justify-center"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </span>
  );
}
