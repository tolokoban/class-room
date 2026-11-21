import React from "react";

import { groupWords, type WordGroup } from "../../syntax/groups";
import { normalize } from "../../syntax/normalize";
import { tagWords } from "../../syntax/tagger";
import { joinWords, type TaggedWord } from "../../syntax/words";
import type { Chip } from "./Chips";
import { useTranslation } from "./translation";

type Translation = ReturnType<typeof useTranslation>;

export type AnalysisState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; words: TaggedWord[]; groups: WordGroup[] };

/**
 * Normalize the question of the student, tag its words and group them.
 * The part-of-speech model is downloaded at the first call.
 */
export function useAnalysis(question: string) {
  const tr = useTranslation();
  const [state, setState] = React.useState<AnalysisState>({ status: "loading" });
  React.useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    tagWords(normalize(question))
      .then((words) => {
        if (alive) setState({ status: "ready", words, groups: groupWords(words) });
      })
      .catch((error: unknown) => {
        if (alive)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
      });
    return () => {
      alive = false;
    };
  }, [question]);
  const wordChips: Chip[] =
    state.status === "ready"
      ? state.words.map(({ text, tag, score }) => ({
          text,
          kind: kindOfTag(tag),
          tooltip: tr.wordTooltip$(tagName(tr, tag), tag, `${Math.round(score * 100)}`),
        }))
      : [];
  const groupChips: Chip[] =
    state.status === "ready"
      ? state.groups.map(({ kind, words }) => ({
          text: joinWords(words),
          kind,
          tooltip: kind ? tr[`group_${kind}`] : undefined,
        }))
      : [];
  return { tr, state, wordChips, groupChips };
}

/**
 * @returns The translated name of a tag of the French Treebank,
 * or the tag itself if it is unknown.
 */
function tagName(tr: Translation, tag: string): string {
  const name: unknown = (tr as Record<string, unknown>)[`tag_${tag.replace("+", "_")}`];
  return typeof name === "string" ? name : tag;
}

/**
 * @returns The CSS class used to highlight a word with this tag,
 * or `null` for no highlight (punctuation, unknown tags).
 */
function kindOfTag(tag: string): string | null {
  if (tag.startsWith("V")) return "verb";
  if (tag.startsWith("CL") || tag.startsWith("PRO")) return "pronoun";
  if (tag === "NC" || tag === "NPP" || tag === "ET") return "noun";
  if (tag.startsWith("ADJ")) return "adjective";
  if (tag.startsWith("ADV")) return "adverb";
  if (tag.startsWith("DET")) return "determiner";
  if (tag === "P" || tag === "P+D") return "preposition";
  if (tag === "CS" || tag === "CC") return "link";
  return null;
}
