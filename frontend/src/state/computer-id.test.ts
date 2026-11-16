import { describe, expect, it } from "vitest";

import { createComputerId, getComputerId, isComputerId } from "./computer-id";

describe("computer-id", () => {
  const ids = [createComputerId(), createComputerId(), createComputerId(), createComputerId()];

  it.each(ids)("should accept a freshly created id: %s", (id) => {
    expect(isComputerId(id)).toBe(true);
  });

  it.each(ids)("should reject an id with one changed char: %s", (id) => {
    const index = Math.floor(Math.random() * id.length);
    const char = id.charAt(index) === "0" ? "1" : "0";
    const altered = `${id.substring(0, index)}${char}${id.substring(index + 1)}`;
    expect(isComputerId(altered)).toBe(false);
  });

  it("should create the id only once and keep it in the storage", () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    };
    const id = getComputerId(storage);
    expect(isComputerId(id)).toBe(true);
    expect(getComputerId(storage)).toBe(id);
  });

  it("should replace an invalid stored id", () => {
    const data = new Map<string, string>([["computer-id", "invalid"]]);
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    };
    const id = getComputerId(storage);
    expect(isComputerId(id)).toBe(true);
    expect(data.get("computer-id")).toBe(id);
  });
});
