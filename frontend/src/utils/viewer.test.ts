import { describe, expect, it } from "vitest";

import { getWrittenViewerKind } from "./viewer";

describe("getWrittenViewerKind()", () => {
  it("should display Markdown files with the Markdown viewer", () => {
    expect(getWrittenViewerKind({ mime: "text/markdown", original: "notes.md" })).toBe("markdown");
  });
  it("should recognize Markdown by the original extension", () => {
    expect(getWrittenViewerKind({ mime: "text/plain", original: "README.MD" })).toBe("markdown");
  });
  it("should display plain text files verbatim", () => {
    expect(getWrittenViewerKind({ mime: "text/plain", original: "prompt.txt" })).toBe("text");
  });
  it("should not display other files", () => {
    expect(getWrittenViewerKind({ mime: "text/html", original: "page.html" })).toBeNull();
    expect(getWrittenViewerKind({ mime: "application/pdf", original: "a.pdf" })).toBeNull();
  });
});
