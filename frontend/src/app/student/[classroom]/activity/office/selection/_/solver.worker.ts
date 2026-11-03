import { type KeyStroke } from "./keyboard";
import { type RichText } from "./rich-text";
import { pickSolution, type Solutions, solve } from "./solver";

export type SolverRequest =
  | { type: "solve"; input: RichText; expected: RichText }
  | { type: "pick"; strokes: KeyStroke[] };

/** The best solution, or `null` if it could not be computed. */
export type SolverResponse = { type: "picked"; solution: KeyStroke[] | null };

/** The search graph is kept here to pick the solution closest to the student's one. */
let solutions: Solutions | null = null;

self.onmessage = (event: MessageEvent<SolverRequest>) => {
  const request = event.data;
  if (request.type === "solve") {
    solutions = solve(request.input, request.expected);
    return;
  }
  const response: SolverResponse = {
    type: "picked",
    solution: solutions ? pickSolution(solutions, request.strokes) : null,
  };
  self.postMessage(response);
};
