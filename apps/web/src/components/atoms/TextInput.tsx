"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/lib/cn";

interface TextInputProps {
  label: string;
  error?: string;
  multiline?: boolean;
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export function TextInput({
  label,
  error,
  multiline = false,
  ref,
  inputProps,
  textareaProps,
}: TextInputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const sharedClasses = cn(
    "w-full bg-transparent px-0 py-2 text-(--color-text)",
    "border-0 border-b-2 border-(--color-sage-light)/30",
    "placeholder:text-(--color-text)/40",
    "focus:border-(--color-sage) focus:outline-none",
    "transition-colors duration-150",
    "motion-reduce:transition-none",
    error && "border-(--color-terracotta) focus:border-(--color-terracotta)"
  );

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-(--color-text)/70">
        {label}
      </label>
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(sharedClasses, "resize-none")}
          rows={1}
          {...textareaProps}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={sharedClasses}
          {...inputProps}
        />
      )}
      {error && (
        <p id={errorId} className="text-sm text-(--color-terracotta)" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
