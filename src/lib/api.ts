import type { Project, Task } from "@/types";

type ApiProject = {
  id: number;
  name: string;
  taskCount: number;
};

type ApiTask = {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
};

function toProject(project: ApiProject): Project {
  return {
    id: String(project.id),
    name: project.name,
    taskCount: project.taskCount,
  };
}

function toTask(task: ApiTask): Task {
  return {
    id: String(task.id),
    title: task.title,
    completed: task.completed,
    projectId: String(task.projectId),
  };
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.error === "string") return data.error;
  } catch {
    // ignore
  }
  return `Request failed (${response.status})`;
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error(await parseError(response));
  const data: ApiProject[] = await response.json();
  return data.map(toProject);
}

export async function createProject(name: string): Promise<Project> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const data: ApiProject = await response.json();
  return toProject(data);
}

export async function updateProject(
  id: string,
  name: string
): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const data: ApiProject = await response.json();
  return toProject(data);
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await parseError(response));
}

export async function fetchTasks(projectId?: string): Promise<Task[]> {
  const url = projectId
    ? `/api/tasks?projectId=${encodeURIComponent(projectId)}`
    : "/api/tasks";
  const response = await fetch(url);
  if (!response.ok) throw new Error(await parseError(response));
  const data: ApiTask[] = await response.json();
  return data.map(toTask);
}

export async function createTask(
  title: string,
  projectId: string
): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, projectId }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const data: ApiTask = await response.json();
  return toTask(data);
}

export async function updateTask(
  id: string,
  updates: { title?: string; completed?: boolean }
): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const data: ApiTask = await response.json();
  return toTask(data);
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await parseError(response));
}
