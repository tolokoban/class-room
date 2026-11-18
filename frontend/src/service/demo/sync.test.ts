import FS from "node:fs";
import Path from "node:path";

import { DEMO_ENTRYPOINTS } from "./entrypoint";

/**
 * The demo mode must always be kept in sync with the real API:
 * every backend entrypoint must have a demo handler, and vice versa.
 */
const BACKEND = Path.resolve(import.meta.dirname, "../../../../backend/www/api/entrypoint");

function listBackendEntrypoints(): string[] {
  const entrypoints: string[] = [];
  for (const group of FS.readdirSync(BACKEND)) {
    const groupPath = Path.join(BACKEND, group);
    if (!FS.statSync(groupPath).isDirectory()) continue;

    for (const action of FS.readdirSync(groupPath)) {
      if (FS.existsSync(Path.join(groupPath, action, "index.php"))) {
        entrypoints.push(`${group}/${action}`);
      }
    }
  }
  return entrypoints.sort();
}

function listDemoEntrypoints(): string[] {
  return Object.entries(DEMO_ENTRYPOINTS)
    .flatMap(([group, handlers]) => Object.keys(handlers).map((action) => `${group}/${action}`))
    .sort();
}

describe("demo/sync", () => {
  it("should have a demo handler for each backend entrypoint", () => {
    expect(listDemoEntrypoints()).toEqual(listBackendEntrypoints());
  });
});
