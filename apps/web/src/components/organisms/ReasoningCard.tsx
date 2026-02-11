"use client";

import { useState } from "react";
import type { ReasoningJson } from "@/types/api";
import { ReasoningTier1 } from "@/components/molecules/ReasoningTier1";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";

type ReasoningCardState =
  | "collapsed"
  | "tier2_expanded"
  | "tier3_expanded"
  | "loading"
  | "error";

interface ReasoningCardProps {
  reasoning: ReasoningJson;
  onOverride?: (reason: string) => void;
  onFetchTier3?: () => Promise<{ chain: string[]; accuracy: number }>;
}

export function ReasoningCard({
  reasoning,
  onOverride,
  onFetchTier3,
}: ReasoningCardProps) {
  const [state, setState] = useState<ReasoningCardState>("collapsed");
  const [tier3Data, setTier3Data] = useState<{
    chain: string[];
    accuracy: number;
  } | null>(null);

  const handleToggleTier2 = () => {
    setState((s) => (s === "collapsed" ? "tier2_expanded" : "collapsed"));
  };

  const handleToggleTier3 = async () => {
    if (state === "tier3_expanded") {
      setState("tier2_expanded");
      return;
    }
    if (!onFetchTier3) return;
    setState("loading");
    try {
      const data = await onFetchTier3();
      setTier3Data(data);
      setState("tier3_expanded");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="rounded-xl border border-(--color-sage-light)/20 bg-(--color-cream)/50 overflow-hidden">
      <ReasoningTier1
        summary={reasoning.tier1}
        isExpanded={state !== "collapsed"}
        onToggle={handleToggleTier2}
      />

      {(state === "tier2_expanded" || state === "tier3_expanded") && (
        <div className="px-4 pb-3 space-y-3" aria-label="Reasoning factors">
          <div className="space-y-2">
            {Object.entries(reasoning.factors).map(([factor, weight]) => (
              <div key={factor} className="flex items-center gap-2">
                <span className="text-xs text-(--color-text)/60 w-24 truncate capitalize">
                  {factor.replace(/_/g, " ")}
                </span>
                <div className="flex-1 h-2 bg-(--color-sage-light)/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--color-sage) rounded-full transition-all duration-500 motion-reduce:transition-none"
                    style={{ width: `${weight * 100}%` }}
                  />
                </div>
                <span className="text-xs text-(--color-text)/50 w-10 text-right">
                  {Math.round(weight * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-(--color-sage)">
              Confidence: {Math.round(reasoning.confidence * 100)}%
            </span>
            <div className="flex gap-2">
              {onOverride && (
                <Button variant="ghost" size="sm" onClick={() => onOverride("not_now")}>
                  Not now
                </Button>
              )}
              {onFetchTier3 && (
                <Button variant="ghost" size="sm" onClick={handleToggleTier3}>
                  {state === "tier3_expanded" ? "Less detail" : "See full reasoning"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {state === "tier3_expanded" && tier3Data && (
        <div className="px-4 pb-4 border-t border-(--color-sage-light)/10 pt-3">
          <h4 className="text-xs font-medium text-(--color-text)/60 mb-2 uppercase tracking-wide">
            Reasoning Chain
          </h4>
          <ol className="space-y-1 list-decimal list-inside text-sm text-(--color-text)/80">
            {tier3Data.chain.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-(--color-text)/50">
            Historical accuracy: {Math.round(tier3Data.accuracy * 100)}%
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="px-4 pb-3 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      )}

      {state === "error" && (
        <div className="px-4 pb-3">
          <p className="text-sm text-(--color-terracotta)">
            Reasoning unavailable.{" "}
            <button onClick={handleToggleTier3} className="underline hover:no-underline">
              Retry
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
