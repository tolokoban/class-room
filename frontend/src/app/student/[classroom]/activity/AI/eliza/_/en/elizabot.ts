/*
  elizabot.ts - ELIZA TypeScript library
  Based on elizabot.js v.1.1 (N.Landsteiner 2005) <http://www.masserk.at>
  Eliza is a mock Rogerian psychotherapist.
  Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
  cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language
      Communication Between Man and Machine"
      in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.

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

         // to reproduce the example conversation given by J. Weizenbaum
         // initialize with the optional random-choice-disable flag
         const originalEliza = new ElizaBot(true)

  Data is parsed and transformed for internal use the first time
  an `ElizaBot` is instantiated.
*/

import {
    elizaFinals,
    elizaInitials,
    elizaKeywords,
    elizaPosts,
    elizaPostTransforms,
    elizaPres,
    elizaQuits,
    elizaSynons,
} from "./elizadata"

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
    posts: Substitutions
}

export class ElizaBot {
    private static data: ParsedData | null = null

    public readonly noRandom: boolean
    public capitalizeFirstLetter = true
    public debug = false
    public memSize = 20
    public readonly version = "1.1 (original)"
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
            .replace(/[@#$%^&*()_+=~`{[}\]|:;<>/\\\t]/g, " ")
            .replace(/\s+-+\s+/g, ".")
            .replace(/\s*[,.?!;]+\s*/g, ".")
            .replace(/\s*\bbut\b\s*/g, ".")
            .replace(/\s{2,}/g, " ")
        // split text in part sentences and loop through them
        for (const rawPart of text.split(".")) {
            if (rawPart === "") continue

            // check for quit expression
            if (elizaQuits.includes(rawPart)) {
                this.quit = true
                return this.getFinal()
            }
            const part = substitute(rawPart, this.data.pres)
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
        return rpl !== "" ? rpl : "I am at a loss for words."
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
        const paramRegex = /\(([0-9]+)\)/
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
                    const param = substitute(m[parseInt(m1[1], 10)] ?? "", this.data.posts)
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
            s = s.replace(/^[a-z]/, c => c.toUpperCase())
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
 * Parse data and convert it from canonical form to internal use.
 */
function parseData(): ParsedData {
    // produce synonym list
    const synPatterns: Record<string, string> = {}
    for (const [word, synonyms] of Object.entries(elizaSynons)) {
        synPatterns[word] = `(${word}|${synonyms.join("|")})`
    }
    const keywords: Keyword[] = elizaKeywords.map(([key, rank, decomps], index) => ({
        key,
        keyPattern: new RegExp(`\\b${key}\\b`, "i"),
        rank,
        index,
        decomps: decomps.map(([pattern, reassemblies]) => {
            const memorize = pattern.startsWith("$")
            const source = parseDecompPattern(memorize ? pattern.substring(1).trimStart() : pattern, synPatterns)
            return { pattern: new RegExp(source), reassemblies, memorize }
        }),
    }))
    if (keywords.length === 0) {
        // install empty structure to prevent any errors
        keywords.push({ key: "###", keyPattern: /\b###\b/i, rank: 0, index: 0, decomps: [] })
    }
    // sort keywords by rank (highest first), then by original index
    keywords.sort((a, b) => b.rank - a.rank || a.index - b.index)
    return {
        keywords,
        pres: parseSubstitutions(elizaPres),
        posts: parseSubstitutions(elizaPosts),
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
                if (m[1] !== ")") lp += "\\b"
                lp += "\\s*(.*)\\s*"
                if (m[2] !== "(" && m[2] !== "\\") lp += "\\b"
                lp += m[2]
                rp = rp.substring(m.index + m[0].length)
                m = asteriskRegex.exec(rp)
            }
            pattern = lp + rp
        }
        m = leadingAsteriskRegex.exec(pattern)
        if (m) {
            let lp = "\\s*(.*)\\s*"
            if (m[1] !== ")" && m[1] !== "\\") lp += "\\b"
            pattern = lp + pattern.substring(m.index - 1 + m[0].length)
        }
        m = trailingAsteriskRegex.exec(pattern)
        if (m) {
            let lp = pattern.substring(0, m.index + 1)
            if (m[1] !== "(") lp += "\\b"
            pattern = lp + "\\s*(.*)\\s*"
        }
    }
    // expand white space
    return pattern.replace(/\s+/g, "\\s+")
}

/**
 * Convert a flat list of "word", "replacement" pairs into a regexp and a map.
 */
function parseSubstitutions(pairs: readonly string[]): Substitutions {
    if (pairs.length === 0) {
        // default (should not match)
        return { pattern: /####/, map: { "####": "####" } }
    }
    const words: string[] = []
    const map: Record<string, string> = {}
    for (let i = 0; i < pairs.length; i += 2) {
        words.push(pairs[i])
        map[pairs[i]] = pairs[i + 1]
    }
    return { pattern: new RegExp(`\\b(${words.join("|")})\\b`), map }
}
