import { pipeline, type TokenClassificationPipeline } from "@huggingface/transformers";

/**
 * French PII detector "Anonym-IA/V2-camembert-ner-pii-french" (≈ 445 Mo).
 * The original repository has no ONNX file, so we use its conversion.
 * Beware: the int8 conversion misses most entities and the fp16 one cannot be loaded.
 * It tags each token with a BIO label: "B-NOM_PERSONNE", "I-NOM_PERSONNE", "O"…
 */
const MODEL_ID = "Anonym-IA/V2-camembert-ner-pii-onnx-fp32";

/**
 * Personal data found in the text, as character offsets.
 */
export interface Entity {
  start: number;
  end: number;
  /** "NOM_PERSONNE", "EMAIL", "TELEPHONE"… */
  category: string;
}

/**
 * @param progress Percentage of the download, between 0 and 100.
 * @param remaining Estimated number of seconds before the end of the download,
 * or `null` if it is too early to know.
 */
export type ProgressListener = (progress: number, remaining: number | null) => void;

/** Do not estimate the remaining time before this delay (in ms): it would be too random. */
const MIN_ELAPSED_FOR_ESTIMATION = 2000;

let modelPromise: Promise<TokenClassificationPipeline> | null = null;
const progressListeners = new Set<ProgressListener>();

export function addProgressListener(listener: ProgressListener) {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

/**
 * Load the model only once, even if the page is opened several times.
 */
export function loadModel(): Promise<TokenClassificationPipeline> {
  if (!modelPromise) {
    const startTime = Date.now();
    const progress_callback = (info: { status: string; progress?: number }) => {
      if (info.status !== "progress_total" || typeof info.progress !== "number") return;

      const { progress } = info;
      const elapsed = Date.now() - startTime;
      // We assume the download speed stays constant.
      const remaining =
        progress > 0 && elapsed > MIN_ELAPSED_FOR_ESTIMATION
          ? (elapsed * (100 - progress)) / progress / 1000
          : null;
      for (const listener of progressListeners) listener(progress, remaining);
    };
    modelPromise = pipeline("token-classification", MODEL_ID, {
      dtype: "fp32",
      progress_callback,
    }) as Promise<TokenClassificationPipeline>;
    modelPromise.catch(() => {
      // Allow a retry when the page is opened again.
      modelPromise = null;
    });
  }
  return modelPromise;
}

/**
 * The model cannot read more than 512 tokens at once.
 * But it needs context, so we give it as many whole paragraphs as possible.
 */
const MAX_TOKENS = 480;

export async function detect(ner: TokenClassificationPipeline, text: string): Promise<Entity[]> {
  const entities: Entity[] = [];
  for (const [start, end] of splitChunks(ner, text)) {
    for (const entity of await detectChunk(ner, text.slice(start, end))) {
      entities.push({ ...entity, start: entity.start + start, end: entity.end + start });
    }
  }
  return entities;
}

/**
 * Cut the text between paragraphs, in chunks of at most `MAX_TOKENS` tokens
 * (unless a single paragraph is longer: the model will just ignore its end).
 */
function splitChunks(ner: TokenClassificationPipeline, text: string): Array<[start: number, end: number]> {
  const cuts = [0];
  const separator = /\n\s*\n/g;
  for (let match = separator.exec(text); match; match = separator.exec(text)) cuts.push(match.index);
  cuts.push(text.length);
  const countTokens = (start: number, end: number) => ner.tokenizer(text.slice(start, end)).input_ids.size;
  const chunks: Array<[number, number]> = [];
  let start = 0;
  for (let i = 1; i < cuts.length; i++) {
    const end = cuts[i];
    const next = cuts[i + 1];
    if (next === undefined || countTokens(start, next) > MAX_TOKENS) {
      chunks.push([start, end]);
      start = end;
    }
  }
  return chunks;
}

async function detectChunk(ner: TokenClassificationPipeline, text: string): Promise<Entity[]> {
  const offsets = tokenOffsets(ner, text);
  const tokens = await ner(text);
  const entities: Entity[] = [];
  for (const { entity, index } of tokens) {
    const range = offsets[index];
    if (!range) continue;

    const [start, end] = range;
    const [prefix, category] = splitLabel(entity);
    const last: Entity | undefined = entities[entities.length - 1];
    const gap = last ? text.slice(last.end, start) : "";
    // Sub-word pieces glued to the previous entity continue it, whatever their label:
    // a word cannot be split in two categories.
    // "I-" continues the previous entity across spaces.
    if (last && (gap === "" || (last.category === category && prefix === "I" && gap.trim() === ""))) {
      last.end = end;
    } else {
      entities.push({ start, end, category });
    }
  }
  return expandToWords(text, entities).map((entity) => trimMarkup(text, entity));
}

/**
 * The model sometimes includes Markdown markup or punctuation
 * around an entity: "Jean Dupont**", "+41 79 123 45 67\n-".
 */
function trimMarkup(text: string, entity: Entity): Entity {
  let { start, end } = entity;
  while (start < end && /[\s*_#>-]/.test(text.charAt(start))) start++;
  while (end > start && /[\s*_#>.,;:-]/.test(text.charAt(end - 1))) end--;
  return { ...entity, start, end };
}

/**
 * The model can tag a single piece in the middle of a word ("Sup3r[S]3cret").
 * We extend every entity to the whole words it touches.
 * The model also often forgets the punctuation inside an entity ("jean" "." "dupont"),
 * or cuts it at a space ("CH93" "0076 2011").
 */
function expandToWords(text: string, entities: Entity[]): Entity[] {
  const isWordChar = (index: number) => /[\p{L}\p{N}]/u.test(text.charAt(index));
  const result: Entity[] = [];
  for (const entity of entities) {
    let { start, end } = entity;
    while (start > 0 && isWordChar(start - 1)) start--;
    while (end < text.length && isWordChar(end)) end++;
    const last: Entity | undefined = result[result.length - 1];
    const glued =
      last?.category === entity.category && /^([^\s\p{L}\p{N}]{1,2}| )$/u.test(text.slice(last.end, start));
    if (last && (start < last.end || glued)) {
      last.end = Math.max(last.end, end);
    } else {
      result.push({ ...entity, start, end });
    }
  }
  return result;
}

function splitLabel(label: string): [prefix: string, category: string] {
  const match = /^([BIES])-(.+)$/.exec(label);
  return match ? [match[1], match[2]] : ["B", label];
}

/**
 * transformers.js does not give the position of the tokens in the text.
 * We find them by looking for each decoded token right after the previous one.
 * Only whitespaces are allowed between two tokens, otherwise the token has no range.
 * Except after a token we could not find: characters missing from the vocabulary
 * (like "`") become "<unk>" and we cannot know their length.
 */
function tokenOffsets(ner: TokenClassificationPipeline, text: string): Array<[number, number] | null> {
  const { tokenizer } = ner;
  const special = new Set(tokenizer.all_special_ids);
  const ids = Array.from(tokenizer(text).input_ids.data as BigInt64Array, Number);
  let cursor = 0;
  let lost = false;
  return ids.map((id) => {
    const piece = special.has(id) ? "" : tokenizer.decode([id]).trim();
    if (piece.length === 0) return null;

    const start = text.indexOf(piece, cursor);
    if (start < 0) {
      lost = true;
      return null;
    }
    if (!lost && text.slice(cursor, start).trim() !== "") return null;

    cursor = start + piece.length;
    lost = false;
    return [start, cursor];
  });
}
