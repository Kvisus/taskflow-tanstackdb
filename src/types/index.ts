export type Project = {
  id: string;
  name: string;
  taskCount: number;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
};
