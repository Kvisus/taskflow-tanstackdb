"use client";

import { useState } from "react";
import { useLiveQuery } from "@tanstack/react-db";

import { projectsCollection } from "@/collections/projectsCollection";
import { tasksCollection } from "@/collections/tasksCollection";
import { ProjectList } from "@/components/ProjectList";
import { TaskList } from "@/components/TaskList";

export function HomeClient() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const { data: projects = [] } = useLiveQuery(
    (q) =>
      q.from({ project: projectsCollection }).select(({ project }) => ({
        id: project.id,
        name: project.name,
      })),
    []
  );

  const { data: allTasks = [] } = useLiveQuery(
    (q) =>
      q.from({ task: tasksCollection }).select(({ task }) => ({
        id: task.id,
        projectId: task.projectId,
      })),
    []
  );

  const projectsWithCounts = projects.map((project) => ({
    ...project,
    taskCount: allTasks.filter((task) => task.projectId === project.id).length,
  }));

  const activeProjectId = selectedProjectId ?? projectsWithCounts[0]?.id ?? null;
  const selectedProject = projectsWithCounts.find(
    (project) => project.id === activeProjectId
  );

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-6">
      <div className="flex min-h-[calc(100vh-3rem)] w-full max-w-[1100px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <ProjectList
          projects={projectsWithCounts}
          selectedProjectId={activeProjectId}
          onSelect={setSelectedProjectId}
        />
        <TaskList
          selectedProjectId={activeProjectId}
          projectName={selectedProject?.name ?? "Project"}
        />
      </div>
    </div>
  );
}
