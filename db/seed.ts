import "dotenv/config";
import { sql } from "drizzle-orm";

import { PROJECTS, TASKS } from "../src/data/dummy";
import { db } from "./index";
import { projects, tasks } from "./schema";

async function seed() {
  await db.delete(tasks);
  await db.delete(projects);

  await db.insert(projects).values(
    PROJECTS.map(({ id, name }) => ({
      id: Number(id),
      name,
    }))
  );

  await db.insert(tasks).values(
    TASKS.map(({ id, title, completed, projectId }) => ({
      id: Number(id),
      title,
      completed,
      projectId: Number(projectId),
    }))
  );

  await db.execute(
    sql.raw(
      `SELECT setval('projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM projects))`
    )
  );
  await db.execute(
    sql.raw(
      `SELECT setval('tasks_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tasks))`
    )
  );

  console.log("Seeded projects and tasks.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
