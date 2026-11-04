/**
 * Internal representation used for computations: an array of 64 cells.
 * Index = 8 * rank + file, with rank and file in [0, 7] ("a1" = 0, "h1" = 7, "h8" = 63).
 */
import type { ChessBoard, ChessColor, ChessPieces, ChessPieceType, ChessSquare } from "./types";

export interface Piece {
  color: ChessColor;
  type: ChessPieceType;
}

export type Grid = Array<Piece | null>;

const FILES = "abcdefgh";

export function squareToIndex(square: ChessSquare): number {
  return FILES.indexOf(square.charAt(0)) + 8 * (Number(square.charAt(1)) - 1);
}

export function indexToSquare(index: number): ChessSquare {
  return `${FILES.charAt(index % 8)}${Math.floor(index / 8) + 1}` as ChessSquare;
}

export function fileOf(index: number): number {
  return index % 8;
}

export function rankOf(index: number): number {
  return Math.floor(index / 8);
}

export function opponent(color: ChessColor): ChessColor {
  return color === "white" ? "black" : "white";
}

export function boardToGrid(board: ChessBoard): Grid {
  const grid: Grid = Array.from({ length: 64 }, () => null);
  for (const color of ["white", "black"] as const) {
    for (const [square, type] of Object.entries(board.pieces[color])) {
      grid[squareToIndex(square as ChessSquare)] = { color, type };
    }
  }
  return grid;
}

export function gridToPieces(grid: Grid): Record<ChessColor, ChessPieces> {
  const pieces: Record<ChessColor, ChessPieces> = { white: {}, black: {} };
  grid.forEach((piece, index) => {
    if (piece) pieces[piece.color][indexToSquare(index)] = piece.type;
  });
  return pieces;
}
