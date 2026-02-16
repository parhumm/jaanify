"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ────────────────────────────────────────────────
   Jaanify Landing Page
   "Give soul to your tasks"

   Sections: Hero → Features → How It Works → CTA
   Palette: sage / cream / terracotta (from globals.css tokens)
   Font: DM Sans (loaded via layout.tsx)
   ──────────────────────────────────────────────── */

// ── Scroll-triggered fade-in hook ──────────────
function useFadeIn<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useFadeIn<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Feature data ────────────────────────────────
const features = [
  {
    title: "Natural Language Input",
    description:
      "Type tasks the way you think. Jaanify parses deadlines, priorities, and categories from plain text.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="8"
          width="40"
          height="32"
          rx="4"
          className="stroke-(--color-sage)"
          strokeWidth="2.5"
        />
        <path
          d="M12 20h24M12 28h16"
          className="stroke-(--color-sage)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="38" cy="28" r="3" className="fill-(--color-terracotta)" />
      </svg>
    ),
  },
  {
    title: "Reasoning Cards",
    description:
      "See why your AI planner made each decision. Three tiers of transparency, from summary to full factor weights.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="4"
          className="stroke-(--color-sage)"
          strokeWidth="2.5"
        />
        <path
          d="M14 16h20M14 24h14"
          className="stroke-(--color-sage)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 32h8"
          className="stroke-(--color-terracotta)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="34" cy="32" r="4" className="fill-(--color-gold)" />
      </svg>
    ),
  },
  {
    title: "Voice Capture",
    description:
      "Speak your tasks. The AI transcribes and structures them into your daily plan — hands-free.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <rect
          x="18"
          y="6"
          width="12"
          height="22"
          rx="6"
          className="stroke-(--color-sage)"
          strokeWidth="2.5"
        />
        <path
          d="M12 24c0 6.627 5.373 12 12 12s12-5.373 12-12"
          className="stroke-(--color-sage)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 36v6"
          className="stroke-(--color-terracotta)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Smart Daily Plans",
    description:
      "Wake up to an AI-generated plan optimized for your energy, deadlines, and focus patterns.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r="18"
          className="stroke-(--color-sage)"
          strokeWidth="2.5"
        />
        <path
          d="M24 14v10l7 7"
          className="stroke-(--color-terracotta)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const steps = [
  { number: "01", title: "Capture", description: "Type or speak your tasks naturally" },
  { number: "02", title: "Enrich", description: "AI parses and structures each task" },
  { number: "03", title: "Plan", description: "Get a transparent daily plan with reasoning" },
];

// ── Main Landing Page Component ─────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text)">
      {/* Skip to content */}
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--color-sage) focus:text-white focus:rounded-lg"
      >
        Skip to features
      </a>

      {/* ── Nav ─────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-md bg-(--color-bg)/80 border-b border-(--color-sage-light)/20"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-(--color-sage-dark)">
            Jaanify
          </span>
          <a
            href="/onboarding"
            className={cn(
              "inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium",
              "bg-(--color-sage) text-white",
              "hover:bg-(--color-sage-dark) active:scale-[0.98]",
              "transition-all duration-150 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
            )}
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Geometric background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-(--color-sage-light)/10" />
          <div className="absolute top-1/2 -left-16 h-48 w-48 rounded-full bg-(--color-gold)/8" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-(--color-terracotta)/6" />
        </div>

        <div className="relative mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
            <FadeIn>
              <p className="text-sm font-medium tracking-widest uppercase text-(--color-terracotta) mb-4">
                AI Task Manager
              </p>
            </FadeIn>

            <FadeIn delay={100}>
              <h1
                id="hero-heading"
                className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.1] tracking-tight"
              >
                Give{" "}
                <span className="text-(--color-sage)">soul</span>{" "}
                to your tasks
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-(--color-text)/70 max-w-lg sm:max-w-xl lg:max-w-2xl">
                The task manager that shows its work. AI plans your day with
                transparent reasoning you can see, question, and trust.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="/onboarding"
                  className={cn(
                    "inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-semibold",
                    "bg-(--color-sage) text-white",
                    "hover:bg-(--color-sage-dark) active:scale-[0.98]",
                    "transition-all duration-150 ease-out",
                    "shadow-md hover:shadow-lg",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
                  )}
                >
                  Try Jaanify Free
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
                <a
                  href="#features"
                  className={cn(
                    "inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-medium",
                    "bg-(--color-cream-dark) text-(--color-text)",
                    "border border-(--color-sage-light)/30",
                    "hover:bg-(--color-sage-light)/10 active:scale-[0.98]",
                    "transition-all duration-150 ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
                  )}
                >
                  See How It Works
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <p className="mt-6 text-sm text-(--color-text)/50">
                No credit card required. Start in 60 seconds.
              </p>
            </FadeIn>
          </div>

          {/* Hero visual — Reasoning Card preview */}
          <FadeIn delay={350} className="mt-16 sm:mt-20">
            <div
              className={cn(
                "relative max-w-md lg:max-w-lg xl:max-w-xl mx-auto sm:mx-0 sm:ml-auto sm:-mt-64 sm:mr-0",
                "bg-(--color-cream) rounded-2xl p-6",
                "border border-(--color-sage-light)/30",
                "shadow-lg"
              )}
              role="img"
              aria-label="Example of a Jaanify Reasoning Card showing AI task prioritization"
            >
              {/* Mock reasoning card */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-(--color-sage)/15 flex items-center justify-center">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-(--color-sage)"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium tracking-wide uppercase text-(--color-sage-dark)">
                  AI Reasoning
                </span>
              </div>

              <p className="text-sm leading-relaxed text-(--color-text)/80 mb-4">
                &ldquo;Scheduled <strong>Prepare Q1 report</strong> at 9 AM
                — your peak focus window. Deadline proximity (2 days) and
                cognitive load (high) both suggest morning priority.&rdquo;
              </p>

              <div className="flex gap-2 flex-wrap">
                {["Deadline: 2d", "Focus: High", "Energy: AM"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-(--color-sage-light)/15 text-(--color-sage-dark) font-medium"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Diagonal divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-(--color-cream)"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          aria-hidden="true"
        />
      </section>

      {/* ── Features ────────────────────────────── */}
      <section
        id="features"
        className="bg-(--color-cream) py-20 sm:py-28"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6">
          <FadeIn>
            <h2
              id="features-heading"
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight text-center"
            >
              Task management with{" "}
              <span className="text-(--color-sage)">transparency</span>
            </h2>
            <p className="mt-4 text-center text-(--color-text)/60 max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto text-lg">
              Every decision your AI planner makes is visible, explainable,
              and adjustable.
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 100}>
                <article
                  className={cn(
                    "group relative p-6 rounded-xl",
                    "bg-(--color-bg) border border-(--color-sage-light)/20",
                    "hover:border-(--color-sage-light)/40 hover:shadow-md",
                    "transition-all duration-200 ease-out"
                  )}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-(--color-text)/60">
                    {feature.description}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────── */}
      <section
        className="py-20 sm:py-28"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6">
          <FadeIn>
            <h2
              id="how-heading"
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight text-center"
            >
              Three steps to a{" "}
              <span className="text-(--color-terracotta)">smarter day</span>
            </h2>
          </FadeIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 150}>
                <div className="text-center sm:text-left">
                  <span className="text-4xl font-bold text-(--color-sage-light)/40">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-(--color-text)/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Social Proof ─────────────────── */}
      <section
        className="bg-(--color-cream) py-16"
        aria-labelledby="trust-heading"
      >
        <div className="mx-auto max-w-3xl xl:max-w-5xl px-6 text-center">
          <FadeIn>
            <h2 id="trust-heading" className="sr-only">
              Why people trust Jaanify
            </h2>
            <blockquote className="text-lg sm:text-xl italic leading-relaxed text-(--color-text)/70">
              &ldquo;I finally understand <em>why</em> my planner
              suggests what it does. That changes everything.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-medium text-(--color-sage-dark)">
              — Early beta tester
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-(--color-text)/40">
              {["Open Source", "Privacy First", "WCAG AA Accessible", "Works Offline"].map(
                (badge) => (
                  <span key={badge} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-(--color-sage)"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {badge}
                  </span>
                )
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────── */}
      <section
        className="py-24 sm:py-32 relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 -right-16 h-64 w-64 rounded-full bg-(--color-sage-light)/8" />
          <div className="absolute bottom-1/4 -left-12 h-48 w-48 rounded-full bg-(--color-gold)/6" />
        </div>

        <div className="relative mx-auto max-w-3xl xl:max-w-4xl 2xl:max-w-5xl px-6 text-center">
          <FadeIn>
            <h2
              id="cta-heading"
              className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight"
            >
              Ready to give your tasks{" "}
              <span className="text-(--color-sage)">a soul</span>?
            </h2>
            <p className="mt-4 text-lg text-(--color-text)/60">
              Join the beta. Free forever for early adopters.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-10">
              <a
                href="/onboarding"
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold",
                  "bg-(--color-sage) text-white",
                  "hover:bg-(--color-sage-dark) active:scale-[0.98]",
                  "transition-all duration-150 ease-out",
                  "shadow-md hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
                )}
              >
                Start Free — 60 Seconds
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-(--color-sage-light)/20 py-8">
        <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-(--color-text)/40">
          <p>&copy; 2026 Jaanify. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/parhumm/jaanify"
              className="hover:text-(--color-sage) transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
