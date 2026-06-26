"use client";

import { eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo, useState } from "react";

import { tasksCollection } from "@/collections/tasksCollection";
import { AddTaskForm } from "@/components/AddTaskForm";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TaskFilter = "all" | "active" | "done";

type TaskListProps = {
  selectedProjectId: number | null;
  projectName: string;
};

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

export function TaskList({ selectedProjectId, projectName }: TaskListProps) {
  const [filter, setFilter] = useState<TaskFilter>("all");

  const { data: projectTasks = [] } = useLiveQuery(
    (q) => {
      if (selectedProjectId === null) return undefined;

      return q
        .from({ task: tasksCollection })
        .where(({ task }) => eq(task.projectId, selectedProjectId))
        .select(({ task }) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          projectId: task.projectId,
          $synced: task.$synced,
        }));
    },
    [selectedProjectId]
  );

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return projectTasks.filter((task) => !task.completed);
      case "done":
        return projectTasks.filter((task) => task.completed);
      default:
        return projectTasks;
    }
  }, [projectTasks, filter]);

  const emptyMessage = useMemo(() => {
    if (projectTasks.length === 0) {
      return "No tasks in this project yet. Add one above.";
    }

    if (filter === "active") {
      return "No active tasks. You're all caught up!";
    }

    if (filter === "done") {
      return "No completed tasks yet.";
    }

    return "No tasks match this filter.";
  }, [projectTasks.length, filter]);

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-border px-6 py-5">
        <h1 className="text-lg font-semibold text-foreground">{projectName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {projectTasks.length} task{projectTasks.length === 1 ? "" : "s"}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <AddTaskForm projectId={selectedProjectId} />

        <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFilter(value)}
              className={cn(
                "flex-1",
                filter === value && "bg-background text-foreground shadow-sm"
              )}
            >
              {label}
            </Button>
          ))}
        </div>

        {filteredTasks.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
