/**
 * Segment the fables, precompute the embeddings of their passages
 * (whole text, summaries, chunks and their rewordings), and write them in `data/vectors.dat`.
 * `data/fables.ts` only holds offsets in this file.
 * It also computes the projection used by the 3D view (`data/projection.ts`).
 *
 * Only run it again if you change the fables or the model (see `../../_/model.ts`):
 *   npm run embeddings:fables
 * It needs Node 24+, for `Float16Array`.
 */
import Path from "node:path";

import { EmbeddingsStore, fitProjection, writeTypeScript } from "../../_/generator.mts";
import { segmentProse, segmentVerses } from "./segment.ts";
import { FABLES, type FableSource } from "./source/fables.ts";
import { REWORDINGS, rewordingsKey } from "./source/rewordings.ts";
import type { Fables, Passage, PassageKind } from "./types.ts";

const DATA_DIR = Path.resolve(import.meta.dirname, "data");
/** Number of stories: each one has an ancient version (Ésope or Phèdre) and one by La Fontaine. */
const STORIES_COUNT = 41;

const store = await EmbeddingsStore.create();

/** Write a file of `data/` that exports `value`, typed with a type of `../types.ts`. */
function write(filename: string, type: string, name: string, value: unknown) {
  writeTypeScript(Path.resolve(DATA_DIR, filename), { name: type, from: "../types" }, name, value);
}

/**
 * The passages are embedded as "passage: " and the student's sentence as "query: ",
 * as advised for the E5 models when looking for documents that answer a query.
 */
async function makePassages(texts: Array<[PassageKind, string]>): Promise<Passage[]> {
  const offsets = await store.embed(
    texts.map(([, text]) => text),
    "passage",
  );
  return texts.map(([kind, text], index) => ({ kind, text, offset: offsets[index] }));
}

/** La Fontaine wrote in verse; Ésope and Phèdre are in prose, Phèdre giving the moral first. */
function segment({ author, text }: FableSource): string[] {
  if (author === "lafontaine") return segmentVerses(text);
  return segmentProse(text, author === "phedre" ? "first" : "last");
}

/**
 * The chunks of a fable, each one with its rewordings in modern French.
 * Stop with an error if `source/rewordings.ts` does not match the segmentation
 * (for instance after a change of the text or of `segment.ts`): the rewordings
 * would be attached to the wrong chunks.
 */
function chunksOf(fable: FableSource): Array<{ chunk: string; rewordings: string[] }> {
  const chunks = segment(fable);
  const key = rewordingsKey(fable);
  const rewordings = REWORDINGS[key];
  if (!rewordings) throw new Error(`No rewordings for "${key}" in source/rewordings.ts!`);
  if (rewordings.length !== chunks.length) {
    throw new Error(`"${key}" has ${chunks.length} chunks, but ${rewordings.length} rewordings!`);
  }
  return chunks.map((chunk, index) => {
    const item = rewordings[index];
    if (item.chunk !== chunk) {
      throw new Error(`Chunk #${index} of "${key}" does not match source/rewordings.ts:\n${chunk}`);
    }
    if (item.rewordings.some((text) => text.trim().length === 0)) {
      throw new Error(`Chunk #${index} of "${key}" has an empty rewording!`);
    }
    return item;
  });
}

/**
 * Stop with an error if a story does not have exactly one fable by La Fontaine and one
 * ancient fable (by Ésope or Phèdre), or if a fable has no text or no summary.
 */
function check() {
  for (let story = 0; story < STORIES_COUNT; story++) {
    const authors = FABLES.filter((fable) => fable.story === story).map(({ author }) => author);
    const ancient = authors.filter((author) => author !== "lafontaine");
    if (authors.length !== 2 || ancient.length !== 1) {
      throw new Error(
        `Story #${story} must have one fable by La Fontaine and one by Ésope or Phèdre, not [${authors}]!`,
      );
    }
  }
  for (const { title, summaries, text } of FABLES) {
    if (summaries.length === 0 || summaries.some((summary) => summary.trim().length === 0)) {
      throw new Error(`"${title}" has no summary, or an empty one!`);
    }
    if (text.trim().length === 0) throw new Error(`"${title}" has no text!`);
  }
}

check();
const fables: Fables = [];
for (const fable of FABLES) {
  const { story, author, title, url, summaries, text } = fable;
  const chunks = chunksOf(fable);
  const passages = await makePassages([
    ["whole", text],
    ...summaries.map((summary): [PassageKind, string] => ["summary", summary]),
  ]);
  for (const { chunk, rewordings } of chunks) {
    // The chunk and its rewordings are embedded as passages, like everything else.
    const [offset, ...offsets] = await store.embed([chunk, ...rewordings], "passage");
    passages.push({ kind: "chunk", text: chunk, offset, rewordings: offsets });
  }
  fables.push({ story, author, title, url, passages });
  console.log(`${title} (${author}): ${chunks.length} chunks`);
}
write("fables.ts", "Fables", "FABLES", fables);

// Fisher LDA on the stories: all the passages of both versions of a story are a group.
const groups = Array.from({ length: STORIES_COUNT }, (_, story) =>
  fables
    .filter((fable) => fable.story === story)
    .flatMap(({ passages }) => passages.map(({ offset }) => store.vectorAt(offset))),
);
write("projection.ts", "Projection", "PROJECTION", fitProjection(groups));

store.writeVectors(Path.resolve(DATA_DIR, "vectors.dat"));
