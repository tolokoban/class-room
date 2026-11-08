import type { ChessBoard, ChessColor, ChessPieceType } from "./types";

/** Pieces of each player at the start of a game (the king is never missing). From the strongest to the weakest. */
const INITIAL_COUNT: Array<[ChessPieceType, number]> = [
  ["queen", 1],
  ["rook", 2],
  ["bishop", 2],
  ["knight", 2],
  ["pawn", 8],
];

/**
 * Pieces of `color` that are no longer on the board, from the strongest to the weakest.
 * A piece that has more copies than at the start (because of a promotion) is just not missing.
 */
export function chessBoardMissingPieces(board: ChessBoard, color: ChessColor): ChessPieceType[] {
  const pieces = Object.values(board.pieces[color]);
  const missing: ChessPieceType[] = [];
  for (const [type, initial] of INITIAL_COUNT) {
    const count = pieces.filter((piece) => piece === type).length;
    for (let i = count; i < initial; i++) missing.push(type);
  }
  return missing;
}
