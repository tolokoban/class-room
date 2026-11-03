/**
 * Train the perceptron with the 10'000 images of the MNIST test set,
 * and write its weights in `weights.ts`.
 *
 * The images go through the same steps as the webcam (see `Retina/retina.ts`):
 * enlarged to `CAPTURE`×`CAPTURE` pixels, turned into ink or background, and framed.
 * Then the perceptron learns them with `learn()`, like in the activity, but with a smaller learning rate
 * and without random transformations: they shift the framed digits and lower the accuracy
 * (89% instead of 78% on the validation images).
 *
 * Only run it again if you change the model or the framing:
 *   npm run perceptron -- path/to/t10k-images-idx3-ubyte.gz path/to/t10k-labels-idx1-ubyte.gz
 * The files can be downloaded from https://storage.googleapis.com/cvdf-datasets/mnist/
 */
import FS from "node:fs";
import { registerHooks } from "node:module";
import Path from "node:path";
import Zlib from "node:zlib";

// The modules of the activity import each other without the `.ts` extension, as the bundler allows.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (ex) {
      if (!specifier.startsWith(".")) throw ex;

      return nextResolve(`${specifier}.ts`, context);
    }
  },
});

const { frameImage, normalizeInk } = await import("./Retina/frame.ts");
const { SIZE } = await import("./Retina/size.ts");
const { createWeights, DIGITS, INPUTS, learn, predict } = await import("./model.ts");

/** Same resolution as the webcam capture. */
const CAPTURE = 84;
const EPOCHS = 3;
const LEARNING_RATE = 0.01;
/** Images kept aside to measure the accuracy, before the final training on all of them. */
const VALIDATION = 1000;

const [imagesPath, labelsPath] = process.argv.slice(2);
if (!imagesPath || !labelsPath) {
  console.error("Usage: npm run perceptron -- <images.gz> <labels.gz>");
  process.exit(1);
}

const images = loadImages(imagesPath);
const labels = loadLabels(labelsPath);
console.log(`${images.length} images loaded.`);

const train = images.slice(0, -VALIDATION);
const validation = images.slice(-VALIDATION);
let weights = createWeights();
const random = createRandom(1958);
for (let epoch = 1; epoch <= EPOCHS; epoch++) {
  weights = trainEpoch(weights, train, labels, random);
  const success = validation.filter(
    (image, index) => predict(weights, image) === labels[train.length + index],
  ).length;
  console.log(
    `Epoch ${epoch}: ${((100 * success) / validation.length).toFixed(1)}% on validation.`,
  );
}

weights = createWeights();
const finalRandom = createRandom(1958);
for (let epoch = 1; epoch <= EPOCHS; epoch++) {
  weights = trainEpoch(weights, images, labels, finalRandom);
}
const success = images.filter((image, index) => predict(weights, image) === labels[index]).length;
console.log(`Final: ${((100 * success) / images.length).toFixed(1)}% on the training images.`);
writeWeights(weights, EPOCHS * images.length);

function trainEpoch(
  weights: number[],
  images: Uint8Array[],
  labels: Uint8Array,
  random: () => number,
): number[] {
  const order = images.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  let result = weights;
  for (const index of order) {
    result = learn(result, images[index], labels[index], {
      learningRate: LEARNING_RATE,
      transformations: 0,
      random,
    });
  }
  return result;
}

/** Framed images of `SIZE`×`SIZE` cells, 1 for ink, 0 for background. */
function loadImages(path: string): Uint8Array[] {
  const data = Zlib.gunzipSync(FS.readFileSync(path));
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (view.getUint32(0) !== 0x803) throw new Error(`Not an IDX images file: ${path}`);

  const count = view.getUint32(4);
  const rows = view.getUint32(8);
  const cols = view.getUint32(12);
  const result: Uint8Array[] = [];
  for (let i = 0; i < count; i++) {
    const offset = 16 + i * rows * cols;
    const pixels = data.subarray(offset, offset + rows * cols);
    result.push(frameImage(normalizeInk(enlarge(pixels, cols)), SIZE));
  }
  return result;
}

function loadLabels(path: string): Uint8Array {
  const data = Zlib.gunzipSync(FS.readFileSync(path));
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (view.getUint32(0) !== 0x801) throw new Error(`Not an IDX labels file: ${path}`);

  return new Uint8Array(data.subarray(8, 8 + view.getUint32(4)));
}

/**
 * Bilinear interpolation of a square grayscale image to `CAPTURE`×`CAPTURE` pixels,
 * which are ink (1) if they are lighter than half: MNIST digits are white on black.
 */
function enlarge(pixels: Uint8Array, side: number): Uint8Array {
  const result = new Uint8Array(CAPTURE * CAPTURE);
  const get = (x: number, y: number) =>
    pixels[Math.min(side - 1, Math.max(0, y)) * side + Math.min(side - 1, Math.max(0, x))];
  for (let y = 0; y < CAPTURE; y++) {
    for (let x = 0; x < CAPTURE; x++) {
      const u = ((x + 0.5) * side) / CAPTURE - 0.5;
      const v = ((y + 0.5) * side) / CAPTURE - 0.5;
      const x0 = Math.floor(u);
      const y0 = Math.floor(v);
      const fx = u - x0;
      const fy = v - y0;
      const top = get(x0, y0) * (1 - fx) + get(x0 + 1, y0) * fx;
      const bottom = get(x0, y0 + 1) * (1 - fx) + get(x0 + 1, y0 + 1) * fx;
      result[y * CAPTURE + x] = top * (1 - fy) + bottom * fy >= 128 ? 1 : 0;
    }
  }
  return result;
}

/** Deterministic random numbers (mulberry32), to get the same weights at each run. */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One line per row of cells, so that the weights of each digit look like an image. */
function writeWeights(weights: number[], steps: number) {
  // Avoid "-0.000".
  const format = (value: number) => (Math.abs(value) < 0.0005 ? 0 : value).toFixed(3);
  const lines: string[] = [];
  for (let digit = 0; digit < DIGITS; digit++) {
    const offset = digit * (INPUTS + 1);
    lines.push(`  // Digit ${digit}`);
    for (let y = 0; y < SIZE; y++) {
      const row = weights.slice(offset + y * SIZE, offset + (y + 1) * SIZE);
      lines.push(`  ${row.map(format).join(", ")},`);
    }
    lines.push(`  ${format(weights[offset + INPUTS])}, // Bias`);
  }
  const code = `/**
 * This file provides the weight of a Perceptron that has
 * been trained with 10'000 images from MNIST:
 * * \`t10k-images-idx3-ubyte.gz\`: the images
 * * \`t10k-labels-idx1-ubyte.gz\`: the labels
 *
 * Generated by \`train.mts\`: do not edit by hand.
 */

/** Number of images learnt by the pretrained perceptron (${EPOCHS} times each of the 10'000 images). */
export const PRETRAINED_STEPS = ${steps};

/** Same layout as \`createWeights()\` in \`model.ts\`. */
// prettier-ignore
export const PRETRAINED_WEIGHTS: number[] = [
${lines.join("\n")}
];
`;
  const path = Path.resolve(import.meta.dirname, "weights.ts");
  FS.writeFileSync(path, code);
  console.log(`Written: ${path}`);
}
