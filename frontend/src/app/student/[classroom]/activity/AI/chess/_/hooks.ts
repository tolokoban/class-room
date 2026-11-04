import React from "react";

import {
  type ChessBoard,
  chessBoardEvaluate,
  chessBoardInitial,
  chessBoardPossibleMoves,
} from "./chess";
import { CHESS_EXAMPLES } from "./examples";
import type { Move } from "./Moves";

export function useChessGame() {
  const [board, setBoard] = React.useState(() => pickExample());
  /** Only count the points of the pieces: easier to explain to students. */
  const [simple, setSimple] = React.useState(true);
  const handleRandomGame = () => setBoard((previous) => pickExample(previous));
  const handleNewGame = () => setBoard(chessBoardInitial());
  /** Play the next ply: the chosen position becomes the current one. */
  const handleSelect = (next: ChessBoard) => setBoard(next);
  const evaluation = React.useMemo(() => chessBoardEvaluate(board, { simple }), [board, simple]);
  const moves = React.useMemo(() => evaluateMoves(board, simple), [board, simple]);
  return {
    board,
    evaluation,
    moves,
    simple,
    setSimple,
    handleRandomGame,
    handleNewGame,
    handleSelect,
  };
}

/** A random example, different from the previous one. */
function pickExample(previous?: ChessBoard): ChessBoard {
  const candidates = CHESS_EXAMPLES.filter((example) => example !== previous);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** All the reachable positions, the best ones for the player first. */
function evaluateMoves(board: ChessBoard, simple: boolean): Move[] {
  // The whites want the highest evaluation, the blacks the lowest.
  const sign = board.turn === "white" ? 1 : -1;
  const moves = chessBoardPossibleMoves(board)
    .map((next) => ({ board: next, evaluation: chessBoardEvaluate(next, { simple }), best: false }))
    .sort((a, b) => sign * (b.evaluation - a.evaluation));
  const bestEvaluation = moves[0]?.evaluation;
  return moves.map((move) => ({ ...move, best: move.evaluation === bestEvaluation }));
}
