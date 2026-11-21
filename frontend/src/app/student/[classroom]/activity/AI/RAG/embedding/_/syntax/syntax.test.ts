import { describe, expect, it } from "vitest";

import { groupWords } from "./groups";
import { buildWords, type Prediction } from "./words";

/** Predictions as the model gives them: the piece `i` has the index `i + 1`. */
function predict(...tags: string[]): Map<number, Prediction> {
  return new Map(tags.map((tag, index) => [index + 1, { tag, score: 1 }]));
}

/** Words from a string like "il/CLS mange/V de/P la/DET viande/NC ?/PONCT". */
function words(sentence: string) {
  return sentence.split(" ").map((item) => {
    const [text, tag] = item.split("/");
    return { text, tag, score: 1 };
  });
}

function summarize(sentence: string): string {
  return groupWords(words(sentence))
    .map(({ kind, words }) => `${kind}:${words.map(({ text }) => text).join(" ")}`)
    .join(" | ");
}

describe("buildWords()", () => {
  it("should join the pieces of a word and keep the tag of the first one", () => {
    expect(buildWords(["▁M", "ange", "▁il"], predict("V", "NC", "CLS"))).toEqual([
      { text: "Mange", tag: "V", score: 1 },
      { text: "il", tag: "CLS", score: 1 },
    ]);
  });
  it("should cut a word after an apostrophe", () => {
    const result = buildWords(["▁c", "'", "est", "▁un"], predict("CLS", "NC", "V", "DET"));
    expect(result.map(({ text, tag }) => `${text}/${tag}`)).toEqual(["c'/CLS", "est/V", "un/DET"]);
  });
  it("should handle an empty word-start piece", () => {
    const predictions = predict("CLS", "V", "P", "?", "NPP");
    predictions.delete(4);
    const result = buildWords(["▁il", "▁vit", "▁en", "▁", "afrique"], predictions);
    expect(result.map(({ text, tag }) => `${text}/${tag}`)).toEqual([
      "il/CLS",
      "vit/V",
      "en/P",
      "afrique/NPP",
    ]);
  });
});

describe("groupWords()", () => {
  it("should find the subject, the action and the complement", () => {
    expect(summarize("il/CLS mange/V de/P la/DET viande/NC ?/PONCT")).toBe(
      "subject:il | action:mange | complement:de la viande | null:?",
    );
  });
  it("should find the question group", () => {
    expect(summarize("combien/ADV de/P pattes/NC il/CLS a/V ?/PONCT")).toBe(
      "question:combien de pattes | subject:il | action:a | null:?",
    );
  });
  it("should keep the pronouns and the negation with the verb", () => {
    expect(summarize("il/CLS ne/ADV se/CLR réveille/V pas/ADV la/DET nuit/NC")).toBe(
      "subject:il | action:ne se réveille pas | complement:la nuit",
    );
  });
  it("should cut a noun group before a preposition", () => {
    expect(summarize("le/DET lion/NC vit/V la/DET nuit/NC en/P afrique/NPP")).toBe(
      "subject:le lion | action:vit | complement:la nuit | complement:en afrique",
    );
  });
  it("should start a new clause after a link", () => {
    expect(summarize("il/CLS dort/V quand/CS le/DET soleil/NC se/CLR lève/V")).toBe(
      "subject:il | action:dort | link:quand | subject:le soleil | action:se lève",
    );
  });
  it("should recognize punctuation even when it is badly tagged", () => {
    expect(summarize("il/CLS en/CLO a/V combien/ADV ,/NC des/DET pattes/NC")).toBe(
      "subject:il | action:en a | question:combien | null:, | complement:des pattes",
    );
  });
});
