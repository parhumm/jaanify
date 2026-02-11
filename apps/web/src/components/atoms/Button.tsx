"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-sage) text-white hover:bg-(--color-sage-dark) active:scale-[0.98]",
  secondary:
    "bg-(--color-cream) text-(--color-text) border border-(--color-sage-light) hover:bg-(--color-sage-light)/10",
  ghost:
    "bg-transparent text-(--color-text) hover:bg-(--color-sage-light)/10",
  danger:
    "bg-(--color-terracotta) text-white hover:bg-(--color-terracotta-dark) active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[36px]",
  md: "px-4 py-2 text-base min-h-[44px]",
  lg: "px-6 py-3 text-lg min-h-[48px]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "motion-reduce:transition-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
