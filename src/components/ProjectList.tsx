"use client";

import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectListProps = {
  projects: Project[];
  selectedProjectId: string;
  isLoading: boolean;
  onSelect: (projectId: string) => void;
};

export function ProjectList({
  projects,
  selectedProjectId,
  isLoading,
  onSelect,
}: ProjectListProps) {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-5">
        <h2 className="text-sm font-semibold tracking-wide text-foreground">
          Projects
        </h2>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {isLoading ? (
          <div className="flex items-center justify-center px-3 py-8 text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading...
          </div>
        ) : (
          projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelect(project.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className="truncate font-medium">{project.name}</span>
                <Badge variant={isSelected ? "default" : "secondary"}>
                  {project.taskCount}
                </Badge>
              </button>
            );
          })
        )}
      </nav>
    </aside>
  );
}
