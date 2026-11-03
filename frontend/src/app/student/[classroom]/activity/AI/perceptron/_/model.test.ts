import { describe, expect, it } from "vitest";

import { createWeights, type Example, INPUTS, learn, learnAndRevise, predict } from "./model";
import { transformImage } from "./transform";
import { PRETRAINED_WEIGHTS } from "./weights";

function bar(column: number): Uint8Array {
  const image = new Uint8Array(INPUTS);
  for (let y = 4; y < 16; y++) image[y * 20 + column] = 1;
  return image;
}

describe("transformImage", () => {
  it("keeps the image unchanged with the neutral transformation", () => {
    // random() = 0.5 gives scale 1, rotation 0 and translation 0.
    expect(Array.from(transformImage(bar(10), () => 0.5))).toEqual(Array.from(bar(10)));
  });
});

describe("learn", () => {
  it("separates two different shapes", () => {
    let weights = createWeights();
    for (let i = 0; i < 5; i++) {
      weights = learn(weights, bar(4), 1);
      weights = learn(weights, bar(15), 7);
    }
    expect(predict(weights, bar(4))).toBe(1);
    expect(predict(weights, bar(15))).toBe(7);
  });
});

describe("PRETRAINED_WEIGHTS", () => {
  it("has the same layout as the weights of the model", () => {
    expect(PRETRAINED_WEIGHTS).toHaveLength(createWeights().length);
  });
});

describe("learnAndRevise", () => {
  it("does not forget the previous examples", () => {
    let weights = createWeights();
    const examples: Example[] = [];
    for (let i = 0; i < 3; i++) {
      for (const [column, digit] of [
        [4, 1],
        [10, 4],
        [15, 7],
      ]) {
        const image = bar(column);
        weights = learnAndRevise(weights, image, digit, examples);
        examples.push({ image, digit });
      }
    }
    expect(predict(weights, bar(4))).toBe(1);
    expect(predict(weights, bar(10))).toBe(4);
    expect(predict(weights, bar(15))).toBe(7);
  });
});
