# Retrouve la fable: how it works

A semantic search engine on 82 fables: 41 stories, each told by an ancient author (Ésope, or Phèdre for one story) and by La Fontaine. The student describes a fable in their own words ("un oiseau se fait voler son repas par un flatteur"), and the page shows the 3 closest fables. This is the **retrieval** part of a RAG (Retrieval-Augmented Generation): nothing is generated, because no language model runs in the browser.

It uses the same model and the same 3D view as "Devine l'animal" (`../embedding/`). Read its README first: this one only explains what is different.

## Files

```text
embedding2/
├── page.tsx, page.module.css   The page: the search on the left, the 3D view on the right.
├── info.fr.md                  Title and description shown in the activities list.
└── _/
    ├── types.ts                `Fables` type: fables with their passages.
    ├── source/fables.ts        What humans edit: the texts, titles, links and summaries.
    ├── source/rewordings.ts    What humans edit: two rewordings of each chunk, in modern French.
    ├── segment.ts              Cuts a fable into chunks (tested by `segment.test.ts`).
    ├── generate.mts            Script that builds `data/` from `source/`.
    ├── data/                   Generated: never edit by hand.
    │   ├── fables.ts           Fables with their passages and the offsets of their embeddings.
    │   ├── projection.ts       Mean and axes of the 3D projection (Fisher LDA).
    │   └── vectors.dat         All the embeddings, in binary.
    ├── search.ts               Ranking of the fables and confidence.
    ├── scene.ts                The passages, placed in the 3D view.
    ├── hooks.ts                React state of the search.
    ├── Results/                The 3 closest fables, each one expandable (`Result/`).
    └── translation/            UI texts in fr, en, de and it.
```

The shared code (model, loading, 3D view, generator helpers) is in `../_/`.

## The texts

- **Ésope:** translation by Émile Chambry (1927), from `Fables d’Ésope (trad. Chambry, 1927)` on Wikisource.
- **Phèdre:** translation by Ernest Panckoucke (1864), from `Fables (Phèdre, Panckoucke)` on Wikisource. Only for "La Grenouille et le Bœuf" (I, 24): Ésope's fables have no version of La Fontaine's "La Grenouille qui veut se faire aussi grosse que le Bœuf". Phèdre, a Latin author, wrote this story in verse; the translation is in prose, and gives the moral **before** the story.
- **La Fontaine:** edition of 1874 (Bernardin-Béchet), from `Fables de La Fontaine (éd. 1874)` on Wikisource.

Both are in the public domain. The texts were downloaded once with the Wikisource API, and cleaned: maintenance messages of Wikisource removed, hard line breaks of the prose removed, and the page breaks of La Fontaine removed (they sometimes fall in the middle of a sentence). In `source/fables.ts`, verses are separated by `\n` and paragraphs by `\n\n`.

Some fables of La Fontaine start with a dedication or an introduction that has nothing to do with the story: "Le Bûcheron et Mercure" (about his art of writing fables), "Le Lion amoureux" (to Mademoiselle de Sévigné), "Le Vieillard et ses Enfants" (about Ésope and Phèdre). They are kept: they are part of the text, and they show students that a document is not always about one topic only.

## Passages: what is embedded

Each fable is embedded in three ways:

| Kind      | What                                                      | Sphere in the 3D view |
| --------- | --------------------------------------------------------- | --------------------- |
| `whole`   | The whole text.                                           | normal                |
| `summary` | 3 summaries in modern French, with the moral.             | normal                |
| `chunk`   | A few verses or sentences (see below), with 2 rewordings. | half the radius       |

**Chunks** (`segment.ts`):

- **La Fontaine (verse):** 4 verses per chunk, each chunk starting with the last verse of the previous one.
- **Ésope and Phèdre (prose):** 3 sentences per chunk, overlapping by 1 sentence. The moral is a paragraph of its own, and a chunk of its own: the last paragraph for Ésope ("Cette fable montre que…"), the first one for Phèdre.

The overlap avoids cutting an idea in two without any chunk that contains it whole. There are 683 passages in all: 82 whole texts, 246 summaries and 515 chunks. With the 1,030 rewordings of the chunks, that makes 1,873 vectors (about 1.4 MB).

**Why summaries?** The student writes in modern French, and the fables are in 17th-century verse or in a 1927 translation. Their vocabularies are far apart: "un oiseau se fait voler son repas" is not close to "Maître corbeau, sur un arbre perché". The summaries, written for this activity, bridge the gap. In the tests, they are the closest passage most of the time. They are clearly labeled as "not by the author" in the results. Enriching documents this way is common in real RAG systems.

Each fable has **3 summaries**, written with different words: the first one tells the story with its own characters and objects, the second one with generic words a student would use ("un oiseau", "de la nourriture", "un flatteur"), the third one explains the moral in everyday words. The morals of the two versions of a story are written in comparable terms, because the activity shows that their meaning is the same.

**Rewordings of the chunks** (`source/rewordings.ts`): each chunk has 2 rewordings in modern French, one faithful paraphrase with explicit characters ("Il ouvre un large bec" → "Le corbeau ouvre son bec et lâche le fromage"), one with generic words. They are embedded next to their chunk, but they are **never shown**: a chunk is as close as the closest of its text and its rewordings, and the result always shows the original chunk (with a note saying that a rewording matched). They are not drawn in the 3D view either. Each entry of `source/rewordings.ts` repeats the text of its chunk: the generator stops with an error if it does not match the segmentation, so that rewordings can never be attached to the wrong chunk.

Measured with 22 generic sentences ("un oiseau se fait voler son repas par un flatteur", "un animal lent gagne une course…"), the summaries and rewordings put **both versions** of the story in the top 3 for 16 sentences instead of 9, and the right story first for 21 instead of 17. Stories whose two versions really differ remain hard: in "Le Bouvier et Héraclès", Ésope's text is only a few lines long; "Le Coq et le Renard" has a different moral in each version.

**Whole texts** are truncated by the model after 512 tokens (about 300 words): the end of the longest fables is not taken into account. Their vector is an average of many ideas, so it is rarely the closest.

**Prefixes.** E5 models are trained for this task: the passages are embedded with the prefix `"passage: "`, and the student's sentence with `"query: "` (`prepareText()` in `../_/model.ts`).

## Search (`search.ts`)

1. **Embed** the student's sentence.
2. **Score of a fable:** the similarity of its closest passage, whatever its kind. For a chunk, the closest of its text and its 2 rewordings.
3. **Rank** the fables and keep the first 3.
4. **Confidence:** a softmax of the scores of all the fables, with a temperature of 0.01: `exp((score − best) / 0.01)`, divided by the sum over all fables. The confidences add up to 100%.

As in "Devine l'animal", similarities are always high with this model (about 0.78 for the farthest fable, 0.85–0.90 for a good match), so a raw similarity means nothing to students. The softmax turns the **margin** over the other fables into a percentage: a fable 0.03 ahead of the others gets most of the confidence.

The two versions of a story are often both in the top 3, with close scores: they share the confidence. With "un oiseau retire un os de la gorge d'un loup", Ésope's heron gets 87% and La Fontaine's stork 7%. With "le vent et le soleil font un pari", the two versions get 47% and 32%. That is expected: they tell the same story.

### Tuning

The temperature was tuned with about 25 sentences: descriptions of a story, morals ("l'union fait la force"), and off-topic sentences ("j'aime les frites"). With French sentences, the right story was in the top 3 for 22 of 24 descriptions. With 0.01, off-topic sentences get 9 to 15% at most, and good matches usually between 20 and 90%. A good match gets less when another fable is almost as close: "il dit que les fruits ne sont pas mûrs parce qu'il ne peut pas les attraper" finds the fox and the grapes first, but with only 7%. A lower temperature (0.005) gives 41% to "j'aime les frites", which looks like a real answer.

Checked again after adding the rewordings and the extra summaries: with 0.01, off-topic sentences get 11% at most, "un oiseau se fait voler son repas par un flatteur" gives 77% to Ésope's crow (44% before), and "l'union fait la force" splits the confidence between the two versions of the story (35% and 30%).

To re-tune: write a temporary script that loads `data/fables.ts`, decodes `data/vectors.dat`, embeds test sentences with the prefix `"query: "`, and prints the top 3 with their confidence for several temperatures.

### Known limits

- **Other languages:** the model is multilingual, but small. "a fox tricks a crow into dropping its cheese" does not find the crow, and neither does the same sentence in Italian. That is why the UI asks for a sentence in French in every language.
- **Close stories** are confused when the description is vague: several fables have a fox, a lion, a wolf, or a man who prays to a god.
- **A short description of a detail** can match a chunk of an unrelated fable: "un déguisement de lion" puts "Le Lion amoureux" second, because of a chunk about the lion.

## The 3D view

The same view as "Devine l'animal" (`../_/VectorsView/`), with:

- **One point per passage**, colored by **story**: the two versions of a story (Ésope or Phèdre, and La Fontaine) have the same color, also shown as a dot next to each result. Chunks are half the size of the whole texts and summaries.
- **The LDA groups are the stories:** all the passages of both versions of a story form a group. The view therefore shows that two texts written 2,000 years apart, one in prose and one in verse, have close meanings.
- **The links** go to the closest passage of each of the 3 fables found (green), and to the closest passage of the farthest fable (red).

## How to…

### Change a summary or a text

Edit `source/fables.ts`, then run `npm run embeddings:fables`. If you change a text, the chunks change too: update their entries in `source/rewordings.ts` (the generator tells you which one does not match).

### Add a fable

Add an entry to `source/fables.ts`, with a `story` index, and the rewordings of its chunks to `source/rewordings.ts`. Both versions of a story must have the same index, and the generator stops with an error if a story does not have exactly one fable by La Fontaine and one by Ésope or Phèdre. Use Phèdre (`author: "phedre"`) only when Ésope has no version of the story. To add a story, also increase `STORIES_COUNT` in `generate.mts`.

### Change the chunks

Change the constants of `segment.ts`, run `npx vitest run segment`, rewrite `source/rewordings.ts` (all the chunks change), run `npm run embeddings:fables`, then check the search again (see [Tuning](#tuning)).
