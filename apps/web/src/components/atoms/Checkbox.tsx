"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, disabled = false }: CheckboxProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "h-5 w-5 rounded border-2 border-(--color-sage-light)/40",
          "checked:bg-(--color-sage) checked:border-(--color-sage)",
          "focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2",
          "transition-all duration-150",
          "motion-reduce:transition-none",
          "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "text-(--color-text) cursor-pointer select-none",
          "transition-all duration-150",
          checked && "line-through opacity-60"
        )}
      >
        {label}
      </label>
    </div>
  );
}
