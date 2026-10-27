/**
 * Crawl `frontend/src/app/student/[classroom]/activity` to generate
 * `frontend/src/components/ActivitiesList/activities.ts`.
 *
 * An activity is a folder containing a `page.tsx`.
 * A folder can also hold an `info.fr.md` whose first `# ` line is the title
 * and the remaining text the description.
 *
 * The output file is only written if its content changed.
 */
import FS from "node:fs"
import Path from "node:path"

const ROOT = Path.resolve(import.meta.dirname, "..")
const ACTIVITY_DIR = Path.resolve(
    ROOT,
    "frontend/src/app/student/[classroom]/activity",
)
const OUTPUT = Path.resolve(
    ROOT,
    "frontend/src/components/ActivitiesList/activities.ts",
)

type Activity = [name: string, children?: Activity[]]

interface Info {
    title?: string
    description?: string
}

const INFOS: Record<string, Info> = {}

function crawl(dir: string, path: string[]): Activity[] {
    const activities: Activity[] = []
    const entries = FS.readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== "_")
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b))
    for (const name of entries) {
        const subDir = Path.join(dir, name)
        const subPath = [...path, name]
        const children = crawl(subDir, subPath)
        const hasPage = FS.existsSync(Path.join(subDir, "page.tsx"))
        const info = readInfo(subDir)
        if (!hasPage && children.length === 0) continue

        if (hasPage || info) INFOS[subPath.join("/")] = info ?? {}
        activities.push(children.length > 0 ? [name, children] : [name])
    }
    return activities
}

function readInfo(dir: string): Info | undefined {
    const filename = Path.join(dir, "info.fr.md")
    if (!FS.existsSync(filename)) return undefined

    const info: Info = {}
    const lines = FS.readFileSync(filename, "utf-8").split("\n")
    const titleIndex = lines.findIndex((line) => line.startsWith("# "))
    if (titleIndex > -1) {
        info.title = lines[titleIndex].slice(2).trim()
        lines.splice(titleIndex, 1)
    }
    const description = lines.join("\n").trim()
    if (description.length > 0) info.description = description
    return info
}

function stringifyActivity([name, children]: Activity): string {
    const items = [JSON.stringify(name)]
    if (children) items.push(`[${children.map(stringifyActivity).join(", ")}]`)
    return `[${items.join(", ")}]`
}

function stringifyKey(key: string): string {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key)
}

function stringifyInfo(info: Info): string {
    const entries = Object.entries(info)
    if (entries.length === 0) return "{}"

    return `{\n${entries
        .map(([key, value]) => `    ${key}: ${JSON.stringify(value)},\n`)
        .join("")}  }`
}

function generate(): string {
    const activities = crawl(ACTIVITY_DIR, [])
    return `/**
 * This file is auto-generated.
 */

type Activity = [name: string, children?: Activity[]];

export const ACTIVITIES: Activity[] = [
${activities.map((activity) => `  ${stringifyActivity(activity)},\n`).join("")}];

export const INFOS: Record<
  string,
  {
    title?: string;
    description?: string;
  }
> = {
${Object.entries(INFOS)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, info]) => `  ${stringifyKey(key)}: ${stringifyInfo(info)},\n`)
    .join("")}};
`
}

const content = generate()
const current = FS.existsSync(OUTPUT) ? FS.readFileSync(OUTPUT, "utf-8") : ""
if (content === current) {
    console.log("No change:", Path.relative(ROOT, OUTPUT))
} else {
    FS.writeFileSync(OUTPUT, content)
    console.log("Updated:", Path.relative(ROOT, OUTPUT))
}
