import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

import { queryClient } from "@/lib/query-client";

export type CollectionProject = {
  id: number;
  name: string;
  taskCount: number;
};

export const projectsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["projects"],
    queryClient,
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error(`Failed to fetch projects (${response.status})`);
      }
      return response.json() as Promise<CollectionProject[]>;
    },
    getKey: (item) => item.id,
  })
);
