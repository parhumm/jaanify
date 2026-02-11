"use client";

import { useRouter } from "next/navigation";
import { useCreateTask, useParseTask } from "@/hooks/api";
import { TaskInputForm } from "@/components/organisms/TaskInputForm";
import type { TaskParseResponse } from "@/types/api";

export function TaskInputContent() {
  const router = useRouter();
  const createTask = useCreateTask();
  const parseTask = useParseTask();

  const handleParse = async (input: string): Promise<TaskParseResponse> => {
    return parseTask.mutateAsync({ input });
  };

  const handleSave = (data: {
    title: string;
    raw_input: string;
    parsed: TaskParseResponse | null;
  }) => {
    createTask.mutate(
      {
        title: data.title,
        raw_input: data.raw_input,
        deadline: data.parsed?.deadline,
        category: data.parsed?.category,
        energy_level: data.parsed?.energy_level,
        estimated_minutes: data.parsed?.estimated_minutes,
      },
      {
        onSuccess: () => router.push("/dashboard"),
      }
    );
  };

  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col justify-center py-8">
      <div className="mb-4 px-4">
        <button
          onClick={() => router.back()}
          className="text-(--color-text)/60 hover:text-(--color-text) text-sm flex items-center gap-1"
          aria-label="Go back"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      <TaskInputForm
        onSave={handleSave}
        onCancel={() => router.back()}
        onParse={handleParse}
      />
    </div>
  );
}
