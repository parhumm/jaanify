"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { TaskParseResponse } from "@/types/api";
import { cn } from "@/lib/cn";
import { ParsedField } from "@/components/molecules/ParsedField";
import { SuggestionChips } from "@/components/molecules/SuggestionChips";
import { ActionButtons } from "@/components/molecules/ActionButtons";
import { Chip } from "@/components/atoms/Chip";

type TaskInputState =
  | "idle"
  | "typing"
  | "parsing"
  | "parsed"
  | "saving"
  | "error"
  | "voice_listening"
  | "voice_processing";

interface TaskInputFormProps {
  onSave: (data: {
    title: string;
    raw_input: string;
    parsed: TaskParseResponse | null;
  }) => void;
  onCancel: () => void;
  onParse: (input: string) => Promise<TaskParseResponse>;
  initialText?: string;
  suggestions?: string[];
}

export function TaskInputForm({
  onSave,
  onCancel,
  onParse,
  initialText = "",
  suggestions = ["Call...", "Remind me...", "Review...", "Buy..."],
}: TaskInputFormProps) {
  const [inputState, setInputState] = useState<TaskInputState>("idle");
  const [text, setText] = useState(initialText);
  const [parsed, setParsed] = useState<TaskParseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (text.length < 4 || inputState === "saving") return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setInputState("parsing");
      try {
        const result = await onParse(text);
        setParsed(result);
        setInputState("parsed");
      } catch {
        setError("Couldn't parse your input. You can still save manually.");
        setInputState("error");
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [text, onParse, inputState]);

  const handleTextChange = (value: string) => {
    setText(value);
    setInputState("typing");
    setError(null);
    autoResize();
  };

  const handleSave = () => {
    if (!text.trim()) return;
    setInputState("saving");
    onSave({
      title: parsed?.title ?? text.trim(),
      raw_input: text,
      parsed,
    });
  };

  const handleSuggestion = (suggestion: string) => {
    setText(suggestion);
    textareaRef.current?.focus();
    handleTextChange(suggestion);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4">
      {inputState === "idle" && (
        <SuggestionChips
          suggestions={suggestions}
          onSelect={handleSuggestion}
        />
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && parsed) {
              e.preventDefault();
              handleSave();
            }
          }}
          placeholder="What do you need to do?"
          className={cn(
            "w-full bg-transparent border-0 border-b-2 border-(--color-sage-light)/30",
            "text-xl text-(--color-text) placeholder:text-(--color-text)/30",
            "focus:border-(--color-sage) focus:outline-none",
            "resize-none overflow-hidden py-3",
            "transition-colors duration-150",
            "motion-reduce:transition-none"
          )}
          rows={1}
          autoFocus
          aria-label="Task description"
        />
        {inputState === "parsing" && (
          <div
            className="flex gap-1.5 mt-2"
            role="status"
            aria-label="Parsing your input"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-sage) animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-sage) animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-sage) animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </div>

      {inputState === "parsed" && parsed && (
        <div className="rounded-xl border border-(--color-sage-light)/20 bg-(--color-cream)/50 p-4 space-y-2 animate-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <ParsedField
            icon={<span>&#128197;</span>}
            label="Deadline"
            value={parsed.deadline ? new Date(parsed.deadline).toLocaleString() : "None"}
            onEdit={() => {}}
          />
          <ParsedField
            icon={<span>&#128193;</span>}
            label="Category"
            value={parsed.category ?? "None"}
            onEdit={() => {}}
          />
          <ParsedField
            icon={<span>&#9889;</span>}
            label="Energy"
            value={parsed.energy_level ?? "None"}
            onEdit={() => {}}
          />
          <ParsedField
            icon={<span>&#9202;</span>}
            label="Estimated"
            value={
              parsed.estimated_minutes
                ? `${parsed.estimated_minutes} min`
                : "None"
            }
            onEdit={() => {}}
          />
          {parsed.reasoning && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.entries(parsed.reasoning).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key.replace(/detected_/g, "")}: ${value}`}
                  active
                />
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-(--color-terracotta)" role="alert">
          {error}
        </p>
      )}

      {(inputState === "parsed" || inputState === "error" || inputState === "saving") && text.trim() && (
        <ActionButtons
          onCancel={onCancel}
          onSave={handleSave}
          saving={inputState === "saving"}
          disabled={!text.trim()}
        />
      )}
    </div>
  );
}
