import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, projects, tasks } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseProjectId(id: string) {
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) return null;
  return projectId;
}

async function getProjectWithCount(projectId: number) {
  const [row] = await db
    .select({
      id: projects.id,
      name: projects.name,
      taskCount: count(tasks.id),
    })
    .from(projects)
    .leftJoin(tasks, eq(tasks.projectId, projects.id))
    .where(eq(projects.id, projectId))
    .groupBy(projects.id);

  return row ?? null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const projectId = parseProjectId((await context.params).id);
  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [updated] = await db
    .update(projects)
    .set({ name })
    .where(eq(projects.id, projectId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const project = await getProjectWithCount(projectId);
  return NextResponse.json(project);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const projectId = parseProjectId((await context.params).id);
  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const [deleted] = await db
    .delete(projects)
    .where(eq(projects.id, projectId))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
