import React from "react";
import {
  AutoModelForMaskedLM,
  AutoTokenizer,
  type PreTrainedModel,
  type PreTrainedTokenizer,
  type Tensor,
} from "@huggingface/transformers";

/**
 * Small French masked language model (≈ 110 Mo once quantized).
 * Beware: the ONNX files of "onnx-community/camembertv2-base" have no
 * masked-LM head (they only output `last_hidden_state`, no `logits`).
 */
const MODEL_ID = "Xenova/camembert-base";

export interface Prediction {
  word: string;
  probability: number;
}

/**
 * Raw scores (logits) given by the model to every word
 * that could fill the blank, sorted from the best to the worst.
 */
export interface Candidates {
  words: string[];
  logits: number[];
}

export type PredictorState =
  | { status: "loading"; progress: number }
  | { status: "error"; message: string }
  | { status: "ready"; predict: (sentence: string) => Promise<Candidates> };

interface Model {
  tokenizer: PreTrainedTokenizer;
  model: PreTrainedModel;
  /** For each token id, the word to display, or `null` if it cannot start a word. */
  words: (string | null)[];
}

let modelPromise: Promise<Model> | null = null;
const progressListeners = new Set<(progress: number) => void>();

/**
 * Load the model only once, even if the page is opened several times.
 */
function loadModel(): Promise<Model> {
  if (!modelPromise) {
    const progress_callback = (info: { status: string; progress?: number }) => {
      if (info.status === "progress_total" && typeof info.progress === "number") {
        for (const listener of progressListeners) listener(info.progress);
      }
    };
    modelPromise = Promise.all([
      AutoTokenizer.from_pretrained(MODEL_ID),
      AutoModelForMaskedLM.from_pretrained(MODEL_ID, { dtype: "q8", progress_callback }),
    ]).then(([tokenizer, model]) => ({ tokenizer, model, words: makeWords(tokenizer) }));
    modelPromise.catch(() => {
      // Allow a retry when the page is opened again.
      modelPromise = null;
    });
  }
  return modelPromise;
}

/**
 * In this SentencePiece tokenizer, the tokens that start a new word
 * begin with "▁". We only keep those, if they contain at least one letter
 * (to skip punctuation).
 */
function makeWords(tokenizer: PreTrainedTokenizer): (string | null)[] {
  const special = new Set(tokenizer.all_special_ids);
  const words: (string | null)[] = [];
  for (const [token, id] of tokenizer.get_vocab()) {
    const word = token.slice(1);
    words[id] = special.has(id) || !token.startsWith("▁") || !/\p{L}/u.test(word) ? null : word;
  }
  return words;
}

export function usePredictor(): PredictorState {
  const [state, setState] = React.useState<PredictorState>({ status: "loading", progress: 0 });
  React.useEffect(() => {
    let alive = true;
    const listener = (progress: number) => {
      if (alive) setState({ status: "loading", progress });
    };
    progressListeners.add(listener);
    loadModel()
      .then((model) => {
        if (alive) setState({ status: "ready", predict: (sentence) => predict(model, sentence) });
      })
      .catch((error: unknown) => {
        if (alive) setState({ status: "error", message: error instanceof Error ? error.message : String(error) });
      })
      .finally(() => progressListeners.delete(listener));
    return () => {
      alive = false;
      progressListeners.delete(listener);
    };
  }, []);
  return state;
}

async function predict({ tokenizer, model, words }: Model, sentence: string): Promise<Candidates> {
  const start = sentence.trim();
  // No space after an apostrophe: "Je bois l'[MASK]".
  const separator = /['’]$/.test(start) ? "" : " ";
  const inputs = tokenizer(`${start}${separator}${tokenizer.mask_token}`);
  const ids = Array.from(inputs.input_ids.data as BigInt64Array, Number);
  const maskIndex = ids.indexOf(tokenizer.mask_token_id);
  const { logits } = (await model(inputs)) as { logits: Tensor };
  const vocabSize = logits.dims[2];
  const row = (logits.data as Float32Array).subarray(maskIndex * vocabSize, (maskIndex + 1) * vocabSize);
  const candidates: { word: string; logit: number }[] = [];
  row.forEach((logit, id) => {
    const word = words[id];
    if (word !== null && word !== undefined) candidates.push({ word, logit });
  });
  candidates.sort((a, b) => b.logit - a.logit);
  return {
    words: candidates.map(({ word }) => word),
    logits: candidates.map(({ logit }) => logit),
  };
}

/**
 * Softmax with temperature: `p(i) = exp(logit(i) / T) / Σ exp(logit(j) / T)`.
 * The ranking of the words never changes, only their probabilities.
 * Returns the `count` most probable words.
 */
export function applyTemperature({ words, logits }: Candidates, temperature: number, count: number): Prediction[] {
  const max = logits[0] ?? 0;
  const exps = logits.map((logit) => Math.exp((logit - max) / temperature));
  const sum = exps.reduce((total, value) => total + value, 0);
  return words.slice(0, count).map((word, index) => ({ word, probability: exps[index] / sum }));
}
