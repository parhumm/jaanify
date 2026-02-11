"use client";

import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "circle";
  ref?: React.Ref<HTMLButtonElement>;
}

const iconSizeStyles = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export function IconButton({
  label,
  size = "md",
  variant = "default",
  className,
  children,
  ref,
  ...props
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center",
        "transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2",
        "hover:bg-(--color-sage-light)/10 active:scale-[0.95]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "motion-reduce:transition-none",
        iconSizeStyles[size],
        variant === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
