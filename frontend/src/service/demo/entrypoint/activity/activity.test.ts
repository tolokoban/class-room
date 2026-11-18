import { makeTestContext } from "../../testing";

async function setup() {
  const test = makeTestContext();
  await test.call("class/add", { code: "C1", name: "Class 1" });
  return test;
}

describe("demo/activity", () => {
  it("should set and get the current activity", async () => {
    const { call } = await setup();
    expect(await call("activity/current", { classroomCode: "C1" })).toBeNull();
    expect(await call("activity/current", { classroomCode: "X" })).toBe(-30402);
    expect(await call("activity/current", {})).toBe(-30401);
    expect(
      await call("activity/current-set", { classroomCode: "C1", activityCode: "AI/eliza" }),
    ).toBe(0);
    expect(await call("activity/current-set", { classroomCode: "C1", activityCode: "a b" })).toBe(
      -30501,
    );
    expect(await call("activity/current-set", { classroomCode: "X", activityCode: "a" })).toBe(
      -30502,
    );
    expect(await call("activity/current", { classroomCode: "c1" })).toBe("AI/eliza");
    expect(await call("activity/current-set", { classroomCode: "C1", activityCode: null })).toBe(0);
    expect(await call("activity/current", { classroomCode: "C1" })).toBeNull();
  });

  it("should store, read, list and clear results", async () => {
    const { call } = await setup();
    const base = { classroomCode: "C1", activityCode: "quiz" };
    expect(
      await call("activity/result-get", { ...base, computer: "c1", nickname: "Bob" }),
    ).toBeNull();
    expect(
      await call("activity/result-set", {
        ...base,
        computer: "c1",
        nickname: " Bob ",
        result: "1",
      }),
    ).toBe(0);
    expect(
      await call("activity/result-set", { ...base, computer: "c2", nickname: "bob", result: "2" }),
    ).toBe(-30103);
    expect(
      await call("activity/result-set", { ...base, computer: "c2", nickname: "Al", result: "2" }),
    ).toBe(0);
    expect(
      await call("activity/result-set", { ...base, computer: "c1", nickname: "Bob", result: "3" }),
    ).toBe(0);
    expect(await call("activity/result-set", { ...base, computer: "c1", nickname: "Bob" })).toBe(
      -30101,
    );
    expect(await call("activity/result-get", { ...base, computer: "c1", nickname: "Bob" })).toBe(
      "3",
    );
    expect(await call("activity/result-get", { ...base, computer: "c9", nickname: "Bob" })).toBe(
      -30603,
    );
    expect(await call("activity/result-all", base)).toEqual({ Al: "2", Bob: "3" });
    expect(await call("activity/result-all", { ...base, classroomCode: "X" })).toBe(-30202);
    expect(await call("activity/clear", { classroomCode: "C1", activityCode: "other" })).toBe(0);
    expect(await call("activity/result-all", base)).toEqual({ Al: "2", Bob: "3" });
    expect(await call("activity/clear", { classroomCode: "C1" })).toBe(0);
    expect(await call("activity/result-all", base)).toEqual({});
    expect(await call("activity/clear", { classroomCode: "C1", activityCode: " " })).toBe(-30301);
  });

  it("should refuse a class room of another teacher", async () => {
    const { ctx, call } = await setup();
    await ctx.db.insert("class", {
      user: 99,
      code: "OTHER",
      name: "Other",
      description: "",
      activity: null,
      max_students: 24,
    });
    expect(await call("activity/current-set", { classroomCode: "OTHER", activityCode: "a" })).toBe(
      -30503,
    );
    expect(await call("activity/result-all", { classroomCode: "OTHER", activityCode: "a" })).toBe(
      -30203,
    );
    expect(await call("activity/clear", { classroomCode: "OTHER" })).toBe(-30303);
  });
});
