import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

import { queryClient } from "@/lib/query-client";

export type CollectionTask = {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
};

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.error === "string") return data.error;
  } catch {
    // ignore
  }
  return `Request failed (${response.status})`;
}

export const tasksCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["tasks"],
    queryClient,
    queryFn: async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error(await parseError(response));
      }
      return response.json() as Promise<CollectionTask[]>;
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map(async (mutation) => {
          const task = mutation.modified;
          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: task.title,
              projectId: task.projectId,
            }),
          });

          if (!response.ok) {
            throw new Error(await parseError(response));
          }
        })
      );
    },
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map(async (mutation) => {
          const response = await fetch(`/api/tasks/${mutation.key}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mutation.changes),
          });

          if (!response.ok) {
            throw new Error(await parseError(response));
          }
        })
      );
    },
    onDelete: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map(async (mutation) => {
          const response = await fetch(`/api/tasks/${mutation.key}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(await parseError(response));
          }
        })
      );
    },
  })
);
