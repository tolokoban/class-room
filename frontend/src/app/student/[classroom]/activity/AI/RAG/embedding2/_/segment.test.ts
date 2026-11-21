import { describe, expect, it } from "vitest";

import { segmentProse, segmentVerses, splitSentences } from "./segment";

describe("segmentVerses", () => {
  it("cuts in chunks of 4 verses overlapping by 1", () => {
    const text = ["1", "2", "3", "4", "5", "6", "7", "8"].join("\n");
    expect(segmentVerses(text)).toEqual(["1\n2\n3\n4", "4\n5\n6\n7", "7\n8"]);
  });

  it("never ends with a chunk made only of the overlap", () => {
    const text = ["1", "2", "3", "4", "5", "6", "7"].join("\n");
    expect(segmentVerses(text)).toEqual(["1\n2\n3\n4", "4\n5\n6\n7"]);
  });

  it("keeps a short fable in one chunk, and ignores empty lines", () => {
    expect(segmentVerses("1\n\n2\n3")).toEqual(["1\n2\n3"]);
  });
});

describe("splitSentences", () => {
  it("splits after a quotation", () => {
    expect(splitSentences("Il dit : « Bonjour. » Puis il part. Fin !")).toEqual([
      "Il dit : « Bonjour. »",
      "Puis il part.",
      "Fin !",
    ]);
  });

  it("does not split before a lower case letter", () => {
    expect(splitSentences("« Eh bien ! dirent-elles, danse. »")).toEqual([
      "« Eh bien ! dirent-elles, danse. »",
    ]);
  });
});

describe("segmentProse", () => {
  it("keeps the moral as a chunk of its own", () => {
    const text = "A. B. C. D. E.\n\nCette fable montre que…";
    expect(segmentProse(text)).toEqual(["A. B. C.", "C. D. E.", "Cette fable montre que…"]);
  });

  it("finds the moral at the beginning, as in Phèdre", () => {
    const text = "Le petit se perd…\n\nA. B. C. D. E.";
    expect(segmentProse(text, "first")).toEqual(["A. B. C.", "C. D. E.", "Le petit se perd…"]);
  });

  it("has no moral when there is only one paragraph", () => {
    expect(segmentProse("A. B.")).toEqual(["A. B."]);
  });
});
