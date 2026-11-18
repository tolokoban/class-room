import { DemoContext } from "./context";
import { MemoryBackend } from "./db/backend";
import { DemoDatabase } from "./db/database";
import { getDemoHandler } from "./entrypoint";
import { DEMO_TEACHER } from "./teacher";

/**
 * A demo context on a memory database, for the unit tests.
 * `call()` goes through the same JSON round trip as `demoApi()`.
 */
export function makeTestContext(now = 1_700_000_000) {
  const ctx: DemoContext & { time: number } = {
    db: new DemoDatabase(new MemoryBackend()),
    user: DEMO_TEACHER,
    time: now,
    now: () => ctx.time,
  };
  const call = async (entrypoint: string, input: unknown = null): Promise<unknown> => {
    const handler = getDemoHandler(entrypoint);
    if (!handler) throw new Error(`Unknown entrypoint "${entrypoint}"!`);

    const output = await handler(JSON.parse(JSON.stringify(input)), ctx);
    return output === undefined ? null : JSON.parse(JSON.stringify(output));
  };
  return { ctx, call };
}
