import type { Project, Task } from "@/types";

export const PROJECTS: Project[] = [
  { id: "1", name: "Work", taskCount: 3 },
  { id: "2", name: "Personal", taskCount: 2 },
  { id: "3", name: "Shopping", taskCount: 1 },
];

export const TASKS: Task[] = [
  { id: "1", title: "Review pull request", completed: false, projectId: "1" },
  { id: "2", title: "Update documentation", completed: true, projectId: "1" },
  { id: "3", title: "Team standup notes", completed: false, projectId: "1" },
  { id: "4", title: "Morning workout", completed: false, projectId: "2" },
  { id: "5", title: "Read for 30 minutes", completed: true, projectId: "2" },
  { id: "6", title: "Buy groceries", completed: false, projectId: "3" },
];
