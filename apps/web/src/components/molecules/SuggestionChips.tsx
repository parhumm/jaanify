"use client";

import { Chip } from "@/components/atoms/Chip";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      role="group"
      aria-label="Suggestion chips"
    >
      {suggestions.map((suggestion) => (
        <Chip
          key={suggestion}
          label={suggestion}
          onClick={() => onSelect(suggestion)}
        />
      ))}
    </div>
  );
}
