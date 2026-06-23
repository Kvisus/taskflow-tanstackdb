import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, projects, tasks } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectIdParam = searchParams.get("projectId");

  if (projectIdParam) {
    const projectId = Number(projectIdParam);
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId));

    return NextResponse.json(rows);
  }

  const rows = await db.select().from(tasks);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const projectId = Number(body.projectId);

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const [task] = await db
    .insert(tasks)
    .values({ title, projectId })
    .returning();

  return NextResponse.json(task, { status: 201 });
}
