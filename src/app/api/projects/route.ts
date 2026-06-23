import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, projects, tasks } from "@/lib/db";

export async function GET() {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      taskCount: count(tasks.id),
    })
    .from(projects)
    .leftJoin(tasks, eq(tasks.projectId, projects.id))
    .groupBy(projects.id);

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [project] = await db.insert(projects).values({ name }).returning();

  return NextResponse.json(
    { id: project.id, name: project.name, taskCount: 0 },
    { status: 201 }
  );
}
