"use client";

import { type ReactNode, useState, useId } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/atoms/IconButton";

interface ParsedFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
  onEdit: (newValue: string) => void;
}

export function ParsedField({ icon, label, value, onEdit }: ParsedFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const fieldId = useId();

  const handleSave = () => {
    onEdit(editValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-(--color-sage) flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-(--color-text)/50 uppercase tracking-wide">
          {label}
        </span>
        {isEditing ? (
          <input
            id={fieldId}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditValue(value);
                setIsEditing(false);
              }
            }}
            className="block w-full bg-transparent border-b border-(--color-sage) text-(--color-text) focus:outline-none py-0.5"
            autoFocus
            aria-label={`Edit ${label}`}
          />
        ) : (
          <p className="text-(--color-text) truncate">{value}</p>
        )}
      </div>
      {!isEditing && (
        <IconButton
          label={`Edit ${label}`}
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <svg
            className="h-4 w-4 text-(--color-text)/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </IconButton>
      )}
    </div>
  );
}
