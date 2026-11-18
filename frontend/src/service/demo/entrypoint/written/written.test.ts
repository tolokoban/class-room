import { getDemoHandler } from "../index";
import { makeTestContext } from "../../testing";
import { getDemoUrl } from "../../urls";

const DEFINITION = {
  name: "Essay",
  description: "Write an essay.",
  duration: 30,
  expiration: 24,
  files: [{ name: "essay", mimeTypes: ["text/plain"], maxSize: 1000 }],
};

function toBase64(text: string): string {
  return btoa(text);
}

async function setup() {
  const test = makeTestContext();
  const { ctx, call } = test;
  const classroom = Number(await call("class/add", { code: "C1", name: "Class 1" }));
  const writtenId = Number(await call("written/add", DEFINITION));
  await ctx.db.put("seat", { classroom, computer: "pc-1", nickname: "Alice", time: 0 });
  return { ...test, classroom, writtenId };
}

/** Call a link-only handler: no JSON round trip, the result can be a Blob. */
async function callRaw(
  ctx: ReturnType<typeof makeTestContext>["ctx"],
  name: string,
  input: unknown,
) {
  const handler = getDemoHandler(name);
  if (!handler) throw new Error(`Unknown ${name}`);
  return handler(input, ctx);
}

async function upload(
  call: (name: string, input?: unknown) => Promise<unknown>,
  writtenId: number,
  text: string,
) {
  const init = (await call("written/upload-init", {
    writtenId,
    classroomCode: "C1",
    computer: "pc-1",
    slot: "essay",
    name: "my-essay.txt",
    size: text.length,
    mime: "text/plain",
  })) as { uploadId: number; chunkSize: number };
  expect(init.chunkSize).toBe(1024 * 1024);
  const half = Math.floor(text.length / 2);
  expect(
    await call("written/upload-chunk", {
      uploadId: init.uploadId,
      computer: "pc-1",
      offset: 0,
      data: toBase64(text.slice(0, half)),
    }),
  ).toEqual({ received: half });
  await call("written/upload-chunk", {
    uploadId: init.uploadId,
    computer: "pc-1",
    offset: half,
    data: toBase64(text.slice(half)),
  });
  return {
    init,
    complete: await call("written/upload-complete", { uploadId: init.uploadId, computer: "pc-1" }),
  };
}

describe("demo/written", () => {
  it("should add, assign, start the timer and give the state", async () => {
    const { ctx, call, writtenId } = await setup();
    expect(writtenId).toBe(1);
    expect(await call("written/add", DEFINITION)).toBe(-60202);
    expect(await call("written/add", { ...DEFINITION, files: [] })).toBe(-60201);
    expect(await call("written/assign", { writtenId, classroomCode: "C1" })).toBe(0);
    expect(await call("written/assign", { writtenId, classroomCode: "C1" })).toBe(-60506);
    expect(await call("written/assign", { writtenId, classroomCode: "XX" })).toBe(-60502);

    const list = (await call("written/list")) as Array<{ classrooms: string[]; uploads: object }>;
    expect(list[0].classrooms).toEqual(["C1"]);
    expect(list[0].uploads).toEqual({});

    expect(
      await call("written/upload-init", {
        writtenId,
        classroomCode: "C1",
        computer: "pc-1",
        slot: "essay",
        name: "a.txt",
        size: 3,
        mime: "text/plain",
      }),
    ).toBe(-61405);

    const timer = await call("written/timer", { writtenId, classroomCode: "C1", action: "start" });
    expect(timer).toEqual({
      state: "running",
      endTime: ctx.time + 30 * 60,
      remaining: null,
      expiresAt: ctx.time + 30 * 60 + 24 * 3600,
    });
    expect(await call("written/timer", { writtenId, classroomCode: "C1", action: "start" })).toBe(
      -60807,
    );
    ctx.time += 60;
    expect(
      await call("written/timer", { writtenId, classroomCode: "C1", action: "pause" }),
    ).toMatchObject({ state: "paused", remaining: 29 * 60 });

    const state = (await call("written/state", {
      writtenId,
      classroomCode: "C1",
      computer: "pc-1",
    })) as Record<string, unknown>;
    expect(state).toMatchObject({ id: writtenId, preview: true, seated: true, uploads: [] });

    const classroom = (await call("written/classroom", { classroomCode: "C1" })) as {
      items: unknown[];
    };
    expect(classroom.items).toEqual([
      { id: writtenId, name: "Essay", timer: expect.anything(), count: 0, size: 0 },
    ]);
  });

  it("should upload a file by chunks, list it in the results and zip it", async () => {
    const { ctx, call, writtenId } = await setup();
    await call("written/assign", { writtenId, classroomCode: "C1" });
    await call("written/timer", { writtenId, classroomCode: "C1", action: "start" });

    const { init, complete } = await upload(call, writtenId, "Hello world!");
    expect(complete).toMatchObject({
      slot: "essay",
      original: "my-essay.txt",
      size: 12,
      late: false,
    });

    const results = (await call("written/results", { writtenId, classroomCode: "C1" })) as {
      uploads: Array<{ id: number; nickname: string; hash: string; downloadName: string }>;
    };
    expect(results.uploads).toHaveLength(1);
    const item = results.uploads[0];
    expect(item.id).toBe(init.uploadId);
    expect(item.hash).toMatch(/^[0-9a-f]{6}$/);
    expect(item.downloadName).toBe(`Alice.essay.${item.hash}.txt`);
    expect(getDemoUrl(`api/written/download?uploadId=${item.id}`)).toMatch(/^blob:/);
    expect(getDemoUrl(`api/written/zip?writtenId=${writtenId}&classroomCode=C1`)).toMatch(/^blob:/);

    const blob = (await callRaw(ctx, "written/download", { uploadId: String(item.id) })) as Blob;
    expect(await blob.text()).toBe("Hello world!");

    const zip = (await callRaw(ctx, "written/zip", {
      writtenId: String(writtenId),
      classroomCode: "C1",
    })) as Blob;
    const bytes = new Uint8Array(await zip.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain(item.downloadName);
    expect(text).toContain("Hello world!");

    // A new upload replaces the previous one.
    await upload(call, writtenId, "Second version");
    const list = (await call("written/list")) as Array<{ uploads: Record<string, number> }>;
    expect(list[0].uploads).toEqual({ essay: 1 });

    expect(
      await call("written/upload-delete", {
        writtenId,
        classroomCode: "C1",
        computer: "pc-1",
        slot: "essay",
      }),
    ).toBe(1);
    expect(await ctx.db.all("written_upload")).toEqual([]);
  });

  it("should delete the expired uploads", async () => {
    const { ctx, call, writtenId } = await setup();
    await call("written/assign", { writtenId, classroomCode: "C1" });
    await call("written/timer", { writtenId, classroomCode: "C1", action: "start" });
    await upload(call, writtenId, "abc");
    ctx.time += 30 * 60 + 24 * 3600;
    const classroom = (await call("written/classroom", { classroomCode: "C1" })) as {
      items: Array<{ count: number }>;
    };
    expect(classroom.items[0].count).toBe(0);
  });

  it("should attach a file to a written production", async () => {
    const { ctx, call, writtenId } = await setup();
    await call("written/assign", { writtenId, classroomCode: "C1" });
    const init = (await call("written/attachment-init", {
      writtenId,
      name: "notes.md",
      size: 5,
      mime: "",
    })) as { attachmentId: number };
    await call("written/attachment-chunk", {
      attachmentId: init.attachmentId,
      offset: 0,
      data: toBase64("# Hi!"),
    });
    expect(await call("written/attachment-complete", { attachmentId: init.attachmentId })).toEqual({
      id: init.attachmentId,
      name: "notes.md",
      mime: "text/markdown",
      size: 5,
    });
    expect(getDemoUrl(`api/written/attachment-get?attachmentId=${init.attachmentId}`)).toMatch(
      /^blob:/,
    );

    await call("written/state", { writtenId, classroomCode: "C1" });
    expect(
      getDemoUrl(`api/written/attachment-get?attachmentId=${init.attachmentId}&classroomCode=C1`),
    ).toMatch(/^blob:/);

    const blob = (await callRaw(ctx, "written/attachment-get", {
      attachmentId: String(init.attachmentId),
    })) as Blob;
    expect(await blob.text()).toBe("# Hi!");

    expect(await call("written/attachment-delete", { attachmentId: init.attachmentId })).toBe(0);
    expect(
      getDemoUrl(`api/written/attachment-get?attachmentId=${init.attachmentId}`),
    ).toBeUndefined();
    expect(await call("written/attachment-delete", { attachmentId: init.attachmentId })).toBe(
      -62202,
    );
  });

  it("should update, reorder, unassign and delete", async () => {
    const { ctx, call, writtenId } = await setup();
    const other = Number(await call("written/add", { ...DEFINITION, name: "Other" }));
    await call("written/assign", { writtenId, classroomCode: "C1" });
    await call("written/assign", { writtenId: other, classroomCode: "C1" });
    expect(
      await call("written/reorder", { classroomCode: "C1", writtenIds: [other, writtenId] }),
    ).toBe(0);
    expect(await call("written/reorder", { classroomCode: "C1", writtenIds: [other] })).toBe(
      -61804,
    );
    const classroom = (await call("written/classroom", { classroomCode: "C1" })) as {
      items: Array<{ id: number }>;
    };
    expect(classroom.items.map((item) => item.id)).toEqual([other, writtenId]);

    await call("written/timer", { writtenId, classroomCode: "C1", action: "start" });
    await upload(call, writtenId, "abc");
    expect(
      await call("written/update", {
        ...DEFINITION,
        id: writtenId,
        files: [{ name: "report", mimeTypes: [], maxSize: 10 }],
      }),
    ).toEqual({ deleted: 1 });
    expect(await call("written/update", { ...DEFINITION, id: writtenId, name: "Other" })).toBe(
      -60304,
    );

    await ctx.db.update("class", 1, { activity: `written/${other}` });
    expect(await call("written/unassign", { writtenId: other, classroomCode: "C1" })).toBe(0);
    expect((await ctx.db.get("class", 1))?.activity).toBeNull();
    expect(await call("written/delete", { id: writtenId })).toBe(0);
    expect(await ctx.db.all("written_assignment")).toEqual([]);
    expect(await call("written/delete", { id: writtenId })).toBe(-60402);
  });
});
