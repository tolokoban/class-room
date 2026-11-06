/**
 * Deploy the application on the production server:
 *
 * 1. Build the frontend in production mode (output goes to `backend/www`).
 * 2. Upload every file of `backend/www` with SFTP, except `api/env.php`
 *    which holds the production secrets and must never be overwritten,
 *    and the files uploaded by the teachers in `files/` (but its `.htaccess`).
 *    `backend/database/sql/{structure,data}.sql` are uploaded in `api/sql/`.
 *    Each file `foo.css` comes with a `foo.css.hash` holding the SHA-1 of its
 *    content. A file is uploaded only if its hash file is missing on the
 *    server or holds a different hash.
 * 3. Print each uploaded file, the progress and the estimated remaining time.
 *
 * The SFTP password is read from `DEPLOY_PASSWORD` in the `.env` file at the
 * root of the repository. If it is missing or wrong, it is asked to the user
 * and stored in `.env` once the connection succeeds.
 * The remote folder can be set with `DEPLOY_REMOTE_DIR` (default: "classroom").
 */
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import FS from "node:fs"
import { dirname, posix, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import SftpClient from "ssh2-sftp-client"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const FRONTEND = resolve(ROOT, "frontend")
const WWW = resolve(ROOT, "backend/www")
const SQL = resolve(ROOT, "backend/database/sql")
const ENV_FILE = resolve(ROOT, ".env")
const HOST = "home405998676.1and1-data.host"
const USER = "u68074545"
const PORT = 22
// Paths relative to `backend/www` that must never be uploaded.
const EXCLUDED = new Set(["api/env.php"])
// The files uploaded by the teachers live on the server: only their `.htaccess` is uploaded.
const isExcluded = (path) => EXCLUDED.has(path) || (path.startsWith("files/") && path !== "files/.htaccess")

build()
const files = [...listFiles(WWW).filter((file) => !isExcluded(file.path)), ...listSqlFiles()]
const env = readEnv()
const remoteDir = env.DEPLOY_REMOTE_DIR ?? "classroom"
const sftp = await connect(env)
try {
    await upload(sftp, files, remoteDir)
} finally {
    await sftp.end()
}

// ----------------------------------------------------------------------------

function build() {
    console.log("Building the frontend in production mode...")
    const result = spawnSync("npm", ["run", "build"], {
        cwd: FRONTEND,
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "production" },
    })
    if (result.status !== 0) {
        console.error("The build failed: nothing has been deployed.")
        process.exit(result.status ?? 1)
    }
}

/**
 * @returns {{ path: string, local: string, size: number, hash: string }[]}
 */
function listFiles(dir) {
    const files = []
    for (const entry of FS.readdirSync(dir, { recursive: true, withFileTypes: true })) {
        if (!entry.isFile()) continue
        const local = resolve(entry.parentPath, entry.name)
        files.push({ path: relative(WWW, local).split(sep).join("/"), ...localFile(local) })
    }
    return files.sort((a, b) => a.path.localeCompare(b.path))
}

/**
 * The SQL files are uploaded in `api/sql/`: `api/db.php` uses them
 * to create the tables if they do not exist yet.
 * @returns {{ path: string, local: string, size: number, hash: string }[]}
 */
function listSqlFiles() {
    return ["structure.sql", "data.sql"].map((name) => ({
        path: `api/sql/${name}`,
        ...localFile(resolve(SQL, name)),
    }))
}

function localFile(local) {
    const content = FS.readFileSync(local)
    return { local, size: content.length, hash: createHash("sha1").update(content).digest("hex") }
}

/**
 * @returns {Promise<Set<string>>} The remote files paths, relative to `dir`.
 */
async function listRemoteFiles(sftp, dir, prefix = "", files = new Set()) {
    if (!prefix && !(await sftp.exists(dir))) return files
    for (const item of await sftp.list(posix.join(dir, prefix))) {
        const path = posix.join(prefix, item.name)
        if (item.type === "d") await listRemoteFiles(sftp, dir, path, files)
        else files.add(path)
    }
    return files
}

/**
 * @returns {Promise<Map<string, string>>}
 *   The content of the remote `.hash` files, indexed by the path of the file they describe.
 */
async function readRemoteHashes(sftp, remoteDir, files) {
    const remoteFiles = await listRemoteFiles(sftp, remoteDir)
    const hashes = new Map()
    await Promise.all(
        files
            .filter((file) => remoteFiles.has(`${file.path}.hash`))
            .map(async (file) => {
                const content = await sftp.get(posix.join(remoteDir, `${file.path}.hash`))
                hashes.set(file.path, content.toString("utf8").trim())
            })
    )
    return hashes
}

async function connect(env) {
    let password = env.DEPLOY_PASSWORD
    for (;;) {
        if (!password) password = await askPassword(`SFTP password for ${USER}@${HOST}: `)
        const sftp = new SftpClient()
        try {
            console.log(`Connecting to ${USER}@${HOST}...`)
            await sftp.connect({ host: HOST, port: PORT, username: USER, password })
            if (password !== env.DEPLOY_PASSWORD) {
                writeEnv({ ...env, DEPLOY_PASSWORD: password })
                console.log("Password stored in .env")
            }
            return sftp
        } catch (ex) {
            // ssh2-sftp-client wraps the errors and loses `level: "client-authentication"`.
            if (!/authentication methods failed/i.test(ex.message)) {
                console.error("Unable to connect:", ex.message)
                process.exit(1)
            }
            console.error("Wrong password!")
            password = undefined
        }
    }
}

async function upload(sftp, allFiles, remoteDir) {
    console.log(`Comparing with the files in ${HOST}:${remoteDir}...`)
    const remoteHashes = await readRemoteHashes(sftp, remoteDir, allFiles)
    const files = allFiles.filter((file) => remoteHashes.get(file.path) !== file.hash)
    console.log(`${allFiles.length - files.length} files are already up to date.`)
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
    console.log(`Uploading ${files.length} files (${formatSize(totalBytes)}) to ${HOST}:${remoteDir}`)
    const createdDirs = new Set()
    const start = Date.now()
    let sentBytes = 0
    for (const file of files) {
        const remote = posix.join(remoteDir, file.path)
        const dir = posix.dirname(remote)
        if (!createdDirs.has(dir)) {
            if (!(await sftp.exists(dir))) await sftp.mkdir(dir, true)
            createdDirs.add(dir)
        }
        await sftp.fastPut(file.local, remote)
        // Written after the file, so that an interrupted upload is retried next time.
        await sftp.put(Buffer.from(file.hash), `${remote}.hash`)
        sentBytes += file.size
        const elapsed = Date.now() - start
        const percent = totalBytes > 0 ? (100 * sentBytes) / totalBytes : 100
        const remaining = sentBytes > 0 ? (elapsed * (totalBytes - sentBytes)) / sentBytes : 0
        console.log(
            `${percent.toFixed(1).padStart(5)}%  ${formatSize(sentBytes).padStart(8)} / ${formatSize(totalBytes)}  ETA ${formatDuration(remaining).padStart(7)}  ${file.path} (${formatSize(file.size)})`
        )
    }
    console.log(`Deployment done: ${formatSize(sentBytes)} sent in ${formatDuration(Date.now() - start)}.`)
}

function readEnv() {
    const env = {}
    if (!FS.existsSync(ENV_FILE)) return env
    for (const line of FS.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
        const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line)
        if (!match) continue
        const [, key, value] = match
        env[key] = /^(["']).*\1$/.test(value) ? JSON.parse(`"${value.slice(1, -1)}"`) : value
    }
    return env
}

function writeEnv(env) {
    const lines = Object.entries(env).map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    FS.writeFileSync(ENV_FILE, `${lines.join("\n")}\n`, { mode: 0o600 })
}

/**
 * Ask for a password without echoing it in the terminal.
 */
function askPassword(prompt) {
    return new Promise((resolvePassword) => {
        const { stdin, stdout } = process
        stdout.write(prompt)
        stdin.setRawMode(true)
        stdin.resume()
        stdin.setEncoding("utf8")
        let password = ""
        const onData = (chunk) => {
            for (const char of chunk) {
                if (char === "\r" || char === "\n") {
                    stdin.setRawMode(false)
                    stdin.pause()
                    stdin.off("data", onData)
                    stdout.write("\n")
                    resolvePassword(password)
                    return
                }
                if (char === "\u0003") {
                    stdout.write("\n")
                    process.exit(130)
                }
                if (char === "\u007f" || char === "\b") password = password.slice(0, -1)
                else password += char
            }
        }
        stdin.on("data", onData)
    })
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDuration(ms) {
    const seconds = Math.round(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return minutes > 0 ? `${minutes}m${String(seconds % 60).padStart(2, "0")}s` : `${seconds}s`
}
