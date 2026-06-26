"use client";

import { X } from "lucide-react";
import { toast } from "sonner";

import { tasksCollection } from "@/collections/tasksCollection";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type LiveTask = {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
  $synced: boolean;
};

type TaskItemProps = {
  task: LiveTask;
};

export function TaskItem({ task }: TaskItemProps) {
  const handleToggle = async (completed: boolean) => {
    try {
      const tx = tasksCollection.update(task.id, (draft) => {
        draft.completed = completed;
      });
      await tx.isPersisted.promise;
      toast.success(completed ? "Task completed" : "Task marked active");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      const tx = tasksCollection.delete(task.id);
      await tx.isPersisted.promise;
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => void handleToggle(checked === true)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      />
      <span
        className={cn(
          "min-w-0 flex-1 text-sm",
          task.completed && "text-muted-foreground line-through"
        )}
      >
        {task.title}
      </span>
      {!task.$synced && (
        <span
          className="size-2 shrink-0 animate-pulse rounded-full bg-amber-400"
          aria-label="Syncing with server"
        />
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => void handleDelete()}
        aria-label={`Delete "${task.title}"`}
        className="text-muted-foreground hover:text-destructive"
      >
        <X />
      </Button>
    </li>
  );
}
