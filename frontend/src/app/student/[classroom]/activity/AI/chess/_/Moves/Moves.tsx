import { Theme } from "@tolokoban/ui";

import type { ChessBoard as ChessBoardValue } from "../chess";
import { ChessBoard } from "../ChessBoard";
import { Evaluation } from "../Evaluation";
import { useMovesList, useMovesTitle } from "./hooks";

import Styles from "./Moves.module.css";

const $ = Theme.classNames;

export interface Move {
  board: ChessBoardValue;
  evaluation: number;
  /** Is this one of the moves with the best evaluation for the player? */
  best: boolean;
}

export interface MovesProps {
  className?: string;
  /** Position before the moves. */
  board: ChessBoardValue;
  moves: Move[];
  /** The user picked this position to play it. */
  onSelect(board: ChessBoardValue): void;
}

/** All the positions that can be reached in one move, with their evaluation. */
export function Moves({ className, board, moves, onSelect }: MovesProps) {
  const title = useMovesTitle(board, moves.length);
  const refList = useMovesList(board);
  return (
    <section className={$.join(className, Styles.moves)}>
      <header>{title}</header>
      <ul ref={refList}>
        {moves.map((move) => (
          <li
            key={`${move.board.lastMove?.from}${move.board.lastMove?.to}${move.board.lastMove?.promotion ?? ""}`}
            className={$.join(move.best && Styles.best)}
          >
            <button type="button" onClick={() => onSelect(move.board)}>
              <ChessBoard value={move.board} />
              <Evaluation value={move.evaluation} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
