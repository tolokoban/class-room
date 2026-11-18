import { DemoContext } from "../context";

/**
 * Translation of `backend/www/api/class.php`.
 */

/**
 * Check if a class `code` is already used by another class room.
 * @param exceptId ID of a class to ignore (the one being updated).
 */
export async function isClassCodeUsed(
  ctx: DemoContext,
  code: string,
  exceptId: number | null = null,
): Promise<boolean> {
  const row = await ctx.db.findOne(
    "class",
    (item) => sameText(item.code, code) && item.id !== (exceptId ?? 0),
  );
  return row !== undefined;
}

/**
 * MySQL compares strings without case sensitivity (default collation).
 */
export function sameText(a: string, b: string): boolean {
  return a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;
}

/**
 * `ORDER BY` of MySQL (case insensitive).
 */
export function compareText(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "accent" });
}
