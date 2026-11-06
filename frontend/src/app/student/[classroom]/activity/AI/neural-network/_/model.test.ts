import { describe, expect, it } from "vitest";

import { createArray, createWeights, indexToInputs, isCorrect, run, runAll, train } from "./model";

describe("neural-network model", () => {
  it("should encode the index with the most significant bit first", () => {
    expect(indexToInputs(0)).toEqual([-1, -1, -1]);
    expect(indexToInputs(6)).toEqual([1, 1, -1]);
  });

  it("should create arrays with 2 hearts, 1 treasure and 4 skulls", () => {
    const array = createArray();
    expect(array.filter((item) => item === "heart").length).toBe(2);
    expect(array.filter((item) => item === "treasure").length).toBe(1);
    expect(array.filter((item) => item === "skull").length).toBe(4);
  });

  it("should learn most random arrays in a reasonable number of clicks", () => {
    let success = 0;
    for (let game = 0; game < 100; game++) {
      const array = createArray();
      let weights = createWeights();
      for (let step = 0; step < 400; step++) {
        const index = step % array.length;
        weights = train(weights, run(weights, index), array[index]);
      }
      if (
        runAll(weights)
          .slice(0, array.length)
          .every((result) => isCorrect(result, array))
      )
        success++;
    }
    expect(success).toBeGreaterThan(80);
  });
});
