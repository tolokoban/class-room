import type { ProgressInfo } from "@huggingface/transformers";
import { describe, expect, it } from "vitest";

import { addProgressListener, trackDownload } from "./download";

function progress(name: string, loaded: number, total: number): ProgressInfo {
  return {
    status: "progress_total",
    name,
    progress: (100 * loaded) / total,
    loaded,
    total,
    files: {},
  };
}

describe("trackDownload()", () => {
  it("should give one progress for all the models, weighted by their size", () => {
    const values: number[] = [];
    const remove = addProgressListener((value) => values.push(value));
    trackDownload(progress("small", 0, 100));
    trackDownload(progress("big", 0, 300));
    trackDownload(progress("small", 100, 100));
    trackDownload(progress("big", 150, 300));
    trackDownload(progress("big", 300, 300));
    remove();
    expect(values).toEqual([0, 0, 25, 62.5, 100]);
  });
  it("should start again from zero for a new batch of downloads", () => {
    const values: number[] = [];
    const remove = addProgressListener((value) => values.push(value));
    trackDownload(progress("other", 50, 200));
    remove();
    expect(values).toEqual([25]);
  });
});
