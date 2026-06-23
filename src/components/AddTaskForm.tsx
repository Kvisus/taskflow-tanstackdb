"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTaskFormProps = {
  onAdd: (title: string) => void;
};

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a new task..."
        aria-label="Task title"
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}
