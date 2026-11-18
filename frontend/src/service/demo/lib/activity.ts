import { DemoContext } from "../context";
import { sameText } from "./class";

/**
 * Translation of `backend/www/api/activity.php`.
 */

export interface ClassInfo {
  id: number;
  user: number;
  activity: string | null;
  maxStudents: number;
}

/**
 * Find a class room (table `class`) from its `code`.
 * @returns `false` if there is no class room with this code.
 */
export async function findClassByCode(ctx: DemoContext, code: string): Promise<ClassInfo | false> {
  const row = await ctx.db.findOne("class", (item) => sameText(item.code, code));
  if (!row) return false;

  return {
    id: row.id,
    user: row.user,
    activity: row.activity,
    maxStudents: row.max_students,
  };
}
