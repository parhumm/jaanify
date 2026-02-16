import { type ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-(--color-bg)">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--color-sage) focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="mx-auto max-w-[640px] px-4 py-6 sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {children}
      </main>
    </div>
  );
}
