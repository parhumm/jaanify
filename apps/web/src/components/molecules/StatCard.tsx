import { type ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
}

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-(--color-cream) p-4 min-w-[100px]">
      <span className="text-(--color-sage)" aria-hidden="true">
        {icon}
      </span>
      <span className="text-2xl font-bold text-(--color-text)">{value}</span>
      <span className="text-xs text-(--color-text)/60">{label}</span>
    </div>
  );
}
