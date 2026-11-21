# Devine l'animal: how it works

A guessing game that shows students what an **embedding** is. The game secretly picks an animal. The student asks questions in plain French ("il a des plumes ?", "il vit en Afrique ?") or makes a guess ("c'est un lion ?"). The game does not parse the sentence. It turns it into a vector and looks for the closest known question or animal name.

This document explains the internal mechanics, for whoever has to change the data, tune the matching or replace the model.

## The idea in one paragraph

An embedding model turns a sentence into a vector of 384 numbers. Sentences with a similar meaning get vectors that point in similar directions, even with different words: "Combien de pattes a-t-il ?" and "il marche sur combien de pattes" end up close. We measure "close" with the **cosine similarity**, a number between -1 and 1 (1 = same direction). All the known questions and animal names are embedded **once**, when the data is generated. During the game, only the student's sentence has to be embedded, then compared to every precomputed vector.

## Files

The model, the 3D view and the loading are shared with the activity "Retrouve la fable"
(`../embedding2/`): they live in `../_/`.

```text
RAG/_/                          Shared by the RAG activities.
├── model.ts                    Model name, dtype, vector size and text prefix.
│                               Shared by the browser AND the generators.
├── generator.mts               Helpers for the generators: embedding, `vectors.dat`, projection.
├── lda.ts                      Fisher LDA, used by the generators for the 3D view.
├── projection.ts               Places an embedding in the 3D view.
├── vectors.ts                  Decoding of `vectors.dat` and cosine similarity.
├── embedder.ts                 Loads the model and a `vectors.dat`, embeds a sentence.
├── hooks.ts                    `useEmbedder()`: loading state of the model.
├── LoadingOverlay/             Progress bar shown while the model downloads.
└── VectorsView/                The 3D view of the embeddings and the student's sentence.

embedding/
├── page.tsx, page.module.css   The page: the game on the left, the 3D view on the right.
├── info.fr.md                  Title and description shown in the activities list.
└── _/
    ├── types.ts                `Animals` and `Questions` types.
    ├── source/                 What humans edit.
    │   ├── questions.ts        The questions, several wordings per question.
    │   ├── animals.ts          The 50 animals: names, facts and specific answers.
    │   └── templates.ts        Answers shared by all animals.
    ├── generate.mts            Script that builds `data/` from `source/`.
    ├── data/                   Generated: never edit by hand.
    │   ├── questions.ts        Questions with the offsets of their embeddings.
    │   ├── animals.ts          Animals with their answers and the offsets of their names.
    │   ├── projection.ts       Mean and axes of the 3D projection (Fisher LDA).
    │   └── vectors.dat         All the embeddings, in binary.
    ├── game.ts                 Matching logic: question, guess, or "too vague".
    ├── scene.ts                The wordings of the questions, placed in the 3D view.
    ├── hooks.ts                React state of the game.
    ├── Conversation/           The list of messages.
    │   └── Analysis/           Grammatical analysis shown under each question (experimental).
    ├── syntax/                 Normalization, part-of-speech tagging and word groups.
    └── translation/            UI texts in fr, en, de and it.
```

The game content (questions and answers) is in French only. Only the UI texts are translated.

## The model

`Xenova/multilingual-e5-small` (see `../_/model.ts`):

- **Size:** about 120 MB, quantized to 8 bits (`dtype: "q8"`).
- **Output:** vectors of 384 dimensions.
- **Prefix:** E5 models expect a prefix. We use `"query: "` for every text, because we compare a question with other questions (a symmetric task). `prepareText()` adds it.
- **Normalization:** the vectors are mean-pooled and normalized to a length of 1, so the cosine similarity is a plain dot product.

The browser and the generator **must** use the same model, dtype and prefix, otherwise the vectors are not comparable. That is why all of them live in `../_/model.ts`, shared by both RAG activities.

## From sources to data: `npm run embeddings`

`generate.mts` runs with Node 24 or later (it needs `DataView.setFloat16`). The first run downloads the model into `node_modules/@huggingface/transformers/.cache`. Later runs take a few seconds.

### 1. Answers

For each animal and each question, the generator builds a list of at least **10 answers**. One of them is picked at random each time, for variety.

- **Shared answers** come from `templates.ts`. "$" is replaced by the animal's value: `"Il porte un habit $, taillé sur mesure par Dame Nature."` + `color: "jaune et noir"`.
- **Value questions** (legs, color, size, weight, sound) use the animal's value in the templates. For the legs, 0 has its own templates ("Aucune patte !").
- **Yes/no questions** use the `yes` or `no` templates, depending on the animal's fact. Missing facts are `false`.
- **Opposite questions.** "Est-il pacifique ?" is the opposite of "Est-il agressif ?". They are two different questions, because the same answer cannot fit both ("Oui" would mean the opposite). To avoid writing every fact twice, `OPPOSITES` in `generate.mts` says that a missing `peaceful` fact is the opposite of `aggressive`. Only the value is taken, not the specific answers, because they answer the other question. Set `peaceful` explicitly when the opposite is wrong: the wolf is not aggressive, but it is not peaceful either.
- **Omnivores** get special answers for "Est-il carnivore ?" and "Est-il herbivore ?" ("Pas seulement…"), because neither yes nor no is correct.
- **Continents** share one set of templates, with "$" replaced by "en Afrique", "en Asie"…
- **Specific answers.** A fact can be written `[value, "answer", "answer"…]`. These answers are **added** to the shared ones. If there are 10 or more, they **replace** them. Use this for nuances: the platypus is a mammal that lays eggs, the hippo walks on the river bed instead of swimming.
- **Capitalization.** The generator capitalizes the start of each sentence, and drops the period after an exclamation (`« Groaaar ! »` instead of `« Groaaar ! ».`).

The answers never contain the animal's name: it must be guessed. They say "il" for every animal, so that the gender does not give a clue.

The generator stops with an error when an animal has fewer than 10 answers for a question, or when it does not have exactly one diet (carnivore, herbivore or omnivore).

### 2. Embeddings

The generator embeds two kinds of text:

- **Every wording of every question.** Each question has 9 to 11 wordings ("Peut-il voler ?", "Sait-il voler ?", "A-t-il des ailes ?"…). They all lead to the same answer. Students ask the same thing in many ways, and one vector per question is not enough to catch them all.
- **Every name of every animal, inside a question.** For example "Est-ce la lionne ?", and not just "la lionne". Students type guesses as questions ("c'est un lion ?"), and a bare word is far from a sentence in the vector space. When names were embedded alone, "c'est une poule ?" was matched to the fur question instead of the hen. The alternative names come from `aliases` in `source/animals.ts`: "la lionne", "le T-rex", "le poulpe"…

### 3. The 3D projection

The generator also computes how to draw the 384-dimension vectors in 3D, and writes it in `data/projection.ts`. See [The 3D view](#the-3d-view).

### 4. `vectors.dat`

All the vectors are written one after the other in `data/vectors.dat`:

- **Format:** 16-bit floats (float16), little-endian, with no header.
- **Size:** 384 values × 2 bytes = 768 bytes per vector. There are currently 673 vectors (about 517 KB).
- **Precision:** float16 keeps about 3 significant digits, which is plenty for values between -1 and 1. A stored question compared with its live embedding still scores 0.997. The difference comes from the 8-bit model as much as from float16.

`data/questions.ts` and `data/animals.ts` don't contain vectors, only **offsets**. An offset is the index of the first value of a vector, counted in values (not bytes), once the file is decoded as a `Float32Array`. Vector `n` starts at offset `n × 384`.

Keeping the vectors out of the TypeScript makes the JavaScript bundle much smaller. As text, each vector took about 3 KB, so about 1 MB for all of them. Binary data also doesn't need to be parsed by the JavaScript engine.

## In the browser

### Loading (`../_/embedder.ts`)

`loadModel()` downloads two things in parallel:

1. **The model,** with transformers.js. The browser caches it, so the next visits are fast.
2. **`vectors.dat`.** rspack copies it to `bin/vectors.[hash].dat` (rule for `.dat` files in `rspack.config.js`), and the `import` gives its URL. `decodeVectors()` turns it into a `Float32Array`. The decoding is done by hand, because `Float16Array` is not available in every browser yet.

The promise is kept in a module variable, so the model is loaded only once even if the page is opened several times. It is reset after an error, to allow a retry.

**Progress.** transformers.js reports `progress_total` events. `LoadingOverlay` shows the percentage and an estimate of the remaining time. The estimate assumes the speed stays constant: `elapsed × (100 − progress) / progress`. It starts only after 2 seconds, because before that it is too random. `vectors.dat` is too small to be worth tracking.

### Answering (`game.ts`)

For each sentence of the student:

1. **Embed** the sentence with the model.
2. **Best question.** For each question, keep the similarity of its **closest wording**. Rank the questions.
3. **Best animal.** For each animal, keep the similarity of its **closest name**. Rank the animals.
4. **Decide:**
   - **Guess:** if the best animal scores ≥ 0.905, is ahead of the next animal by ≥ 0.02, and scores at least as high as the best question. The student wins if it is the hidden animal; otherwise the game answers "Non, ce n'est pas…".
   - **Answer:** otherwise, if the best question scores ≥ 0.9 and is ahead of the next **question** by ≥ 0.01. The game picks one of the hidden animal's answers to that question.
   - **Too vague:** otherwise, randomly "Soyez plus précis dans votre question." or "Votre question est un peu vague."

5. **Almost the same, but understood differently?** Compare the sentence with the student's previous sentences of the current game (`findRepeat()`). If the closest one scores ≥ 0.94 but was understood differently (another question, another animal, or "too vague" on one side only, see `understandingOf()`), the answer is followed by "Tu as déjà posé une question presque identique !" in a box of a different color. Its small text shows the previous sentence, the similarity between the two sentences, and what the previous one was understood as. Two sentences that look almost the same can get different answers: "il vit en Afrique ?" and "il vit en Amérique ?" score 0.941. The box draws the students' attention to it.

Each reply shows the closest question (or name) and its similarity in small text. Students can see how the machine "understood" them, which is the point of the activity.

#### The threshold for "almost the same"

It compares two sentences of the student, not a sentence with a known question. It does not tell whether they ask the same thing: only the matching does. It tells whether they look almost the same. Most rewordings of the same question score between 0.94 and 0.99 ("Il vole ?" and "Peut-il voler ?": 0.943), and so do some sentences that ask different things ("il vit en Afrique ?" and "il vit en Amérique ?": 0.941). That second case is what the box is for. Sentences that look more different are not compared: "Il mord" and "Est-ce qu'il mord ?" only score 0.905.

#### Why a margin, and not only a threshold?

With this model, even unrelated sentences score around 0.85, and real matches score between 0.90 and 0.99. A threshold alone does not separate them. "Est-il dangereux ?" used to score 0.92 with "Est-il diurne ?", higher than some correct matches.

The margin helps: when a sentence really matches a question, it is clearly closer to it than to any other. When it matches nothing, several questions score about the same. The margin is computed between **different** questions. Two wordings of the same question are naturally close, and must not cancel each other out.

#### Tuning

The four constants at the top of `game.ts` were tuned by running about 40 test sentences: questions not in the list, guesses, and off-topic sentences like "bonjour", "il est gentil ?" or "j'aime les frites". There is no automated test, because it would need the model. To re-tune:

1. Write a temporary vitest file that loads the model, decodes `data/vectors.dat` with `decodeVectors()`, and calls `reply()` on a list of sentences.
2. Print the type, the similarity and the matched question or name for each.
3. Adjust the constants, then delete the file.

When a reasonable question is not understood, prefer **adding a wording** to `source/questions.ts` over lowering the thresholds.

#### Known limits

- **Animals that are not in the game** get a wrong answer. "c'est un hibou ?" is answered as the hibernation question, and "c'est un pingouin ?" as the size question. The owl and the penguin are in the game, but "hibou" and "pingouin" are deliberately not aliases, because they are different animals.
- **Close but different meanings** can be confused. "il mange du poisson ?" is answered as "Est-ce un poisson ?". "il a des griffes ?" is "too vague", because it is as close to the retractable claws as to "Il griffe ?". "il marche ?" and "il se déplace comment ?" are "too vague" too: they are as close to "Il court ?" as to "Il rampe ?" or "Il saute ?". There is no question about walking, because almost every animal walks.
- **Tense:** extinct and imaginary animals are described in the present tense in the shared answers. Their specific answers correct this where it matters.

## Grammatical analysis (experimental)

The goal is to make the matching more reliable by cutting the question into groups (action, complement…) and matching each group in a smaller space. For now, the analysis is only **displayed** under each question of the student. It does not change the answer.

Everything runs in the browser, so the Python parsers (spaCy, Stanza…) cannot be used. Instead, `syntax/` does it in three steps:

1. **Normalization** (`normalize.ts`): the question is lowercased and rewritten as a statement ("Mange-t-il de la viande ?" → "il mange de la viande ?"). The tagging model has been trained on newspapers: on inverted questions, it takes "Vit" for a noun and cuts "Mange" into "M" + "ange".
2. **Part-of-speech tagging** (`tagger.ts`, `words.ts`): the model `Xenova/french-camembert-postag-model` (≈ 110 Mo, French only) gives each word a tag of the French Treebank (`V`, `NC`, `DET`, `P`, `CLS`…). It is downloaded in the background once the embedding model is ready.
3. **Word groups** (`groups.ts`): simple rules on the tags make the groups subject, action, complement, question and link.

Hover a word or a group to see its name. Known limits: there is no real syntactic parser, so all the groups after the verb are "complements" ("de la viande" and "la nuit" alike), and the question word is not moved ("combien de pattes il a ?").

## The 3D view

`VectorsView` (in `../_/`) draws every wording of every question as a point, with one color per question. When the student types a sentence, it appears as a bigger point, linked to its **3 nearest questions**, each labeled with its similarity. Students can drag to rotate the view, use the wheel to zoom, and hover over a point to read its wording. The animals' names are not shown: 91 groups would be too crowded.

The spheres, the links and the cube are painted with WebGL by `@tolokoban/tgd` (`VectorsView/renderer.ts` and `painters.ts`). The colors come from a palette texture with one pixel per color. The highlighted objects (the sentence, its nearest questions, the links between them, and the hovered question) glow. `bloom.ts` paints the scene in a framebuffer, and the highlighted objects in another one at a quarter of the resolution, cleared to opaque black so that nothing else glows. This glow is blurred, then a last filter paints the scene on the canvas and adds the glow. While a sentence is shown, this filter also dims and desaturates the scene, so that the glowing objects stand out. WebGL cannot write text, so the labels are drawn on a transparent 2D canvas on top of it (`overlay.ts`), at the positions given by `camera.apply()`. `scene.ts` gives the view its points: one per wording, colored by question.

### Why a Fisher LDA, and not a PCA?

Only a **linear** projection can place the student's sentence on the fly, with 3 dot products: `coordinate[k] = (vector − mean) · axes[k] − center[k]` (`projection.ts`). That rules out t-SNE and UMAP.

A PCA was tried first, and it does not work with this data. 3 axes keep only 13% of the variance, and a wording's nearest neighbour in 3D belongs to the same question only 8.5% of the time. The clouds of wordings are lost in the noise.

The **Fisher LDA** (`lda.ts`) uses the groups: it looks for the directions where the questions are far from each other while each question's wordings stay close together. In 3D, the nearest neighbour is then in the same group 69% of the time, about as often as in 384 dimensions. A shrinkage of the within-group scatter limits overfitting: the LDA is fitted on the wordings, but must also place sentences it has never seen.

Each axis is scaled and shifted so that the questions span exactly [-1, +1]: the cloud is centered in the view. The axes have no meaning of their own.

### Keep in mind

The 3D view is a shadow of the real space. Two points can look close in 3D and be far apart in 384 dimensions. That is why the lines show the **real** similarity, computed in 384 dimensions: it is the one the game uses.

## How to…

### Add a wording to a question

Add it to the question's array in `source/questions.ts`, then run `npm run embeddings`. Every wording must expect the **same** answer. "Existe-t-il vraiment ?" cannot go with "Est-ce un animal imaginaire ?", because "Oui" would mean the opposite.

### Add a question

1. Add a key and its wordings in `source/questions.ts`.
2. **Yes/no question:** add the key to `BooleanKey` in `source/animals.ts`, its `yes` and `no` answers (at least 10 each) to `YES_NO` in `source/templates.ts`, and set the fact for the animals where it is true. If it is the opposite of another question, add it to `OPPOSITES` in `generate.mts`.
3. **Value question** (like color or sound): add a field to `AnimalFacts`, templates with "$", and a line in `makeAnswers()` in `generate.mts`.
4. Run `npm run embeddings`. It fails if an animal lacks answers.

### Add an animal

Add an entry in `source/animals.ts` with its name (with the article), aliases, legs, color, size, weight, sound, exactly one diet, and the facts that are true. Then run `npm run embeddings`.

### Change the model

1. Change `MODEL_ID`, `MODEL_DTYPE`, `EMBEDDING_SIZE` and `prepareText()` in `../_/model.ts`, following the new model's documentation. It changes both RAG activities: run `npm run embeddings:fables` too.
2. Run `npm run embeddings`. It fails if the vector size does not match `EMBEDDING_SIZE`. It also recomputes the 3D projection.
3. Re-tune the constants in `game.ts`: every model has its own similarity range.
