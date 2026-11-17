import { describe, expect, it } from "vitest";

import { isAbsoluteUrl } from "./url";

describe("isAbsoluteUrl()", () => {
  it("should detect absolute URLs", () => {
    expect(isAbsoluteUrl("https://example.com")).toBe(true);
    expect(isAbsoluteUrl("HTTP://example.com")).toBe(true);
    expect(isAbsoluteUrl("mailto:someone@example.com")).toBe(true);
    expect(isAbsoluteUrl("//example.com/page")).toBe(true);
  });
  it("should detect relative URLs", () => {
    expect(isAbsoluteUrl("#/teacher")).toBe(false);
    expect(isAbsoluteUrl("#section")).toBe(false);
    expect(isAbsoluteUrl("/api/file")).toBe(false);
    expect(isAbsoluteUrl("doc/page.html")).toBe(false);
    expect(isAbsoluteUrl(undefined)).toBe(false);
  });
});
