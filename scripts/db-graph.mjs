/**
 * Generate a graph of the database tables and relations from structure.sql.
 * Outputs structure.dot, structure.svg and structure.jpg next to structure.sql.
 * Requires Graphviz (`dot`) to be installed.
 *
 * - Each table gets its own header color, chosen so that similar colors
 *   end up as far as possible from each other in the layout.
 * - One-to-many (and one-to-one) links take the header color of the "one" side.
 * - Many-to-many links are black and dashed.
 */
import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../backend/database/sql")
const SQL = join(DIR, "structure.sql")
const DOT = join(DIR, "structure.dot")

function run(cmd, args, input) {
    return execFileSync(cmd, args, { input, encoding: "utf8", stdio: [input ? "pipe" : "ignore", "pipe", "inherit"] })
}

// SQL -> DBML -> DOT
const tmp = mkdtempSync(join(tmpdir(), "db-graph-"))
try {
    const dbml = join(tmp, "structure.dbml")
    run("npx", ["-y", "-p", "@dbml/cli", "sql2dbml", "--mysql", SQL, "-o", dbml])
    // sql2dbml marks optional relations with "?" (e.g. "<?"), which dbml-renderer cannot parse.
    writeFileSync(
        dbml,
        readFileSync(dbml, "utf8").replace(/^Ref.*$/gm, (line) => line.replaceAll("?", ""))
    )
    run("npx", ["-y", "@softwaretechnik/dbml-renderer", "-i", dbml, "-o", DOT, "-f", "dot"])
} finally {
    rmSync(tmp, { recursive: true, force: true })
}
let dot = readFileSync(DOT, "utf8")

// Table positions, from a first layout. Colors do not change the layout.
const RX_HEADER = /("([^"]+)" \[id="[^"]*";label=<<TABLE[^>]*>\s*<TR><TD PORT="f0" BGCOLOR=")#[0-9a-fA-F]{6}("><FONT COLOR=")#[0-9a-fA-F]{6}/g
const tables = [...dot.matchAll(RX_HEADER)].map((m) => m[2])
const positions = new Map()
for (const line of run("dot", ["-Tplain"], dot).split("\n")) {
    const m = line.match(/^node ("(?:[^"\\]|\\.)*"|\S+) (\S+) (\S+)/)
    if (m) positions.set(m[1].replace(/^"(.*)"$/, "$1"), [Number(m[2]), Number(m[3])])
}

// Palette: as many colors as tables, evenly spread hues, alternating lightness.
const palette = tables.map((_, k) => hslToRgb((k * 360) / tables.length, 0.7, k % 2 ? 0.38 : 0.55))
const labs = palette.map(rgbToLab)

// Assign colors: minimize sum of 1 / (colorDistance * spatialDistance) over all pairs.
const n = tables.length
const pairWeight = []
for (let i = 0; i < n; i++) {
    pairWeight.push([])
    for (let j = 0; j < n; j++) {
        const [xi, yi] = positions.get(tables[i]) ?? [0, 0]
        const [xj, yj] = positions.get(tables[j]) ?? [0, 0]
        pairWeight[i].push(1 / (Math.hypot(xi - xj, yi - yj) + 0.1))
    }
}
const colorWeight = labs.map((a) => labs.map((b) => 1 / (deltaE(a, b) + 1)))
const cost = (assign) => {
    let sum = 0
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) sum += pairWeight[i][j] * colorWeight[assign[i]][assign[j]]
    return sum
}
const assign = tables.map((_, k) => k)
{
    const random = mulberry32(42)
    let current = cost(assign)
    const steps = 50000
    for (let step = 0; step < steps; step++) {
        const temperature = current * 0.05 * (1 - step / steps)
        const a = Math.floor(random() * n)
        const b = Math.floor(random() * n)
        if (a === b) continue
        ;[assign[a], assign[b]] = [assign[b], assign[a]]
        const next = cost(assign)
        if (next <= current || random() < Math.exp((current - next) / temperature)) current = next
        else [assign[a], assign[b]] = [assign[b], assign[a]]
    }
}
const colorOf = new Map(tables.map((name, i) => [name, palette[assign[i]]]))

// Headers.
dot = dot.replace(RX_HEADER, (_, before, name, middle) => {
    const color = colorOf.get(name)
    return `${before}${toHex(color)}${middle}${contrastColor(color)}`
})

// Links.
dot = dot.replace(
    /^(\s*"([^"]+)":\S+ -> "([^"]+)":\S+ \[)([^\]]*headlabel="([^"]*)", taillabel="([^"]*)"[^\]]*)\]/gm,
    (_, start, from, to, attrs, head, tail) => {
        let style
        if (head === "*" && tail === "*") style = 'color="#000000", style=dashed'
        else style = `color="${toHex(colorOf.get(tail === "1" ? from : to))}"`
        return `${start}${attrs.replace(/color="[^"]*"/, style)}]`
    }
)

writeFileSync(DOT, dot)
run("dot", ["-Tsvg", DOT, "-o", join(DIR, "structure.svg")])
run("dot", ["-Tjpg", DOT, "-o", join(DIR, "structure.jpg")])
console.log(`Generated: ${DOT}, structure.svg, structure.jpg`)

// ----------------------------------------------------------------------------

function hslToRgb(h, s, l) {
    const f = (k) => {
        const a = s * Math.min(l, 1 - l)
        const t = (k + h / 30) % 12
        return l - a * Math.max(-1, Math.min(t - 3, 9 - t, 1))
    }
    return [f(0), f(8), f(4)].map((v) => Math.round(v * 255))
}

function rgbToLab([r, g, b]) {
    const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    const [R, G, B] = [lin(r), lin(g), lin(b)]
    const x = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047
    const y = 0.2126 * R + 0.7152 * G + 0.0722 * B
    const z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
    return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]
}

function deltaE(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

function toHex(rgb) {
    return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`
}

function contrastColor([r, g, b]) {
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#000000" : "#ffffff"
}

function mulberry32(seed) {
    return () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
