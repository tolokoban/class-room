/*
  elizabot.ts - ELIZA TypeScript library (French version)
  Based on elizabot.js v.1.1 (N.Landsteiner 2005) <http://www.masserk.at>
  Eliza is a mock Rogerian psychotherapist.
  Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
  cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language
      Communication Between Man and Machine"
      in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.

  Differences with the English engine:
  - word boundaries are Unicode aware (accented letters are letters),
  - elisions are expanded before matching ("j'ai" -> "je ai")
    and restored in the replies ("je ai" -> "j'ai"),
  - pronoun reflection also conjugates the verb ("je pense" -> "vous pensez",
    "tu es" -> "je suis"),
  - a reassembly param can be prefixed with words that are reflected
    together with the captured text: with "(je ne 2)", if the param 2
    is "aime pas ça", the result is "vous n'aimez pas ça".

  usage: const eliza = new ElizaBot()
         const initial = eliza.getInitial()
         const reply = eliza.transform(inputstring)
         if (eliza.quit) {
             // last user input was a quit phrase
         }

         // `transform()` returns a final phrase in case of a quit phrase
         // but you can also get a final phrase with:
         const final = eliza.getFinal()

         // reset memory and internal state
         eliza.reset()

         // internal memory size (default: 20)
         eliza.memSize = 100

         // disable random choices
         const deterministicEliza = new ElizaBot(true)

  Data is parsed and transformed for internal use the first time
  an `ElizaBot` is instantiated.
*/

import {
    elizaFinals,
    elizaInitials,
    elizaKeywords,
    elizaPostTransforms,
    elizaPres,
    elizaQuits,
    elizaReflection,
    elizaSynons,
} from "./elizadata"

const LETTER = "[\\p{L}\\p{N}_]"
const BOUNDARY_BEFORE = `(?<!${LETTER})`
const BOUNDARY_AFTER = `(?!${LETTER})`
/** Unicode aware equivalent of `\b`. */
const WORD_BOUNDARY = `(?:(?<=${LETTER})${BOUNDARY_AFTER}|${BOUNDARY_BEFORE}(?=${LETTER}))`

interface Decomp {
    pattern: RegExp
    reassemblies: readonly string[]
    /** If true, the reply is stored in memory instead of being returned. */
    memorize: boolean
}

interface Keyword {
    key: string
    keyPattern: RegExp
    rank: number
    decomps: Decomp[]
    /** Original index, used for stable sorting. */
    index: number
}

interface Substitutions {
    pattern: RegExp
    map: Record<string, string>
}

interface ParsedData {
    keywords: Keyword[]
    pres: Substitutions
}

export class ElizaBot {
    private static data: ParsedData | null = null

    public readonly noRandom: boolean
    public capitalizeFirstLetter = true
    public debug = false
    public memSize = 20
    public readonly version = "1.1 (fr)"
    public quit = false

    private mem: string[] = []
    private lastChoice: number[][] = []
    private sentence = ""

    constructor(noRandom = false) {
        this.noRandom = noRandom
        this.reset()
    }

    private get data(): ParsedData {
        if (!ElizaBot.data) ElizaBot.data = parseData()
        return ElizaBot.data
    }

    reset() {
        this.quit = false
        this.mem = []
        this.lastChoice = this.data.keywords.map(keyword => keyword.decomps.map(() => -1))
    }

    transform(input: string): string {
        let rpl = ""
        this.quit = false
        // unify text string
        const text = input
            .toLowerCase()
            .replace(/[’‘`´]/g, "'")
            .replace(/…/g, ".")
            .replace(/[@#$%^&*()_+=~{[}\]|:<>/\\\t"«»]/g, " ")
            .replace(/\s+-+\s+/g, ".")
            .replace(/-/g, " ")
            .replace(/\s*[,.?!;]+\s*/g, ".")
            .replace(new RegExp(`\\s*${BOUNDARY_BEFORE}mais${BOUNDARY_AFTER}\\s*`, "gu"), ".")
            .replace(/\s{2,}/g, " ")
        // split text in part sentences and loop through them
        for (const rawPart of text.split(".")) {
            const trimmedPart = rawPart.trim()
            if (trimmedPart === "") continue

            // check for quit expression
            if (elizaQuits.includes(trimmedPart)) {
                this.quit = true
                return this.getFinal()
            }
            const part = substitute(trimmedPart, this.data.pres).replace(/\s{2,}/g, " ").trim()
            this.sentence = part
            // loop through keywords
            const { keywords } = this.data
            for (let k = 0; k < keywords.length; k++) {
                if (part.search(keywords[k].keyPattern) >= 0) {
                    rpl = this.execRule(k)
                }
                if (rpl !== "") return rpl
            }
        }
        // nothing matched try mem
        rpl = this.memGet()
        // if nothing in mem, so try xnone
        if (rpl === "") {
            this.sentence = " "
            const k = this.getRuleIndexByKey("xnone")
            if (k >= 0) rpl = this.execRule(k)
        }
        // return reply or default string
        return rpl !== "" ? rpl : "Je ne sais plus quoi dire."
    }

    getFinal(): string {
        return pickRandom(elizaFinals)
    }

    getInitial(): string {
        return pickRandom(elizaInitials)
    }

    private execRule(k: number): string {
        const keyword = this.data.keywords[k]
        const { decomps } = keyword
        // "(2)" or "(je ne 2)"
        const paramRegex = /\(([^()0-9]*)([0-9]+)\)/
        for (let i = 0; i < decomps.length; i++) {
            const m = this.sentence.match(decomps[i].pattern)
            if (!m) continue

            const { reassemblies, memorize } = decomps[i]
            const lastChoice = this.lastChoice[k]
            let ri = this.noRandom ? 0 : Math.floor(Math.random() * reassemblies.length)
            if ((this.noRandom && lastChoice[i] > ri) || lastChoice[i] === ri) {
                ri = ++lastChoice[i]
                if (ri >= reassemblies.length) {
                    ri = 0
                    lastChoice[i] = -1
                }
            } else {
                lastChoice[i] = ri
            }
            let rpl = reassemblies[ri]
            if (this.debug) {
                console.log(
                    `match:\nkey: ${keyword.key}\nrank: ${keyword.rank}\ndecomp: ${decomps[i].pattern.source}\nreasmb: ${rpl}\nmemflag: ${memorize}`,
                )
            }
            if (/^goto /i.test(rpl)) {
                const ki = this.getRuleIndexByKey(rpl.substring(5))
                if (ki >= 0) return this.execRule(ki)
            }
            // substitute positional params
            let m1 = paramRegex.exec(rpl)
            if (m1) {
                let lp = ""
                let rp = rpl
                while (m1) {
                    const param = reflect(m1[1] + (m[parseInt(m1[2], 10)] ?? ""))
                    lp += rp.substring(0, m1.index) + param
                    rp = rp.substring(m1.index + m1[0].length)
                    m1 = paramRegex.exec(rp)
                }
                rpl = lp + rp
            }
            rpl = this.postTransform(rpl)
            if (!memorize) return rpl

            this.memSave(rpl)
        }
        return ""
    }

    private postTransform(input: string): string {
        // final cleanings
        let s = input.replace(/\s{2,}/g, " ").replace(/\s+\./g, ".")
        for (const [pattern, replacement] of elizaPostTransforms) {
            s = s.replace(pattern, replacement)
            pattern.lastIndex = 0
        }
        // capitalize first char
        if (this.capitalizeFirstLetter) {
            s = s.replace(/^\p{Ll}/u, c => c.toUpperCase())
        }
        return s
    }

    private getRuleIndexByKey(key: string): number {
        return this.data.keywords.findIndex(keyword => keyword.key === key)
    }

    private memSave(text: string) {
        this.mem.push(text)
        if (this.mem.length > this.memSize) this.mem.shift()
    }

    private memGet(): string {
        if (this.mem.length === 0) return ""
        if (this.noRandom) return this.mem.shift() ?? ""

        const n = Math.floor(Math.random() * this.mem.length)
        const [rpl] = this.mem.splice(n, 1)
        return rpl
    }
}

function pickRandom(items: readonly string[]): string {
    if (items.length === 0) return ""
    return items[Math.floor(Math.random() * items.length)]
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Replace every word of `text` found in `subst.map`.
 */
function substitute(text: string, subst: Substitutions): string {
    let m = subst.pattern.exec(text)
    if (!m) return text

    let lp = ""
    let rp = text
    while (m) {
        lp += rp.substring(0, m.index) + subst.map[m[1]]
        rp = rp.substring(m.index + m[0].length)
        m = subst.pattern.exec(rp)
    }
    return lp + rp
}

/**
 * Swap the point of view of a fragment of the user's sentence:
 * "je pense à ma mère" -> "vous pensez à votre mère",
 * "tu me détestes" -> "je vous déteste".
 */
function reflect(fragment: string): string {
    const { words: wordMap, subjects, clitics } = elizaReflection
    const words = fragment.split(/\s+/).filter(Boolean)
    const out: string[] = []
    let i = 0
    while (i < words.length) {
        const subject = isSubject(words, i) ? lookup(subjects, words[i]) : undefined
        if (!subject) {
            out.push(reflectWord(words, i) ?? lookup(wordMap, words[i]) ?? words[i])
            i++
            continue
        }

        const [replacement, person] = subject
        out.push(replacement)
        i++
        // object pronouns and negation between the subject and the verb
        let clitic = lookup(clitics, words[i])
        while (clitic !== undefined) {
            out.push(clitic)
            i++
            clitic = lookup(clitics, words[i])
        }
        if (person !== "third" && i < words.length) {
            out.push(conjugate(words[i], person))
            i++
        }
    }
    return out.join(" ")
}

/**
 * Safe access to a dictionary: ignores inherited keys like "constructor".
 */
function lookup<T>(record: Readonly<Record<string, T>>, key: string | undefined): T | undefined {
    if (key === undefined || !Object.prototype.hasOwnProperty.call(record, key)) return undefined
    return record[key]
}

function isSubject(words: string[], index: number): boolean {
    const word = words[index]
    if (lookup(elizaReflection.subjects, word) === undefined) return false
    if (word !== "vous") return true

    // "vous" is the subject only if it is followed by a matching verb
    let next = index + 1
    while (lookup(elizaReflection.clitics, words[next]) !== undefined) next++
    return next < words.length && isSecondPersonVerb(words[next])
}

function isSecondPersonVerb(word: string): boolean {
    return lookup(elizaReflection.verbsSecondToFirst, word) !== undefined || word.endsWith("ez")
}

/**
 * "vous" used as an object becomes "me" in front of a verb, and "moi" otherwise.
 */
function reflectWord(words: string[], index: number): string | undefined {
    if (words[index] !== "vous") return undefined

    const { prepositions, stressedFollowers } = elizaReflection
    const prev = words[index - 1] ?? ""
    const next = words[index + 1]
    if (next === undefined || prepositions.includes(prev) || stressedFollowers.includes(next)) {
        return "moi"
    }
    return "me"
}

function conjugate(verb: string, person: "first" | "second"): string {
    if (person === "first") {
        // "je ..." -> "vous ..."
        const irregular = lookup(elizaReflection.verbsFirstToSecond, verb)
        if (irregular) return irregular
        // imperfect / conditional: "je pensais" -> "vous pensiez"
        if (verb.endsWith("ais")) return `${verb.slice(0, -2)}iez`
        // future: "je serai" -> "vous serez"
        if (verb.endsWith("rai")) return `${verb.slice(0, -1)}ez`
        // present of verbs ending in -er: "je pense" -> "vous pensez"
        if (verb.endsWith("e")) return `${verb}z`
        return verb
    }
    // "tu ..." or "vous ..." -> "je ..."
    const irregular = lookup(elizaReflection.verbsSecondToFirst, verb)
    if (irregular) return irregular
    // imperfect / conditional: "vous pensiez" -> "je pensais"
    if (verb.endsWith("iez")) return `${verb.slice(0, -3)}ais`
    // future: "vous penserez" -> "je penserai", "tu seras" -> "je serai"
    if (verb.endsWith("erez")) return `${verb.slice(0, -2)}ai`
    if (verb.endsWith("ras")) return `${verb.slice(0, -1)}i`
    // present of verbs ending in -er: "vous pensez" -> "je pense", "tu penses" -> "je pense"
    if (verb.endsWith("ez") || verb.endsWith("es")) return verb.slice(0, -1)
    return verb
}

/**
 * Parse data and convert it from canonical form to internal use.
 */
function parseData(): ParsedData {
    // produce synonym list
    const synPatterns: Record<string, string> = {}
    for (const [word, synonyms] of Object.entries(elizaSynons)) {
        synPatterns[word] = `${BOUNDARY_BEFORE}(${[word, ...synonyms].join("|")})${BOUNDARY_AFTER}`
    }
    const keywords: Keyword[] = elizaKeywords.map(([key, rank, decomps], index) => ({
        key,
        keyPattern: new RegExp(`${BOUNDARY_BEFORE}${escapeRegExp(key)}${BOUNDARY_AFTER}`, "iu"),
        rank,
        index,
        decomps: decomps.map(([pattern, reassemblies]) => {
            const memorize = pattern.startsWith("$")
            const source = parseDecompPattern(memorize ? pattern.substring(1).trimStart() : pattern, synPatterns)
            return { pattern: new RegExp(source, "u"), reassemblies, memorize }
        }),
    }))
    if (keywords.length === 0) {
        // install empty structure to prevent any errors
        keywords.push({ key: "###", keyPattern: /###/u, rank: 0, index: 0, decomps: [] })
    }
    // sort keywords by rank (highest first), then by original index
    keywords.sort((a, b) => b.rank - a.rank || a.index - b.index)
    return {
        keywords,
        pres: parseSubstitutions(elizaPres),
    }
}

/**
 * Expand synonyms and insert asterisk expressions for backtracking.
 */
function parseDecompPattern(decomp: string, synPatterns: Record<string, string>): string {
    const synonymRegex = /@(\S+)/
    const asteriskRegex = /(\S)\s*\*\s*(\S)/
    const leadingAsteriskRegex = /^\s*\*\s*(\S)/
    const trailingAsteriskRegex = /(\S)\s*\*\s*$/
    const onlyAsteriskRegex = /^\s*\*\s*$/

    let pattern = decomp
    // expand synonyms
    let m = synonymRegex.exec(pattern)
    while (m) {
        const sp = synPatterns[m[1]] ?? m[1]
        pattern = pattern.substring(0, m.index) + sp + pattern.substring(m.index + m[0].length)
        m = synonymRegex.exec(pattern)
    }
    // expand asterisk expressions
    if (onlyAsteriskRegex.test(pattern)) {
        pattern = "\\s*(.*)\\s*"
    } else {
        m = asteriskRegex.exec(pattern)
        if (m) {
            let lp = ""
            let rp = pattern
            while (m) {
                lp += rp.substring(0, m.index + 1)
                if (m[1] !== ")") lp += WORD_BOUNDARY
                lp += "\\s*(.*)\\s*"
                if (m[2] !== "(" && m[2] !== "\\") lp += WORD_BOUNDARY
                lp += m[2]
                rp = rp.substring(m.index + m[0].length)
                m = asteriskRegex.exec(rp)
            }
            pattern = lp + rp
        }
        m = leadingAsteriskRegex.exec(pattern)
        if (m) {
            let lp = "\\s*(.*)\\s*"
            if (m[1] !== ")" && m[1] !== "\\") lp += WORD_BOUNDARY
            pattern = lp + pattern.substring(m.index - 1 + m[0].length)
        }
        m = trailingAsteriskRegex.exec(pattern)
        if (m) {
            let lp = pattern.substring(0, m.index + 1)
            if (m[1] !== "(") lp += WORD_BOUNDARY
            pattern = lp + "\\s*(.*)\\s*"
        }
    }
    // expand white space
    return pattern.replace(/\s+/g, "\\s+")
}

/**
 * Convert a flat list of "word", "replacement" pairs into a regexp and a map.
 * A word ending with an apostrophe (elision) does not need a boundary after it.
 */
function parseSubstitutions(pairs: readonly string[]): Substitutions {
    if (pairs.length === 0) {
        // default (should not match)
        return { pattern: /####/u, map: { "####": "####" } }
    }
    const map: Record<string, string> = {}
    for (let i = 0; i < pairs.length; i += 2) {
        map[pairs[i]] = pairs[i + 1]
    }
    // longest first, to give priority to "s'il" over "s'"
    const words = Object.keys(map)
        .sort((a, b) => b.length - a.length)
        .map(word => escapeRegExp(word) + (word.endsWith("'") ? "" : BOUNDARY_AFTER))
    return { pattern: new RegExp(`${BOUNDARY_BEFORE}(${words.join("|")})`, "u"), map }
}
