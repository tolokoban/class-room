import { makeTestContext } from "../../testing";

describe("demo/class", () => {
  it("should add, list, update and delete class rooms", async () => {
    const { call } = makeTestContext();
    const id = await call("class/add", { code: "B", name: "beta", description: "" });
    expect(id).toBe(1);
    expect(await call("class/add", { code: "A", name: "Alpha", maxStudents: 12 })).toBe(2);
    expect(await call("class/add", { code: "a", name: "Other" })).toBe(-20102);
    expect(await call("class/add", { code: " ", name: "Other" })).toBe(-20101);
    expect(await call("class/list")).toEqual([
      { id: 2, code: "A", name: "Alpha", description: "", maxStudents: 12 },
      { id: 1, code: "B", name: "beta", description: "", maxStudents: 24 },
    ]);
    expect(await call("class/update", { id: 1, code: "A" })).toBe(-20304);
    expect(await call("class/update", { id: 9, name: "X" })).toBe(-20302);
    expect(await call("class/update", { id: 1, name: " Gamma ", maxStudents: 5 })).toBe(0);
    expect(await call("class/delete", { id: 2 })).toBe(0);
    expect(await call("class/delete", { id: 2 })).toBe(-20402);
    expect(await call("class/list")).toEqual([
      { id: 1, code: "B", name: "Gamma", description: "", maxStudents: 5 },
    ]);
  });

  it("should delete by cascade the rows referencing a class room", async () => {
    const { ctx, call } = makeTestContext();
    const classroom = Number(await call("class/add", { code: "A", name: "Alpha" }));
    const fileId = await ctx.db.insert("files", {
      classroom,
      name: "a.txt",
      size: 1,
      mime: "text/plain",
    });
    await ctx.db.setContent("files", fileId, new Blob(["a"]));
    await ctx.db.put("seat", { classroom, computer: "c1", nickname: "Bob", time: 0 });
    await call("class/delete", { id: classroom });
    expect(await ctx.db.all("files")).toEqual([]);
    expect(await ctx.db.all("seat")).toEqual([]);
    expect(await ctx.db.getContent("files", fileId)).toBeUndefined();
  });
});
