/**
 * Pronouns that can be put after the verb in a French question ("Mange-t-il…").
 */
const SUBJECTS = "il|elle|ils|elles|on";

/**
 * Object and reflexive pronouns that stay before the verb in an inverted question
 * ("Se réveille-t-il…", "En a-t-il…"). With an apostrophe, they are glued to the verb.
 */
const CLITICS = "(?:(?:ne|se|le|la|les|lui|leur|y|en|me|te|nous|vous)\\s+|[nslmt]')*";

/** Matches "Mange-t-il", "Se réveille-t-il", "a-t-elle", "Vit-il"… */
const INVERSION = new RegExp(
  `(?<![\\p{L}'-])(${CLITICS})(\\p{L}+)-(?:t-)?(${SUBJECTS})(?![\\p{L}-])`,
  "gu",
);

/**
 * Rewrite a French question as a statement, because the part-of-speech model
 * has been trained on newspapers and tags inverted questions badly:
 * "Mange-t-il de la viande ?" becomes "il mange de la viande ?".
 *
 * - The text is lowercased: a capitalized verb at the start of the sentence
 *   is often taken for a proper noun.
 * - "Est-ce que" is removed, "est-ce" becomes "c'est" and "qu'est-ce que" becomes "quoi".
 * - The subject pronoun of an inverted question is put before the verb
 *   and its clitics ("se", "en", "n'"…).
 *
 * Caveat: the question word is not moved ("Combien de pattes a-t-il ?" gives
 * "combien de pattes il a ?"), and only the third person is handled, because
 * "-moi", "-nous" or "-vous" are usually imperatives ("Dis-moi").
 */
export function normalize(question: string): string {
  return question
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/qu'est-ce qu(?:e\s+|')/g, "quoi ")
    .replace(/est-ce qu(?:e\s+|')/g, "")
    .replace(/(?<![\p{L}'-])est-ce(?![\p{L}-])/gu, "c'est")
    .replace(
      INVERSION,
      (_, clitics: string, verb: string, subject: string) => `${subject} ${clitics}${verb}`,
    )
    .replace(/\s*([?!.,;:])/g, " $1")
    .replace(/\s+/g, " ")
    .trim();
}
