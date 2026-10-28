/**
 * Recreate the database from scratch:
 *
 * 1. Turn down the backend.
 * 2. Empty `backend/database/data/` (except `.gitkeep`).
 * 3. Start the backend: MariaDB finds an empty data dir and runs
 *    `structure.sql` then `data.sql` (see backend/docker-compose.yaml).
 *
 * The data files belong to the container's `mysql` user, so they are
 * deleted from inside a container: the host user is not allowed to.
 */
import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const BACKEND = resolve(ROOT, "backend")
const DATA = resolve(BACKEND, "database/data")

run("docker", ["compose", "down"], BACKEND)
run(
    "docker",
    [
        "run",
        "--rm",
        "-v",
        `${DATA}:/data`,
        "mariadb:11",
        "find",
        "/data",
        "-mindepth",
        "1",
        "!",
        "-name",
        ".gitkeep",
        "-delete",
    ],
    ROOT,
)
console.log("Database files deleted.")
run("node", [resolve(ROOT, "scripts/backend.mjs")], ROOT)

// ----------------------------------------------------------------------------

function run(cmd, args, cwd) {
    const result = spawnSync(cmd, args, { cwd, stdio: "inherit" })
    if (result.error) throw result.error
    if (result.status !== 0) process.exit(result.status ?? 1)
}
