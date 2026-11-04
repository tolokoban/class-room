I need a new activity in `frontend/src/app/student/[classroom]/activity/AI/chess` to help the students understand how a computer can play chess with an evaluation of the game board.

I need to you to rrespect these types:

```ts
interface ChessBoard {
    /**
     * Complete this type.
     * 
     * This type must hold:
     * - Position of the chess pieces for the whites and for the blacks.
     * - Whose turn is it to play: "white" | "black"
     * - Has a castle already occured?
     * - Is there a possible "en passant" capture?
     * - Last move that has been done before getting to this board positions
     */
}
```

And I want the following functions:

```ts
/**
 * The evaluation add points for the white and remove for the blacks.
 * * We start by computing the points made by the chess pieces still on the board
 *   * King: 1000 points (or -1000 for the blacks)
 *   * Queen: 10 points (or -10 for the blacks)
 *   * Rook: 5 points (or -5 for the blacks)
 *   * Knight and Bishop: 3 points (or -3 for the blacks)
 *   * Pawn: 1 point (or -1 for the blacks)
 * * Then we look at all the pieces of the whites
 *   * We add half of the points of the white pieces that are protecting it.
 *   * We subtract half of the points of the black pieces that are threaten it.
 * * We do the same for the blacks but use negative points.
 */
function chessBoardEvaluate(board: ChessBoard): number {
    ...
}

/**
 * Bases on the chess allowed moves, we return all the chess boards we
 * can reach from this one (`board`).
 */
function chessBoardPossibleMoves(board: ChessBoard): ChessBoard[] {

}
```

I also need a component `<ChessBoard value >` (value is of type `ChessBoard`) that displays the chessboard with classic representation of the pieces. Using SVG is fine.

Create a file with a constant array of `ChessBoard` that will hold 30 examples of chess board positions taken from real master games.
The best positions are when in the middle of the game, when white and black are balances, but at a turnig point that will give a big advantage of one of the players in the next ply.

The activity is made of a header, with a title and a button "Recommencer".
Below, taking the whole remaining space, we have two columns: `1fr 2fr`.
On the left, we display a board (randomly choosen between the 30 examples) that trie to take as much place as posible in its column, and with the evaluation number just below it.
On the right, we have as many chess boards as the function `chessBoardPossibleMoves` will get us. The size of these boards are about a third of the one on the left column.
We also want the evaluation number under eac of the boards here.

Button "Recommencer" takes a new random example.
