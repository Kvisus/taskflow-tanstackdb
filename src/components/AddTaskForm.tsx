"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { tasksCollection } from "@/collections/tasksCollection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTaskFormProps = {
  projectId: number | null;
};

export function AddTaskForm({ projectId }: AddTaskFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || projectId === null) return;

    try {
      const tx = tasksCollection.insert({
        id: -Date.now(),
        title: trimmed,
        completed: false,
        projectId,
      });
      await tx.isPersisted.promise;
      toast.success("Task added");
      setTitle("");
    } catch {
      toast.error("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a new task..."
        aria-label="Task title"
        disabled={projectId === null}
      />
      <Button type="submit" disabled={!title.trim() || projectId === null}>
        Add Task
      </Button>
    </form>
  );
}
