import type { TaggedWord } from "./words";

/**
 * - `subject`: who does the action ("il", "le lion").
 * - `action`: the verb, with its pronouns and negation ("se réveille", "n'a pas").
 * - `complement`: what comes after the verb ("de la viande", "la nuit", "nocturne").
 * - `question`: a group with a question word ("combien de pattes", "de quelle couleur").
 * - `link`: a conjunction ("que", "quand", "et").
 * - `null`: punctuation.
 */
export type GroupKind = "subject" | "action" | "complement" | "question" | "link";

export interface WordGroup {
  kind: GroupKind | null;
  words: TaggedWord[];
}

type Category = "verb" | "pronoun" | "nominal" | "link" | "punctuation";

const VERB_TAGS = new Set(["V", "VIMP", "VINF", "VPP", "VPR", "VS", "CLR", "CLO"]);
const PRONOUN_TAGS = new Set(["CLS", "PRO", "PROREL"]);
const LINK_TAGS = new Set(["CS", "CC"]);
const PREPOSITION_TAGS = new Set(["P", "P+D"]);
/** Tags that make the core of a group: after them, a preposition starts a new group. */
const HEAD_TAGS = new Set(["NC", "NPP", "ADJ", "PRO", "PROWH", "ET"]);
const NEGATIONS = new Set(["ne", "n'", "pas", "jamais"]);
/** The model often tags "quelle" as a plain determiner, and "combien" as a plain adverb. */
const QUESTION_WORDS = new Set([
  "combien",
  "comment",
  "pourquoi",
  "où",
  "quoi",
  "quel",
  "quelle",
  "quels",
  "quelles",
  "lequel",
  "laquelle",
  "lesquels",
  "lesquelles",
]);

const PUNCTUATION = /^[?!.,;:]+$/;

function categoryOf({ text, tag }: TaggedWord): Category {
  // The model sometimes tags a comma as a noun.
  if (tag === "PONCT" || PUNCTUATION.test(text)) return "punctuation";
  if (VERB_TAGS.has(tag) || NEGATIONS.has(text)) return "verb";
  if (PRONOUN_TAGS.has(tag)) return "pronoun";
  if (LINK_TAGS.has(tag)) return "link";
  return "nominal";
}

function isQuestionWord({ text, tag }: TaggedWord): boolean {
  return tag.endsWith("WH") || QUESTION_WORDS.has(text);
}

/**
 * Cut the tagged words into groups (subject, action, complement…), with simple rules
 * on the parts of speech, since we have no real syntactic parser in the browser.
 *
 * Caveats:
 * - The first group before the verb is taken as the subject.
 *   A link word ("quand", "que") starts a new clause, with its own subject.
 * - All the groups after the verb are complements: we cannot tell an object
 *   ("de la viande") from a time ("la nuit").
 * - A noun group is cut before each preposition: "un animal de nuit" gives two groups.
 */
export function groupWords(words: TaggedWord[]): WordGroup[] {
  const runs: Array<{ category: Category; words: TaggedWord[] }> = [];
  for (const word of words) {
    const category = categoryOf(word);
    const run = runs[runs.length - 1];
    if (run && run.category === category && canExtend(run.words, word)) {
      run.words.push(word);
    } else {
      runs.push({ category, words: [word] });
    }
  }
  let hasSubject = false;
  let hasAction = false;
  return runs.map(({ category, words }) => {
    const kind = kindOf(category, words, hasSubject, hasAction);
    if (kind === "subject") hasSubject = true;
    if (kind === "action") hasAction = true;
    if (kind === "link") hasSubject = hasAction = false;
    return { kind, words };
  });
}

function canExtend(run: TaggedWord[], word: TaggedWord): boolean {
  switch (categoryOf(word)) {
    case "verb":
    case "link":
      return true;
    case "nominal":
      return !(PREPOSITION_TAGS.has(word.tag) && run.some(({ tag }) => HEAD_TAGS.has(tag)));
    default:
      // Each pronoun and each punctuation mark is a group on its own.
      return false;
  }
}

function kindOf(
  category: Category,
  words: TaggedWord[],
  hasSubject: boolean,
  hasAction: boolean,
): GroupKind | null {
  switch (category) {
    case "punctuation":
      return null;
    case "verb":
      return "action";
    case "link":
      return "link";
    default:
      if (category === "nominal" && words.some(isQuestionWord)) return "question";
      return hasSubject || hasAction ? "complement" : "subject";
  }
}
