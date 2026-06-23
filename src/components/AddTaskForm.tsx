"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTaskFormProps = {
  onAdd: (title: string) => Promise<void>;
  isLoading: boolean;
};

export function AddTaskForm({ onAdd, isLoading }: AddTaskFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || isLoading) return;

    await onAdd(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a new task..."
        aria-label="Task title"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !title.trim()}>
        {isLoading ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}
