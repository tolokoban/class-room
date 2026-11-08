import type { ChessPieceType } from "./types";

/**
 * We always use the "black" (filled) glyphs and paint them in white or black.
 * The U+FE0E selector prevents the browser from displaying them as emojis.
 */
export const CHESS_GLYPHS: Record<ChessPieceType, string> = {
  king: "♚︎",
  queen: "♛︎",
  rook: "♜︎",
  bishop: "♝︎",
  knight: "♞︎",
  pawn: "♟︎",
};
