"use client";

import { useMemo, useState } from "react";

import { ProjectList } from "@/components/ProjectList";
import { TaskList } from "@/components/TaskList";
import { PROJECTS, TASKS } from "@/data/dummy";
import type { Task } from "@/types";

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [tasks, setTasks] = useState<Task[]>(TASKS);

  const projects = useMemo(
    () =>
      PROJECTS.map((project) => ({
        ...project,
        taskCount: tasks.filter((task) => task.projectId === project.id).length,
      })),
    [tasks]
  );

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  const handleAddTask = (title: string) => {
    setTasks((current) => [
      ...current,
      {
        id: String(Date.now()),
        title,
        completed: false,
        projectId: selectedProjectId,
      },
    ]);
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-6">
      <div className="flex min-h-[calc(100vh-3rem)] w-full max-w-[1100px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <ProjectList
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
        />
        <TaskList
          tasks={tasks}
          selectedProjectId={selectedProjectId}
          projectName={selectedProject?.name ?? "Project"}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}
