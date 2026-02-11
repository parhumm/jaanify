import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "high" | "medium" | "low" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const badgeVariantStyles: Record<BadgeVariant, string> = {
  high: "bg-(--color-terracotta)/15 text-(--color-terracotta)",
  medium: "bg-(--color-gold)/15 text-(--color-gold-dark)",
  low: "bg-(--color-sage)/15 text-(--color-sage)",
  default: "bg-(--color-sage-light)/15 text-(--color-text)/70",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeVariantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}
