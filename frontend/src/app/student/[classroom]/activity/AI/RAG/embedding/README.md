# Devine l'animal: how it works

A guessing game that shows students what an **embedding** is. The game secretly picks an animal. The student asks questions in plain French ("il a des plumes ?", "il vit en Afrique ?") or makes a guess ("c'est un lion ?"). The game does not parse the sentence. It turns it into a vector and looks for the closest known question or animal name.

This document explains the internal mechanics, for whoever has to change the data, tune the matching or replace the model.

## The idea in one paragraph

An embedding model turns a sentence into a vector of 384 numbers. Sentences with a similar meaning get vectors that point in similar directions, even with different words: "Combien de pattes a-t-il ?" and "il marche sur combien de pattes" end up close. We measure "close" with the **cosine similarity**, a number between -1 and 1 (1 = same direction). All the known questions and animal names are embedded **once**, when the data is generated. During the game, only the student's sentence has to be embedded, then compared to every precomputed vector.

## Files

```text
embedding/
├── page.tsx, page.module.css   The page: header, conversation, input, buttons.
├── info.fr.md                  Title and description shown in the activities list.
└── _/
    ├── model.ts                Model name, dtype, vector size and text prefix.
    │                           Shared by the browser AND the generator.
    ├── types.ts                `Animals` and `Questions` types.
    ├── source/                 What humans edit.
    │   ├── questions.ts        The questions, several wordings per question.
    │   ├── animals.ts          The 50 animals: names, facts and specific answers.
    │   └── templates.ts        Answers shared by all animals.
    ├── generate.mts            Script that builds `data/` from `source/`.
    ├── data/                   Generated: never edit by hand.
    │   ├── questions.ts        Questions with the offsets of their embeddings.
    │   ├── animals.ts          Animals with their answers and the offsets of their names.
    │   └── vectors.dat         All the embeddings, in binary.
    ├── vectors.ts              Decoding of `vectors.dat` and cosine similarity.
    ├── embedder.ts             Loads the model and `vectors.dat`, embeds a sentence.
    ├── game.ts                 Matching logic: question, guess, or "too vague".
    ├── hooks.ts                React state of the game.
    ├── Conversation/           The list of messages.
    ├── LoadingOverlay/         Progress bar shown while the model downloads.
    └── translation/            UI texts in fr, en, de and it.
```

The game content (questions and answers) is in French only. Only the UI texts are translated.

## The model

`Xenova/multilingual-e5-small` (see `_/model.ts`):

- **Size:** about 120 MB, quantized to 8 bits (`dtype: "q8"`).
- **Output:** vectors of 384 dimensions.
- **Prefix:** E5 models expect a prefix. We use `"query: "` for every text, because we compare a question with other questions (a symmetric task). `prepareText()` adds it.
- **Normalization:** the vectors are mean-pooled and normalized to a length of 1, so the cosine similarity is a plain dot product.

The browser and the generator **must** use the same model, dtype and prefix, otherwise the vectors are not comparable. That is why all of them live in `model.ts`.

## From sources to data: `npm run embeddings`

`generate.mts` runs with Node 24 or later (it needs `DataView.setFloat16`). The first run downloads the model into `node_modules/@huggingface/transformers/.cache`. Later runs take a few seconds.

### 1. Answers

For each animal and each question, the generator builds a list of at least **10 answers**. One of them is picked at random each time, for variety.

- **Shared answers** come from `templates.ts`. "$" is replaced by the animal's value: `"Il porte un habit $, taillé sur mesure par Dame Nature."` + `color: "jaune et noir"`.
- **Value questions** (legs, color, size, weight, sound) use the animal's value in the templates. For the legs, 0 has its own templates ("Aucune patte !").
- **Yes/no questions** use the `yes` or `no` templates, depending on the animal's fact. Missing facts are `false`.
- **Omnivores** get special answers for "Est-il carnivore ?" and "Est-il herbivore ?" ("Pas seulement…"), because neither yes nor no is correct.
- **Continents** share one set of templates, with "$" replaced by "en Afrique", "en Asie"…
- **Specific answers.** A fact can be written `[value, "answer", "answer"…]`. These answers are **added** to the shared ones. If there are 10 or more, they **replace** them. Use this for nuances: the platypus is a mammal that lays eggs, the hippo walks on the river bed instead of swimming.
- **Capitalization.** The generator capitalizes the start of each sentence, and drops the period after an exclamation (`« Groaaar ! »` instead of `« Groaaar ! ».`).

The answers never contain the animal's name: it must be guessed. They say "il" for every animal, so that the gender does not give a clue.

The generator stops with an error when an animal has fewer than 10 answers for a question, or when it does not have exactly one diet (carnivore, herbivore or omnivore).

### 2. Embeddings

The generator embeds two kinds of text:

- **Every wording of every question.** Each question has 5 to 8 wordings ("Peut-il voler ?", "Sait-il voler ?", "A-t-il des ailes ?"…). They all lead to the same answer. Students ask the same thing in many ways, and one vector per question is not enough to catch them all.
- **Every name of every animal, inside a question.** For example "Est-ce la lionne ?", and not just "la lionne". Students type guesses as questions ("c'est un lion ?"), and a bare word is far from a sentence in the vector space. When names were embedded alone, "c'est une poule ?" was matched to the fur question instead of the hen. The alternative names come from `aliases` in `source/animals.ts`: "la lionne", "le T-rex", "le poulpe"…

### 3. `vectors.dat`

All the vectors are written one after the other in `data/vectors.dat`:

- **Format:** 16-bit floats (float16), little-endian, with no header.
- **Size:** 384 values × 2 bytes = 768 bytes per vector. There are currently 377 vectors (about 290 KB).
- **Precision:** float16 keeps about 3 significant digits, which is plenty for values between -1 and 1. A stored question compared with its live embedding still scores 0.997. The difference comes from the 8-bit model as much as from float16.

`data/questions.ts` and `data/animals.ts` don't contain vectors, only **offsets**. An offset is the index of the first value of a vector, counted in values (not bytes), once the file is decoded as a `Float32Array`. Vector `n` starts at offset `n × 384`.

Keeping the vectors out of the TypeScript makes the JavaScript bundle much smaller. As text, each vector took about 3 KB, so about 1 MB for all of them. Binary data also doesn't need to be parsed by the JavaScript engine.

## In the browser

### Loading (`embedder.ts`)

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

Each reply shows the closest question (or name) and its similarity in small text. Students can see how the machine "understood" them, which is the point of the activity.

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
- **Close but different meanings** can be confused. "il mange du poisson ?" is answered as "Est-ce un poisson ?".
- **Tense:** extinct and imaginary animals are described in the present tense in the shared answers. Their specific answers correct this where it matters.

## How to…

### Add a wording to a question

Add it to the question's array in `source/questions.ts`, then run `npm run embeddings`. Every wording must expect the **same** answer. "Existe-t-il vraiment ?" cannot go with "Est-ce un animal imaginaire ?", because "Oui" would mean the opposite.

### Add a question

1. Add a key and its wordings in `source/questions.ts`.
2. **Yes/no question:** add the key to `BooleanKey` in `source/animals.ts`, its `yes` and `no` answers (at least 10 each) to `YES_NO` in `source/templates.ts`, and set the fact for the animals where it is true.
3. **Value question** (like color or sound): add a field to `AnimalFacts`, templates with "$", and a line in `makeAnswers()` in `generate.mts`.
4. Run `npm run embeddings`. It fails if an animal lacks answers.

### Add an animal

Add an entry in `source/animals.ts` with its name (with the article), aliases, legs, color, size, weight, sound, exactly one diet, and the facts that are true. Then run `npm run embeddings`.

### Change the model

1. Change `MODEL_ID`, `MODEL_DTYPE`, `EMBEDDING_SIZE` and `prepareText()` in `model.ts`, following the new model's documentation.
2. Run `npm run embeddings`. It fails if the vector size does not match `EMBEDDING_SIZE`.
3. Re-tune the constants in `game.ts`: every model has its own similarity range.
