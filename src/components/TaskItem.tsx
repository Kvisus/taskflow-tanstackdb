"use client";

import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isToggling: boolean;
  isDeleting: boolean;
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: TaskItemProps) {
  const isBusy = isToggling || isDeleting;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
        isBusy && "opacity-60"
      )}
    >
      {isToggling ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggle(task.id, checked === true)}
          disabled={isBusy}
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
      )}
      <span
        className={cn(
          "min-w-0 flex-1 text-sm",
          task.completed && "text-muted-foreground line-through"
        )}
      >
        {task.title}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(task.id)}
        disabled={isBusy}
        aria-label={`Delete "${task.title}"`}
        className="text-muted-foreground hover:text-destructive"
      >
        {isDeleting ? <Loader2 className="animate-spin" /> : <X />}
      </Button>
    </li>
  );
}
