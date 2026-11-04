import {
  ALL_DIRECTIONS,
  DIAGONAL,
  isAttacked,
  isInCheck,
  KNIGHT_JUMPS,
  ORTHOGONAL,
  pawnDirection,
  shift,
  slides,
} from "./attacks";
import {
  boardToGrid,
  type Grid,
  gridToPieces,
  indexToSquare,
  opponent,
  rankOf,
  squareToIndex,
} from "./grid";
import type { ChessBoard, ChessCastling, ChessColor, ChessMove, ChessPieceType } from "./types";

const PROMOTIONS: ChessPieceType[] = ["queen", "rook", "bishop", "knight"];

/** A move expressed with grid indexes, before it is checked for legality. */
interface Candidate {
  from: number;
  to: number;
  promotion?: ChessPieceType;
  castle?: "kingSide" | "queenSide";
  enPassant?: boolean;
}

/**
 * Based on the chess allowed moves, we return all the chess boards we
 * can reach from this one (`board`).
 */
export function chessBoardPossibleMoves(board: ChessBoard): ChessBoard[] {
  const grid = boardToGrid(board);
  const boards: ChessBoard[] = [];
  for (const candidate of candidateMoves(board, grid)) {
    const next = applyCandidate(grid, candidate);
    // A move is forbidden if it leaves our own king in check.
    if (isInCheck(next, board.turn)) continue;

    boards.push(createBoard(board, grid, next, candidate));
  }
  return boards;
}

function candidateMoves(board: ChessBoard, grid: Grid): Candidate[] {
  const candidates: Candidate[] = [];
  grid.forEach((piece, from) => {
    if (piece?.color !== board.turn) return;

    switch (piece.type) {
      case "pawn":
        candidates.push(...pawnMoves(board, grid, from));
        break;
      case "knight":
        candidates.push(
          ...stepMoves(
            grid,
            from,
            KNIGHT_JUMPS.map((jump) => shift(from, jump)),
          ),
        );
        break;
      case "king":
        candidates.push(
          ...stepMoves(
            grid,
            from,
            ALL_DIRECTIONS.map((dir) => shift(from, dir)),
          ),
        );
        candidates.push(...castleMoves(board, grid, from));
        break;
      case "bishop":
        candidates.push(...stepMoves(grid, from, slides(grid, from, DIAGONAL)));
        break;
      case "rook":
        candidates.push(...stepMoves(grid, from, slides(grid, from, ORTHOGONAL)));
        break;
      case "queen":
        candidates.push(...stepMoves(grid, from, slides(grid, from, ALL_DIRECTIONS)));
        break;
    }
  });
  return candidates;
}

/** Moves to the `targets` squares that are empty or hold an enemy piece. */
function stepMoves(grid: Grid, from: number, targets: number[]): Candidate[] {
  const color = grid[from]?.color;
  return targets.filter((to) => to > -1 && grid[to]?.color !== color).map((to) => ({ from, to }));
}

function pawnMoves(board: ChessBoard, grid: Grid, from: number): Candidate[] {
  const color = board.turn;
  const dir = pawnDirection(color);
  const startRank = color === "white" ? 1 : 6;
  const lastRank = color === "white" ? 7 : 0;
  const enPassant = board.enPassant ? squareToIndex(board.enPassant) : -1;
  const moves: Candidate[] = [];
  const one = shift(from, [0, dir]);
  if (one > -1 && !grid[one]) {
    moves.push({ from, to: one });
    const two = shift(one, [0, dir]);
    if (rankOf(from) === startRank && !grid[two]) moves.push({ from, to: two });
  }
  for (const to of [shift(from, [-1, dir]), shift(from, [1, dir])]) {
    if (to < 0) continue;
    if (grid[to] && grid[to].color !== color) moves.push({ from, to });
    else if (to === enPassant) moves.push({ from, to, enPassant: true });
  }
  return moves.flatMap((move) =>
    rankOf(move.to) === lastRank ? PROMOTIONS.map((promotion) => ({ ...move, promotion })) : [move],
  );
}

function castleMoves(board: ChessBoard, grid: Grid, from: number): Candidate[] {
  const color = board.turn;
  const rights = board.castling[color];
  const row = color === "white" ? 0 : 56;
  const enemy = opponent(color);
  if (from !== row + 4 || isAttacked(grid, from, enemy)) return [];

  const moves: Candidate[] = [];
  const isOwnRook = (index: number) => grid[index]?.color === color && grid[index]?.type === "rook";
  if (
    rights.kingSide &&
    isOwnRook(row + 7) &&
    !grid[row + 5] &&
    !grid[row + 6] &&
    !isAttacked(grid, row + 5, enemy)
  ) {
    moves.push({ from, to: row + 6, castle: "kingSide" });
  }
  if (
    rights.queenSide &&
    isOwnRook(row) &&
    !grid[row + 1] &&
    !grid[row + 2] &&
    !grid[row + 3] &&
    !isAttacked(grid, row + 3, enemy)
  ) {
    moves.push({ from, to: row + 2, castle: "queenSide" });
  }
  return moves;
}

function applyCandidate(grid: Grid, { from, to, promotion, castle, enPassant }: Candidate): Grid {
  const next = [...grid];
  const piece = next[from];
  if (!piece) return next;

  next[from] = null;
  next[to] = promotion ? { color: piece.color, type: promotion } : piece;
  if (enPassant) {
    // The captured pawn is beside us, not on the target square.
    next[to - 8 * pawnDirection(piece.color)] = null;
  }
  if (castle) {
    const row = from - 4;
    const [rookFrom, rookTo] = castle === "kingSide" ? [row + 7, row + 5] : [row, row + 3];
    next[rookTo] = next[rookFrom];
    next[rookFrom] = null;
  }
  return next;
}

function createBoard(board: ChessBoard, grid: Grid, next: Grid, candidate: Candidate): ChessBoard {
  const { from, to, promotion, castle, enPassant } = candidate;
  const color = board.turn;
  const piece = grid[from]?.type ?? "pawn";
  const captured = enPassant ? "pawn" : grid[to]?.type;
  const move: ChessMove = { color, piece, from: indexToSquare(from), to: indexToSquare(to) };
  if (captured) move.capture = captured;
  if (promotion) move.promotion = promotion;
  if (castle) move.castle = castle;
  if (enPassant) move.enPassant = true;
  const isDoublePush = piece === "pawn" && Math.abs(to - from) === 16;
  return {
    pieces: gridToPieces(next),
    turn: opponent(color),
    castling: {
      white: updateCastling(board.castling.white, "white", candidate, piece),
      black: updateCastling(board.castling.black, "black", candidate, piece),
    },
    enPassant: isDoublePush ? indexToSquare((from + to) / 2) : null,
    lastMove: move,
  };
}

/** Castling is lost as soon as the king or the rook moves, or the rook is captured. */
function updateCastling(
  castling: ChessCastling,
  color: ChessColor,
  { from, to, castle }: Candidate,
  piece: ChessPieceType,
): ChessCastling {
  const row = color === "white" ? 0 : 56;
  const touched = (index: number) => from === index || to === index;
  const isKingMove = piece === "king" && from === row + 4;
  return {
    done: castling.done || (castle !== undefined && from === row + 4),
    kingSide: castling.kingSide && !isKingMove && !touched(row + 7),
    queenSide: castling.queenSide && !isKingMove && !touched(row),
  };
}

/** Is the player who must play in check? */
export function chessBoardIsInCheck(board: ChessBoard): boolean {
  return isInCheck(boardToGrid(board), board.turn);
}
