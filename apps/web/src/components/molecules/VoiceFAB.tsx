"use client";

import { cn } from "@/lib/cn";

type VoiceFABState = "idle" | "listening" | "processing" | "error" | "unsupported";

interface VoiceFABProps {
  state: VoiceFABState;
  onPress: () => void;
  onStop: () => void;
}

export function VoiceFAB({ state, onPress, onStop }: VoiceFABProps) {
  if (state === "unsupported") return null;

  const isListening = state === "listening";
  const isProcessing = state === "processing";

  return (
    <button
      onClick={isListening ? onStop : onPress}
      disabled={isProcessing}
      aria-label={
        isListening
          ? "Stop voice recording"
          : isProcessing
            ? "Processing voice input"
            : state === "error"
              ? "Retry voice input"
              : "Start voice input"
      }
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "h-14 w-14 rounded-full shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        isListening
          ? "bg-(--color-terracotta) text-white animate-pulse"
          : "bg-(--color-sage) text-white hover:bg-(--color-sage-dark)",
        isProcessing && "opacity-70 cursor-wait",
        state === "error" && "bg-(--color-terracotta)"
      )}
    >
      {isProcessing ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )}
      {isListening && (
        <span className="absolute inset-0 rounded-full border-2 border-(--color-terracotta) animate-ping motion-reduce:animate-none" />
      )}
    </button>
  );
}
