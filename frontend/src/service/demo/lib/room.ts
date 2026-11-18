import { DemoContext } from "../context";
import { ClassInfo, findClassByCode } from "./activity";

/**
 * Translation of `findOwnedClass()` from `backend/www/api/written.php`.
 * @returns The class room, or "missing" if it does not exist,
 * or "forbidden" if the current user does not own it.
 */
export async function findOwnedClass(
  ctx: DemoContext,
  classroomCode: string,
): Promise<ClassInfo | "missing" | "forbidden"> {
  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return "missing";
  if (found.user !== ctx.user.id) return "forbidden";

  return found;
}
