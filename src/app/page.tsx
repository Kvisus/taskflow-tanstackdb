"use client";

import { useCallback, useEffect, useState } from "react";

import { ProjectList } from "@/components/ProjectList";
import { TaskList } from "@/components/TaskList";
import {
  createTask,
  deleteTask,
  fetchProjects,
  fetchTasks,
  updateTask,
} from "@/lib/api";
import type { Project, Task } from "@/types";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    const data = await fetchProjects();
    setProjects(data);
    return data;
  }, []);

  const loadTasks = useCallback(async () => {
    const data = await fetchTasks();
    setTasks(data);
    return data;
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([loadProjects(), loadTasks()]);
  }, [loadProjects, loadTasks]);

  useEffect(() => {
    async function init() {
      try {
        setIsLoadingProjects(true);
        const data = await loadProjects();
        if (data[0]) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setIsLoadingProjects(false);
      }
    }

    void init();
  }, [loadProjects]);

  useEffect(() => {
    if (!selectedProjectId) return;

    async function load() {
      try {
        setIsLoadingTasks(true);
        await loadTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setIsLoadingTasks(false);
      }
    }

    void load();
  }, [selectedProjectId, loadTasks]);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  const handleAddTask = async (title: string) => {
    if (!selectedProjectId) return;

    try {
      setIsAdding(true);
      setError(null);
      await createTask(title, selectedProjectId);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      setTogglingTaskId(id);
      setError(null);
      await updateTask(id, { completed });
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setDeletingTaskId(id);
      setError(null);
      await deleteTask(id);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-6">
      <div className="flex min-h-[calc(100vh-3rem)] w-full max-w-[1100px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        {error && (
          <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex min-h-0 flex-1">
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            isLoading={isLoadingProjects}
            onSelect={setSelectedProjectId}
          />
          <TaskList
            tasks={tasks}
            selectedProjectId={selectedProjectId}
            projectName={selectedProject?.name ?? "Project"}
            isLoading={isLoadingTasks}
            isAdding={isAdding}
            togglingTaskId={togglingTaskId}
            deletingTaskId={deletingTaskId}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}
