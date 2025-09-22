/**
 * @brief game logic contains the definiton of functions used
 *  to play the game of checkers aka dama against AI (or human)
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 22nd of Septemeber 2025, Tuesday
 */

export const EMPTY = 0;
export const PLAYER1 = 1;
export const PLAYER2 = 2;
export const BOARD_SIZE = 8;

// initalizes and returns a new board
export function initBoard() {
    const board = Array(BOARD_SIZE).fill().map(()=> Array(BOARD_SIZE).fill(EMPTY));

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if ((row + col) % 2 === 1) {
                if (row < 3) board[row][col] = PLAYER2;
                if (row > 4) board[row][col] = PLAYER1;
            } // end if mark
        } // end nested for col
    } // end for row

    return board;
} // end initBoard


// determines if the move is valid
export function isValidMove(board, turn, sr, sc, tr, tc) {
    if (board[tr][tc] !== EMPTY) return false;

    const dir = turn === PLAYER1 ? -1 : 1;
    return tr === sr + dir && Math.abs(tc - sc) === 1;
} // end isValidMove


// marks the board with a new move give source, and dest points
export function movePiece(board, sr, sc, tr, tc) {
    const newBoard = board.map(row => row.slice());
    newBoard[tr][tc] = newBoard[sr][sc];
    newBoard[sr][sc] = EMPTY;
    return newBoard;
} // end movePiece