import { describe, expect, it } from "vitest";

import { getStudentActivityPath } from "./activity";

describe("getStudentActivityPath()", () => {
  it("should accept a written production with an ID", () => {
    expect(getStudentActivityPath("3A", "written/12")).toBe("/student/3A/activity/written/12");
  });
  it("should accept a static activity", () => {
    expect(getStudentActivityPath("3A", "AI/RAG")).toBe("/student/3A/activity/AI/RAG");
  });
  it("should reject a route param that has not been replaced", () => {
    expect(getStudentActivityPath("3A", "written/[written]")).toBeNull();
  });
  it("should reject an unknown activity", () => {
    expect(getStudentActivityPath("3A", "does-not-exist")).toBeNull();
  });
});
