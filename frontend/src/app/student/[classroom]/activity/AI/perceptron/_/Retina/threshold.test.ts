import { describe, expect, it } from "vitest";

import { computeLuminances, computeThreshold } from "./threshold";

describe("computeLuminances", () => {
  it("converts RGBA pixels into luminances between 0 and 1", () => {
    const luminances = computeLuminances(new Uint8Array([0, 0, 0, 255, 255, 255, 255, 255]));
    expect(luminances[0]).toBeCloseTo(0);
    expect(luminances[1]).toBeCloseTo(1);
  });
});

describe("computeThreshold", () => {
  it("is halfway between the averages of the 5% lightest and 5% darkest pixels", () => {
    const luminances = new Float32Array(400).fill(0.5);
    for (let i = 0; i < 20; i++) {
      luminances[i] = 0.1 + (i % 2) * 0.1;
      luminances[399 - i] = 0.7 + (i % 2) * 0.1;
    }
    // L = 0.15, H = 0.75
    expect(computeThreshold(luminances)).toBeCloseTo(0.45);
  });

  it("ignores the pixels between the extremes", () => {
    const luminances = new Float32Array(400).fill(0.9);
    luminances.fill(0.1, 0, 20);
    // L = 0.1, H = 0.9
    expect(computeThreshold(luminances)).toBeCloseTo(0.5);
  });
});
