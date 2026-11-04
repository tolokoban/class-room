import { indexToSquare, squareToIndex } from "./grid";
import type { ChessBoard, ChessColor, ChessMove, ChessPieceType, ChessSquare } from "./types";

const PIECES: Record<string, ChessPieceType> = {
  k: "king",
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
  p: "pawn",
};

/**
 * Create a board from the Forsyth-Edwards Notation.
 * @param fen E.g.: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1".
 * @param lastMove Optional last move, written "e2e4".
 * @param castled Players who have already castled.
 */
export function chessBoardFromFEN(
  fen: string,
  lastMove?: string,
  castled: ChessColor[] = [],
): ChessBoard {
  const [placement, turn = "w", castling = "-", enPassant = "-"] = fen.trim().split(/\s+/);
  const board: ChessBoard = {
    pieces: { white: {}, black: {} },
    turn: turn === "b" ? "black" : "white",
    castling: {
      white: {
        done: castled.includes("white"),
        kingSide: castling.includes("K"),
        queenSide: castling.includes("Q"),
      },
      black: {
        done: castled.includes("black"),
        kingSide: castling.includes("k"),
        queenSide: castling.includes("q"),
      },
    },
    enPassant: enPassant === "-" ? null : (enPassant as ChessSquare),
    lastMove: null,
  };
  placement.split("/").forEach((row, rowIndex) => {
    let file = 0;
    for (const char of row) {
      if (/[1-8]/.test(char)) {
        file += Number(char);
        continue;
      }
      const type = PIECES[char.toLowerCase()];
      const color: ChessColor = char === char.toUpperCase() ? "white" : "black";
      board.pieces[color][indexToSquare(file + 8 * (7 - rowIndex))] = type;
      file++;
    }
  });
  if (lastMove) board.lastMove = parseLastMove(board, lastMove);
  return board;
}

/** Last move (like "e2e4") of the player who is NOT to play. */
function parseLastMove(board: ChessBoard, move: string): ChessMove {
  const color: ChessColor = board.turn === "white" ? "black" : "white";
  const from = move.slice(0, 2) as ChessSquare;
  const to = move.slice(2, 4) as ChessSquare;
  const piece = board.pieces[color][to] ?? "pawn";
  const result: ChessMove = { color, piece, from, to };
  if (piece === "king" && Math.abs(squareToIndex(to) - squareToIndex(from)) === 2) {
    result.castle = to.charAt(0) === "g" ? "kingSide" : "queenSide";
  }
  return result;
}

export const CHESS_INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** A fresh game: all the pieces in their initial places, and the whites to play. */
export function chessBoardInitial(): ChessBoard {
  return chessBoardFromFEN(CHESS_INITIAL_FEN);
}
