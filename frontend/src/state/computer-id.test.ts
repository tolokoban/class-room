import { describe, expect, it } from "vitest";

import { createComputerId, isComputerId } from "./computer-id";

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
});
