import { type KeyStroke } from "./keyboard";
import { type RichText } from "./rich-text";
import { type SolverRequest, type SolverResponse } from "./solver.worker";

/**
 * Compute the best solution of an exercise in a Web Worker,
 * as soon as the exercise starts, to not freeze the page.
 */
export class SolverClient {
  private readonly worker = new Worker(new URL("./solver.worker.ts", import.meta.url));

  constructor(input: RichText, expected: RichText) {
    this.send({ type: "solve", input, expected });
  }

  /**
   * Wait for the search to end and get the best solution that looks
   * the most like the student's one, or `null` if it has not been found.
   */
  pick(strokes: KeyStroke[]): Promise<KeyStroke[] | null> {
    return new Promise((resolve) => {
      this.worker.onmessage = (event: MessageEvent<SolverResponse>) => resolve(event.data.solution);
      this.worker.onerror = () => resolve(null);
      this.send({ type: "pick", strokes });
    });
  }

  terminate() {
    this.worker.terminate();
  }

  private send(request: SolverRequest) {
    this.worker.postMessage(request);
  }
}
