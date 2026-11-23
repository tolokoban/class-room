import { getDemoUrl } from "../../urls";
import { makeTestContext } from "../../testing";
import get from "./get";

type Call = (entrypoint: string, input?: unknown) => Promise<unknown>;

/**
 * Upload `text` by chunks of 2 characters, as `fileUpload()` does.
 * @param target `{ classroomCode }` to add a file, or `{ fileId }` to replace one.
 * @returns The result of `file/upload-complete`, or the error of `file/upload-init`.
 */
async function upload(
  call: Call,
  target: { classroomCode: string } | { fileId: number },
  name: string,
  text: string,
  mime = "text/plain",
): Promise<unknown> {
  const init = await call("file/upload-init", { ...target, name, size: text.length, mime });
  if (typeof init === "number") return init;

  const { uploadId } = init as { uploadId: number };
  for (let offset = 0; offset < text.length; offset += 2) {
    const data = btoa(text.slice(offset, offset + 2));
    expect(await call("file/upload-chunk", { uploadId, offset, data })).toEqual({
      received: Math.min(text.length, offset + 2),
    });
  }
  return call("file/upload-complete", { uploadId });
}

async function setup() {
  const test = makeTestContext();
  await test.call("class/add", { code: "A", name: "Alpha" });
  return test;
}

describe("demo/file", () => {
  it("should add, list, replace, get and delete files", async () => {
    const { ctx, call } = await setup();
    const A = { classroomCode: "A" };
    expect(await upload(call, A, "dir/b.txt", "hello")).toEqual({ fileId: 1 });
    expect(await upload(call, A, "a.pdf", "x", "application/pdf")).toEqual({ fileId: 2 });
    expect(await upload(call, A, "B.TXT", "x")).toBe(-50805);
    expect(await upload(call, A, "Notes.md", "x")).toBe(-50806);
    expect(await upload(call, { classroomCode: "Z" }, "c.txt", "x")).toBe(-50802);
    expect(await call("file/upload-init", { ...A, name: "c.txt", mime: "text/plain" })).toBe(
      -50801,
    );
    expect(await call("file/upload-init", { ...A, fileId: 1, name: "c.txt", size: 1 })).toBe(
      -50801,
    );
    expect(await call("file/list", { classroomCode: "A" })).toEqual([
      { id: 2, name: "a.pdf", size: 1, mime: "application/pdf" },
      { id: 1, name: "b.txt", size: 5, mime: "text/plain" },
    ]);
    expect(getDemoUrl("api/file/get?fileId=1")).toMatch(/^blob:/);

    expect(await upload(call, { fileId: 1 }, "a.pdf", "x")).toBe(-50805);
    expect(await upload(call, { fileId: 1 }, "c.txt", "x", "image/png")).toBe(-50807);
    expect(await upload(call, { fileId: 9 }, "c.txt", "x")).toBe(-50803);
    expect(await upload(call, { fileId: 1 }, "c.txt", "bye")).toEqual({ fileId: 1 });
    expect(await call("file/list", { classroomCode: "A" })).toEqual([
      { id: 2, name: "a.pdf", size: 1, mime: "application/pdf" },
      { id: 1, name: "c.txt", size: 3, mime: "text/plain" },
    ]);
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
    expect(await upload(call, { fileId: 1 }, "x.md", "x", "text/markdown")).toBe(-50806);
  });

  it("should check the chunks and forget the abandoned uploads", async () => {
    const { ctx, call } = await setup();
    const init = (await call("file/upload-init", {
      classroomCode: "A",
      name: "big.bin",
      size: 4,
      mime: "",
    })) as { uploadId: number; chunkSize: number };
    expect(init).toEqual({ uploadId: 1, chunkSize: 1024 * 1024 });
    const { uploadId } = init;
    expect(await call("file/upload-chunk", { uploadId, offset: 2, data: btoa("ab") })).toBe(-50903);
    expect(await call("file/upload-chunk", { uploadId, offset: 0, data: btoa("abcde") })).toBe(
      -50903,
    );
    expect(await call("file/upload-chunk", { uploadId, offset: 0, data: "%%" })).toBe(-50901);
    expect(await call("file/upload-chunk", { uploadId: 9, offset: 0, data: btoa("a") })).toBe(
      -50902,
    );
    expect(await call("file/upload-chunk", { uploadId, offset: 0, data: btoa("ab") })).toEqual({
      received: 2,
    });
    expect(await call("file/upload-complete", { uploadId })).toBe(-51003);
    expect(await call("file/upload-init", { classroomCode: "A", name: "x", size: 1e9 })).toBe(
      -50808,
    );

    // Abandoned for more than an hour: deleted by the next `file/upload-init`.
    ctx.time += 3601;
    expect(await upload(call, { classroomCode: "A" }, "empty.txt", "")).toEqual({ fileId: 1 });
    expect(await call("file/upload-chunk", { uploadId, offset: 2, data: btoa("cd") })).toBe(-50902);
    expect(await ctx.db.getContent("file_upload", uploadId)).toBeUndefined();
    expect(await call("file/list", { classroomCode: "A" })).toEqual([
      { id: 1, name: "empty.txt", size: 0, mime: "text/plain" },
    ]);
  });
});
