import { describe, expect, it } from "vitest";

import {
  chessBoardEvaluate,
  chessBoardFromFEN,
  chessBoardPossibleMoves,
  type ChessBoard,
  simulateCaptures,
} from ".";

function perft(board: ChessBoard, depth: number): number {
  const boards = chessBoardPossibleMoves(board);
  if (depth === 1) return boards.length;

  return boards.reduce((sum, next) => sum + perft(next, depth - 1), 0);
}

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POSITION_3 = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
const POSITION_4 = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";

describe("chessBoardPossibleMoves", () => {
  it("matches perft on the initial position", () => {
    const board = chessBoardFromFEN(START);
    expect(perft(board, 1)).toBe(20);
    expect(perft(board, 2)).toBe(400);
    expect(perft(board, 3)).toBe(8902);
  });
  it("matches perft on Kiwipete (castling, en passant, pins)", () => {
    const board = chessBoardFromFEN(KIWIPETE);
    expect(perft(board, 1)).toBe(48);
    expect(perft(board, 2)).toBe(2039);
  });
  it("matches perft on the endgame position 3", () => {
    const board = chessBoardFromFEN(POSITION_3);
    expect(perft(board, 1)).toBe(14);
    expect(perft(board, 2)).toBe(191);
    expect(perft(board, 3)).toBe(2812);
  });
  it("matches perft on position 4 (promotions)", () => {
    const board = chessBoardFromFEN(POSITION_4);
    expect(perft(board, 1)).toBe(6);
    expect(perft(board, 2)).toBe(264);
  });
  it("records the castling and the last move", () => {
    const board = chessBoardFromFEN(KIWIPETE);
    const castled = chessBoardPossibleMoves(board).find((b) => b.lastMove?.castle === "kingSide");
    expect(castled?.castling.white).toEqual({ done: true, kingSide: false, queenSide: false });
    expect(castled?.pieces.white.g1).toBe("king");
    expect(castled?.pieces.white.f1).toBe("rook");
    expect(castled?.turn).toBe("black");
  });
});

describe("simulateCaptures", () => {
  it("lets the weakest pieces capture first", () => {
    // Knight attacked by a pawn, protected by a pawn: -3 + 1.
    expect(simulateCaptures(3, ["pawn"], ["pawn"])).toBe(-2);
    // Pawn attacked by a queen, protected by a pawn: -1 + 10.
    expect(simulateCaptures(1, ["pawn"], ["queen"])).toBe(9);
    // Rook attacked by two knights, protected by a queen: -5 + 3 - 10.
    expect(simulateCaptures(5, ["queen"], ["knight", "knight"])).toBe(-12);
  });
  it("never lets a king capture a protected piece", () => {
    // Pawn attacked by a knight and a bishop, protected by the king only: -1, then the king stops.
    expect(simulateCaptures(1, ["king"], ["knight", "bishop"])).toBe(-1);
    // Protected by the king, attacked by a lone knight: the king takes back.
    expect(simulateCaptures(1, ["king"], ["knight"])).toBe(2);
  });
});

describe("chessBoardEvaluate", () => {
  it("is 0 for the initial position (symmetry)", () => {
    expect(chessBoardEvaluate(chessBoardFromFEN(START))).toBe(0);
  });
  it("gives a tenth of its value to a piece that is not threatened", () => {
    // White: king e1, rook a2. Black: king e8, pawn a7 threatened by the rook.
    const board = chessBoardFromFEN("4k3/p7/8/8/8/8/R7/4K3 w - - 0 1");
    // Material: 1000 + 5 - 1000 - 1 = 5.
    // Kings (+0.4 and -0.4) and rook (+0.5) are not threatened.
    // The black pawn is lost (-1 for the blacks): the blacks lose half of it (+0.5).
    expect(chessBoardEvaluate(board)).toBeCloseTo(5);
  });
  it("removes half of the value of a piece badly protected", () => {
    // The white knight d4 (protected by the pawn c3) is threatened by the pawn e5.
    const board = chessBoardFromFEN("4k3/8/8/4p3/3N4/2P5/8/4K3 w - - 0 1");
    // Material: 3. Kings: +0.4 - 0.4. Pawns: +0.1 - 0.1.
    // Knight: pawn takes it (-3), pawn takes back (+1): total -2, so -1.5.
    expect(chessBoardEvaluate(board)).toBeCloseTo(1.5);
  });
  it("gives the king's points to the opponent when checkmated", () => {
    // Fool's mate.
    const board = chessBoardFromFEN(
      "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
    );
    expect(chessBoardPossibleMoves(board)).toHaveLength(0);
    expect(chessBoardEvaluate(board)).toBeLessThan(-900);
  });
});

describe("chessBoardEvaluate (simple)", () => {
  it("only counts the points of the pieces", () => {
    // The white knight d4 is badly protected, but the simple evaluation ignores it.
    const board = chessBoardFromFEN("4k3/8/8/4p3/3N4/2P5/8/4K3 w - - 0 1");
    expect(chessBoardEvaluate(board, { simple: true })).toBe(3);
  });
});
