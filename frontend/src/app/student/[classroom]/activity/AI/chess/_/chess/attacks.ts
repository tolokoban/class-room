import { fileOf, type Grid, type Piece, rankOf } from "./grid";
import type { ChessColor } from "./types";

type Direction = [dfile: number, drank: number];

export const ORTHOGONAL: Direction[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
export const DIAGONAL: Direction[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
export const ALL_DIRECTIONS: Direction[] = [...ORTHOGONAL, ...DIAGONAL];
export const KNIGHT_JUMPS: Direction[] = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
];

/** Index of the square at `(dfile, drank)` from `index`, or -1 if outside the board. */
export function shift(index: number, [dfile, drank]: Direction): number {
  const file = fileOf(index) + dfile;
  const rank = rankOf(index) + drank;
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return -1;

  return file + 8 * rank;
}

/** Forward direction of the pawns of this color. */
export function pawnDirection(color: ChessColor): number {
  return color === "white" ? 1 : -1;
}

/**
 * Squares controlled by the piece standing on `index`:
 * the squares it could capture an enemy piece on (or protect a friendly one).
 */
export function controlledSquares(grid: Grid, index: number): number[] {
  const piece = grid[index];
  if (!piece) return [];

  switch (piece.type) {
    case "pawn": {
      const dir = pawnDirection(piece.color);
      return [shift(index, [-1, dir]), shift(index, [1, dir])].filter((i) => i > -1);
    }
    case "knight":
      return jumps(index, KNIGHT_JUMPS);
    case "king":
      return jumps(index, ALL_DIRECTIONS);
    case "bishop":
      return slides(grid, index, DIAGONAL);
    case "rook":
      return slides(grid, index, ORTHOGONAL);
    case "queen":
      return slides(grid, index, ALL_DIRECTIONS);
  }
}

function jumps(index: number, directions: Direction[]): number[] {
  return directions.map((direction) => shift(index, direction)).filter((i) => i > -1);
}

/** A sliding piece goes in each direction until it meets a piece (included) or the edge. */
export function slides(grid: Grid, index: number, directions: Direction[]): number[] {
  const squares: number[] = [];
  for (const direction of directions) {
    let target = shift(index, direction);
    while (target > -1) {
      squares.push(target);
      if (grid[target]) break;

      target = shift(target, direction);
    }
  }
  return squares;
}

/** Indexes of the pieces of `color` that control the square `target`. */
export function controllers(grid: Grid, target: number, color: ChessColor): number[] {
  const result: number[] = [];
  grid.forEach((piece: Piece | null, index) => {
    if (piece?.color === color && controlledSquares(grid, index).includes(target)) {
      result.push(index);
    }
  });
  return result;
}

export function isAttacked(grid: Grid, target: number, by: ChessColor): boolean {
  return grid.some(
    (piece, index) => piece?.color === by && controlledSquares(grid, index).includes(target),
  );
}

export function isInCheck(grid: Grid, color: ChessColor): boolean {
  const king = grid.findIndex((piece) => piece?.color === color && piece.type === "king");
  if (king < 0) return false;

  return isAttacked(grid, king, color === "white" ? "black" : "white");
}
