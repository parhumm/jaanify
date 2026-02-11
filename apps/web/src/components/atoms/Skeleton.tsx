import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-gradient-to-r from-(--color-cream) via-(--color-cream-dark)/50 to-(--color-cream)",
        "motion-reduce:animate-none motion-reduce:bg-(--color-cream-dark)/30",
        variant === "text" && "h-4 w-full rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-lg",
        className
      )}
    />
  );
}
