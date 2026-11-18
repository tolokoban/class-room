import { getDemoUrl } from "../../urls";
import { makeTestContext } from "../../testing";
import get from "./get";

function dataUrl(text: string, mime = "text/plain"): string {
  return `data:${mime};base64,${btoa(text)}`;
}

async function setup() {
  const test = makeTestContext();
  await test.call("class/add", { code: "A", name: "Alpha" });
  return test;
}

describe("demo/file", () => {
  it("should add, list, replace, get and delete files", async () => {
    const { ctx, call } = await setup();
    expect(
      await call("file/add", { classroomCode: "A", name: "dir/b.txt", file: dataUrl("hello") }),
    ).toEqual({
      fileId: 1,
    });
    expect(
      await call("file/add", {
        classroomCode: "A",
        name: "a.pdf",
        file: dataUrl("x", "application/pdf"),
      }),
    ).toEqual({
      fileId: 2,
    });
    expect(await call("file/add", { classroomCode: "A", name: "B.TXT", file: dataUrl("x") })).toBe(
      -50104,
    );
    expect(
      await call("file/add", { classroomCode: "A", name: "Notes.md", file: dataUrl("x") }),
    ).toBe(-50107);
    expect(await call("file/add", { classroomCode: "Z", name: "c.txt", file: dataUrl("x") })).toBe(
      -50102,
    );
    expect(
      await call("file/add", { classroomCode: "A", name: "c.txt", file: "not a data url" }),
    ).toBe(-50101);
    expect(await call("file/list", { classroomCode: "A" })).toEqual([
      { id: 2, name: "a.pdf", size: 1, mime: "application/pdf" },
      { id: 1, name: "b.txt", size: 5, mime: "text/plain" },
    ]);
    expect(getDemoUrl("api/file/get?fileId=1")).toMatch(/^blob:/);

    expect(await call("file/replace", { fileId: 1, name: "a.pdf", file: dataUrl("x") })).toBe(
      -50204,
    );
    expect(
      await call("file/replace", { fileId: 1, name: "c.txt", file: dataUrl("x", "image/png") }),
    ).toBe(-50205);
    expect(await call("file/replace", { fileId: 1, name: "c.txt", file: dataUrl("bye") })).toEqual({
      fileId: 1,
    });
    const blob = (await get({ fileId: "1" }, ctx)) as Blob;
    expect(blob.type).toBe("text/plain");
    expect(await blob.text()).toBe("bye");
    expect(await get({ fileId: 9 }, ctx)).toBe(-50502);
    expect(await get({ fileId: "x" }, ctx)).toBe(-50501);

    expect(await call("file/delete", { fileId: 1 })).toBe(true);
    expect(await call("file/delete", { fileId: 1 })).toBe(-50302);
    expect(getDemoUrl("api/file/get?fileId=1")).toBeUndefined();
    expect(await ctx.db.getContent("files", 1)).toBeUndefined();
  });

  it("should get and set the notes, hidden from the list", async () => {
    const { call } = await setup();
    expect(await call("file/notes-get", { classroomCode: "A" })).toBe("");
    expect(await call("file/notes-set", { classroomCode: "A", content: "# Été" })).toBe(0);
    expect(await call("file/notes-set", { classroomCode: "A", content: "# Hiver" })).toBe(0);
    expect(await call("file/notes-get", { classroomCode: "A" })).toBe("# Hiver");
    expect(await call("file/notes-set", { classroomCode: "A" })).toBe(-50701);
    expect(await call("file/list", { classroomCode: "A" })).toEqual([]);
    expect(
      await call("file/replace", { fileId: 1, name: "x.md", file: dataUrl("x", "text/markdown") }),
    ).toBe(-50208);
  });
});
