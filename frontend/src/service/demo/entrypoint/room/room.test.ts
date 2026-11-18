import { makeTestContext } from "../../testing";

async function setup() {
  const test = makeTestContext();
  await test.call("class/add", { code: "C1", name: "Class 1", maxStudents: 2 });
  return test;
}

describe("demo/room", () => {
  it("should give seats to the students", async () => {
    const { ctx, call } = await setup();
    expect(
      await call("room/enter", { classroomCode: "C1", computer: "c1", nickname: " Bob " }),
    ).toBe(0);
    expect(await call("room/enter", { classroomCode: "C1", computer: "c2", nickname: "bob" })).toBe(
      -40104,
    );
    expect(await call("room/enter", { classroomCode: "C1", computer: "c2", nickname: "Al" })).toBe(
      0,
    );
    expect(await call("room/enter", { classroomCode: "C1", computer: "c3", nickname: "Zoe" })).toBe(
      -40105,
    );
    expect(await call("room/enter", { classroomCode: "X", computer: "c3", nickname: "Zoe" })).toBe(
      -40102,
    );
    expect(await call("room/enter", { classroomCode: "C1", computer: "c3" })).toBe(-40101);
    // Changing the nickname keeps the same seat.
    expect(
      await call("room/enter", { classroomCode: "C1", computer: "c2", nickname: "Alice" }),
    ).toBe(0);
    expect(await call("room/check", { classroomCode: "C1", computer: "c1" })).toBe(true);
    expect(await call("room/check", { classroomCode: "C1", computer: "c3" })).toBe(false);
    expect(await call("room/students", { classroomCode: "C1" })).toEqual(["Alice", "Bob"]);
    ctx.time += 10;
    expect(await call("room/seats", { classroomCode: "C1" })).toEqual({
      maxStudents: 2,
      now: ctx.time,
      seats: [
        { nickname: "Alice", time: ctx.time - 10, uploads: 0 },
        { nickname: "Bob", time: ctx.time - 10, uploads: 0 },
      ],
    });
    expect(await call("room/kick", { classroomCode: "C1", nickname: "BOB" })).toBe(1);
    expect(await call("room/check", { classroomCode: "C1", computer: "c1" })).toBe(false);
    expect(await call("room/kick", { classroomCode: "C1" })).toBe(1);
    expect(await call("room/kick", { classroomCode: "X" })).toBe(-40502);
    expect(await call("room/seats", { classroomCode: "X" })).toBe(-40402);
  });

  it("should count the complete uploads of each seat", async () => {
    const { ctx, call } = await setup();
    await call("room/enter", { classroomCode: "C1", computer: "c1", nickname: "Bob" });
    const assignment = await ctx.db.insert("written_assignment", {
      written: 1,
      classroom: 1,
      end_time: null,
      remaining: null,
      extension: 0,
      expires_at: null,
      position: 0,
    });
    const upload = {
      assignment,
      computer: "c1",
      nickname: "Bob",
      slot: "s",
      original: "a.txt",
      mime: "text/plain",
      ext: "txt",
      size: 1,
      received: 1,
      late: 0,
      time: 0,
    };
    await ctx.db.insert("written_upload", { ...upload, complete: 1 });
    await ctx.db.insert("written_upload", { ...upload, complete: 0 });
    const seats = (await call("room/seats", { classroomCode: "C1" })) as {
      seats: Array<{ uploads: number }>;
    };
    expect(seats.seats[0].uploads).toBe(1);
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
    expect(await call("room/students", { classroomCode: "OTHER" })).toBe(-40203);
    expect(await call("room/seats", { classroomCode: "OTHER" })).toBe(-40403);
    expect(await call("room/kick", { classroomCode: "OTHER" })).toBe(-40503);
  });
});
