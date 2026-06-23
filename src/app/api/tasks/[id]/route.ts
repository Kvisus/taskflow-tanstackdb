import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, tasks } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseTaskId(id: string) {
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId <= 0) return null;
  return taskId;
}

export async function PATCH(request: Request, context: RouteContext) {
  const taskId = parseTaskId((await context.params).id);
  if (!taskId) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }

  const body = await request.json();
  const updates: { title?: string; completed?: boolean } = {};

  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    updates.title = title;
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      return NextResponse.json(
        { error: "Completed must be a boolean" },
        { status: 400 }
      );
    }
    updates.completed = body.completed;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const [updated] = await db
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const taskId = parseTaskId((await context.params).id);
  if (!taskId) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }

  const [deleted] = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
