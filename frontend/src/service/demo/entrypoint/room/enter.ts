import { DemoContext, field, isNonEmptyString } from "../../context";
import { ClassInfo, findClassByCode } from "../../lib/activity";
import { sameText } from "../../lib/class";

/**
 * Translation of `backend/www/api/entrypoint/room/enter/index.php`.
 */
export default async function roomEnter(input: unknown, ctx: DemoContext): Promise<unknown> {
  const classroomCode = field(input, "classroomCode");
  const computer = field(input, "computer");
  const nickname = field(input, "nickname");
  if (
    !isNonEmptyString(classroomCode) ||
    !isNonEmptyString(computer) ||
    !isNonEmptyString(nickname)
  ) {
    return -40101;
  }

  const found = await findClassByCode(ctx, classroomCode);
  if (found === false) return -40102;

  const name = nickname.trim();
  const seatError = await takeSeat(ctx, found, computer, name);
  if (seatError !== 0) return seatError;

  await ctx.db.put("room", { computer, nickname: name, classroom: found.id, time: ctx.now() });
  return 0;
}

/**
 * Reserve a seat in a class room for this computer, or update the nickname of its seat.
 * @returns 0 on success, or an error code of the entrypoint.
 */
async function takeSeat(
  ctx: DemoContext,
  found: ClassInfo,
  computer: string,
  nickname: string,
): Promise<number> {
  const seats = await ctx.db.where("seat", (seat) => seat.classroom === found.id);
  const owner = seats.find((seat) => sameText(seat.nickname, nickname));
  if (owner && owner.computer !== computer) return -40104;

  const mine = seats.find((seat) => seat.computer === computer);
  if (mine) {
    await ctx.db.put("seat", { ...mine, nickname, time: ctx.now() });
    return 0;
  }

  if (seats.length >= found.maxStudents) return -40105;

  await ctx.db.put("seat", { classroom: found.id, computer, nickname, time: ctx.now() });
  return 0;
}
