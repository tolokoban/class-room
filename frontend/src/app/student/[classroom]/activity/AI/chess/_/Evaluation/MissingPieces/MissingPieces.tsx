import { Theme } from "@tolokoban/ui";

import { CHESS_GLYPHS, type ChessBoard, chessBoardMissingPieces } from "../../chess";

import Styles from "./MissingPieces.module.css";

const $ = Theme.classNames;

export interface MissingPiecesProps {
  className?: string;
  board: ChessBoard;
}

/** Pieces captured so far: the whites on the first line, the blacks on the second. */
export function MissingPieces({ className, board }: MissingPiecesProps) {
  return (
    <div className={$.join(className, Styles.missingPieces)}>
      <div className={Styles.white}>
        {chessBoardMissingPieces(board, "white").map((type) => CHESS_GLYPHS[type])}
      </div>
      <div className={Styles.black}>
        {chessBoardMissingPieces(board, "black").map((type) => CHESS_GLYPHS[type])}
      </div>
    </div>
  );
}
