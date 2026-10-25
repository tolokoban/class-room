/**
 * Start the backend (Apache + PHP, MariaDB and phpMyAdmin) in Docker:
 *
 * 1. Turn down any instance already running.
 * 2. Pick a random free port for the webserver.
 * 3. Start `docker compose up --build` with this port.
 * 4. Open a browser on it as soon as the webserver answers.
 */
import { spawn, spawnSync } from "node:child_process"
import { createServer } from "node:net"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const BACKEND = resolve(dirname(fileURLToPath(import.meta.url)), "../backend")

spawnSync("docker", ["compose", "down"], { cwd: BACKEND, stdio: "inherit" })

const port = await findFreePort()
const url = `http://localhost:${port}`
console.log(`Webserver:  ${url}/`)
console.log(`phpMyAdmin: ${url}/phpMyAdmin/`)

const compose = spawn("docker", ["compose", "up", "--build"], {
    cwd: BACKEND,
    stdio: "inherit",
    env: { ...process.env, WEB_PORT: `${port}` },
})
compose.on("exit", (code) => process.exit(code ?? 0))
// Ctrl+C is also received by `docker compose`, which stops the containers itself.
process.on("SIGINT", () => {})

await waitForServer(url)
console.log(`Opening ${url}/ ...`)
openBrowser(`${url}/`)

// ----------------------------------------------------------------------------

/**
 * Let the OS give us a random free port.
 */
function findFreePort() {
    return new Promise((resolvePort, reject) => {
        const server = createServer()
        server.unref()
        server.on("error", reject)
        server.listen(0, () => {
            const { port } = server.address()
            server.close(() => resolvePort(port))
        })
    })
}

async function waitForServer(url) {
    for (;;) {
        try {
            await fetch(url)
            return
        } catch {
            await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 500))
        }
    }
}

/**
 * Open the default browser, or Firefox if it fails.
 */
function openBrowser(url) {
    const commands = {
        darwin: [
            ["open", [url]],
            ["open", ["-a", "Firefox", url]],
        ],
        win32: [
            ["cmd", ["/c", "start", "", url]],
            ["cmd", ["/c", "start", "firefox", url]],
        ],
    }[process.platform] ?? [
        ["xdg-open", [url]],
        ["firefox", [url]],
    ]
    for (const [cmd, args] of commands) {
        const result = spawnSync(cmd, args, { stdio: "ignore" })
        if (!result.error && result.status === 0) return
    }
    console.error(`Unable to open a browser. Please go to ${url}`)
}
