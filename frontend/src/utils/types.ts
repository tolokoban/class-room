import React from "react";

/**
 * Runtime type-guard for `React.ReactNode`.
 * Covers primitives, valid elements, portals, thenables (async components)
 * and iterables (arrays, fragments...).
 */
export function isReactNode(value: unknown): value is React.ReactNode {
  if (value === null || value === undefined) return true;

  const type = typeof value;
  if (type === "string" || type === "number" || type === "boolean" || type === "bigint") return true;
  if (type !== "object") return false;

  if (React.isValidElement(value)) return true;
  if (typeof (value as { $$typeof?: unknown }).$$typeof === "symbol") return true;
  if (typeof (value as { then?: unknown }).then === "function") return true;
  if (Symbol.iterator in (value as object)) return true;

  return false;
}
