"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetMe,
  useListTasks,
  useListDailyPlans,
  useUpdateTask,
  useGenerateDailyPlan,
  useCreateFeedback,
} from "@/hooks/api";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { DailyPlanComponent } from "@/components/organisms/DailyPlan";
import { TaskCard } from "@/components/organisms/TaskCard";
import { VoiceFAB } from "@/components/molecules/VoiceFAB";
import { Skeleton } from "@/components/atoms/Skeleton";
import type { TaskResponse, DailyPlanResponse } from "@/types/api";

export function DashboardContent() {
  const router = useRouter();
  const { data: user } = useGetMe();
  const {
    data: taskList,
    isLoading: tasksLoading,
  } = useListTasks({ status: "active" });
  const {
    data: planList,
    isLoading: plansLoading,
  } = useListDailyPlans({ limit: 1 });
  const updateTask = useUpdateTask();
  const generatePlan = useGenerateDailyPlan();
  const createFeedback = useCreateFeedback();

  const [voiceState, setVoiceState] = useState<
    "idle" | "listening" | "processing" | "error" | "unsupported"
  >("idle");

  const todayPlan: DailyPlanResponse | null = planList?.data[0] ?? null;

  const taskMap = new Map<string, TaskResponse>(
    (taskList?.data ?? []).map((t) => [t.id, t])
  );

  const handleComplete = (id: string) => {
    updateTask.mutate({
      id,
      data: { status: "completed" },
    });
  };

  const handleOverride = (taskId: string, reason: string) => {
    createFeedback.mutate({
      task_id: taskId,
      feedback_type: "not_now",
      reason,
    });
  };

  const planState = plansLoading
    ? "loading"
    : !todayPlan && (taskList?.data.length ?? 0) === 0
      ? "empty"
      : todayPlan
        ? "success"
        : "empty";

  const completedToday = (taskList?.data ?? []).filter(
    (t) => t.completed_at && new Date(t.completed_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <DashboardHeader
        userName={user?.name?.split(" ")[0] ?? null}
        date={new Date()}
      />

      <div className="grid grid-cols-3 gap-3">
        {tasksLoading ? (
          <>
            <Skeleton className="h-24" variant="rectangular" />
            <Skeleton className="h-24" variant="rectangular" />
            <Skeleton className="h-24" variant="rectangular" />
          </>
        ) : (
          <>
            <StatCard
              icon={<span>&#10003;</span>}
              value={completedToday}
              label="Done today"
            />
            <StatCard
              icon={<span>&#9201;</span>}
              value="—"
              label="Focus time"
            />
            <StatCard
              icon={<span>&#128293;</span>}
              value="—"
              label="Streak"
            />
          </>
        )}
      </div>

      <DailyPlanComponent
        plan={todayPlan}
        tasks={taskMap}
        state={planState as "loading" | "success" | "error" | "empty" | "refreshing"}
        onGenerate={() => generatePlan.mutate()}
        onAddTask={() => router.push("/tasks/new")}
        onRefresh={() => generatePlan.mutate()}
      />

      {!tasksLoading && (taskList?.data ?? []).length > 0 && (
        <section aria-label="All tasks" className="space-y-3">
          <h2 className="text-sm font-medium text-(--color-text)/60 uppercase tracking-wide">
            All Tasks
          </h2>
          {taskList?.data.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onOverride={handleOverride}
            />
          ))}
        </section>
      )}

      <VoiceFAB
        state={voiceState}
        onPress={() => {
          router.push("/tasks/new");
        }}
        onStop={() => setVoiceState("idle")}
      />
    </div>
  );
}
