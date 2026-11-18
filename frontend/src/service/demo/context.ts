import type { Teacher } from "@/state";

import { DemoDatabase } from "./db/database";

/**
 * What a demo handler can access, replacing the PHP globals
 * (`$DB`, `$_SESSION["USER"]`, `time()`).
 */
export interface DemoContext {
  db: DemoDatabase;
  /** `$_SESSION["USER"]`: always the "Demo Teacher". */
  user: Teacher;
  /** `time()`: current UNIX timestamp in seconds. */
  now(): number;
}

/**
 * Translation of a PHP entrypoint `function entrypoint($input)`.
 * Like the PHP version, it must check `input` first, and return a negative
 * error code (the same as the backend) when something goes wrong.
 */
export type DemoHandler = (input: unknown, ctx: DemoContext) => Promise<unknown>;

/**
 * `$input[key] ?? null` in PHP.
 */
export function field(input: unknown, key: string): unknown {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return null;

  return (input as Record<string, unknown>)[key] ?? null;
}

/** `array_key_exists(key, $input)` in PHP. */
export function hasField(input: unknown, key: string): boolean {
  return typeof input === "object" && input !== null && key in input;
}

/** `is_int()` in PHP. */
export function isInt(value: unknown): value is number {
  return Number.isInteger(value);
}

/** `is_string($value) && trim($value) !== ""` in PHP (see `isNonEmptyString()`). */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}
