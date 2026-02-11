"use client";

import { Button } from "@/components/atoms/Button";

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saving?: boolean;
  disabled?: boolean;
}

export function ActionButtons({
  onCancel,
  onSave,
  saveLabel = "Save Task",
  cancelLabel = "Cancel",
  saving = false,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3 animate-in slide-in-from-bottom-2 motion-reduce:animate-none">
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={saving}
        className="flex-1"
      >
        {cancelLabel}
      </Button>
      <Button
        variant="primary"
        onClick={onSave}
        loading={saving}
        disabled={disabled}
        className="flex-1"
      >
        {saveLabel}
      </Button>
    </div>
  );
}
