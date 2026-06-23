"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.id, task.completed]);

  const handleToggle = (checked: boolean) => {
    setCompleted(checked);
    onToggle(task.id, checked);
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => handleToggle(checked === true)}
        aria-label={`Mark "${task.title}" as ${completed ? "incomplete" : "complete"}`}
      />
      <span
        className={cn(
          "min-w-0 flex-1 text-sm",
          completed && "text-muted-foreground line-through"
        )}
      >
        {task.title}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
        className="text-muted-foreground hover:text-destructive"
      >
        <X />
      </Button>
    </li>
  );
}
