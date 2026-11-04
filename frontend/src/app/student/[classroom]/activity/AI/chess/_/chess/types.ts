export type ChessColor = "white" | "black";

export type ChessPieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export type ChessFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type ChessRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

/** A square in algebraic notation: "a1", "e4", "h8"... */
export type ChessSquare = `${ChessFile}${ChessRank}`;

/** The pieces of one player, indexed by the square they stand on. */
export type ChessPieces = Partial<Record<ChessSquare, ChessPieceType>>;

export interface ChessCastling {
  /** Has this player already castled? */
  done: boolean;
  /** Is castling on the king side (O-O) still allowed (king and h-rook never moved)? */
  kingSide: boolean;
  /** Is castling on the queen side (O-O-O) still allowed (king and a-rook never moved)? */
  queenSide: boolean;
}

export interface ChessMove {
  color: ChessColor;
  piece: ChessPieceType;
  from: ChessSquare;
  to: ChessSquare;
  /** Type of the captured piece, if any. */
  capture?: ChessPieceType;
  /** A pawn reaching the last rank becomes this piece. */
  promotion?: ChessPieceType;
  castle?: "kingSide" | "queenSide";
  /** The captured pawn was taken "en passant". */
  enPassant?: boolean;
}

export interface ChessBoard {
  /** Position of the pieces, for the whites and for the blacks. */
  pieces: Record<ChessColor, ChessPieces>;
  /** Whose turn is it to play. */
  turn: ChessColor;
  castling: Record<ChessColor, ChessCastling>;
  /**
   * If the last move was a pawn moving two squares, this is the square it jumped over:
   * an opponent's pawn can capture "en passant" by moving to it.
   */
  enPassant: ChessSquare | null;
  /** Last move that has been done before getting to this position. */
  lastMove: ChessMove | null;
}
