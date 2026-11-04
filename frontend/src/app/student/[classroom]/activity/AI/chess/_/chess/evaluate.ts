import { controllers, isInCheck } from "./attacks";
import { boardToGrid, type Grid, opponent } from "./grid";
import { chessBoardPossibleMoves } from "./moves";
import type { ChessBoard, ChessPieceType } from "./types";

/** Points of each piece still on the board. */
export const PIECE_POINTS: Record<ChessPieceType, number> = {
  king: 1000,
  queen: 10,
  rook: 5,
  knight: 3,
  bishop: 3,
  pawn: 1,
};

/**
 * Points of a piece in the simulation of captures.
 * The king cannot be worth 1000 here: being in check would cost 500 points
 * and hide everything else. So it counts as a minor piece, its usual "fighting value".
 */
export const EXCHANGE_POINTS: Record<ChessPieceType, number> = {
  ...PIECE_POINTS,
  king: 4,
};

export interface ChessEvaluateOptions {
  /** Only count the points of the pieces still on the board (no threats, no protections). */
  simple?: boolean;
}

/**
 * The evaluation adds points for the whites and removes points for the blacks.
 * - We start by computing the points made by the chess pieces still on the board
 *   (see `PIECE_POINTS`).
 * - Then, unless the evaluation is `simple`, for each piece (see `exchangeBonus()`):
 *   - If no enemy piece threatens it, it gains a tenth of its value.
 *   - Otherwise, we simulate the captures on its square. If its owner loses
 *     points in the end, the piece loses half of its value.
 * - The points of the whites are added, those of the blacks are subtracted.
 *
 * A checkmated player loses its king (so 1000 points).
 * A stalemate is a draw: its evaluation is 0.
 */
export function chessBoardEvaluate(
  board: ChessBoard,
  { simple = false }: ChessEvaluateOptions = {},
): number {
  const grid = boardToGrid(board);
  let score = 0;
  grid.forEach((piece, index) => {
    if (!piece) return;

    const sign = piece.color === "white" ? 1 : -1;
    const bonus = simple ? 0 : exchangeBonus(grid, index);
    score += sign * (PIECE_POINTS[piece.type] + bonus);
  });
  if (chessBoardPossibleMoves(board).length === 0) {
    if (!isInCheck(grid, board.turn)) return 0;

    score -= (board.turn === "white" ? 1 : -1) * PIECE_POINTS.king;
  }
  // Values are multiples of a tenth: rounding removes the floating point noise.
  return Math.round(score * 10) / 10;
}

/**
 * Points gained (or lost) by the piece on `index`, for its owner.
 * 1. List all the pieces that protect it and all the pieces that threaten it.
 * 2. Sort them from the weakest (pawn) to the strongest.
 * 3. If no one threatens it, it gains a tenth of its value.
 * 4. Otherwise, simulate the captures: the weakest enemy takes our piece,
 *    then our weakest protector takes back, then the next enemy, and so on.
 *    Each piece we lose costs its points, each enemy piece taken earns its points.
 *    If the total is negative in the end, the piece loses half of its value.
 */
export function exchangeBonus(grid: Grid, index: number): number {
  const piece = grid[index];
  if (!piece) return 0;

  const value = EXCHANGE_POINTS[piece.type];
  const sortedTypes = (color: typeof piece.color) =>
    controllers(grid, index, color)
      .map((from) => grid[from]?.type ?? "pawn")
      .sort((a, b) => EXCHANGE_POINTS[a] - EXCHANGE_POINTS[b]);
  const threats = sortedTypes(opponent(piece.color));
  if (threats.length === 0) return value / 10;

  const total = simulateCaptures(value, sortedTypes(piece.color), threats);
  return total < 0 ? -value / 2 : 0;
}

/**
 * Captures on one square, until a side has no more pieces to capture with.
 * @returns The balance for the owner of the piece standing on the square.
 */
export function simulateCaptures(
  value: number,
  protectors: ChessPieceType[],
  threats: ChessPieceType[],
): number {
  const sides = [threats, protectors];
  let total = 0;
  // Value of the piece standing on the square, and who owns it (0: us, 1: the enemy).
  let onSquare = value;
  let owner = 0;
  for (let step = 0; ; step++) {
    const capturer = sides[step % 2][Math.floor(step / 2)];
    if (!capturer) break;
    // A king never captures a piece that is still protected: it would be in check.
    const defenders = sides[(step + 1) % 2].length - Math.floor((step + 1) / 2);
    if (capturer === "king" && defenders > 0) break;

    total += owner === 0 ? -onSquare : onSquare;
    onSquare = EXCHANGE_POINTS[capturer];
    owner = 1 - owner;
  }
  return total;
}
