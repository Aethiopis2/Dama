/**
 * @brief game logic contains the definiton of functions used
 *  to play the game of checkers aka dama against AI (or human)
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 22nd of Septemeber 2025, Monday
 */

import Board from "../components/Board";

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
                if (row < 3) board[row][col] = {player: PLAYER2, king: false};
                if (row > 4) board[row][col] = {player: PLAYER1, king: false};
            } // end if mark
        } // end nested for col
    } // end for row

    return board;
} // end initBoard

// determines all the valid moves given the current position
export function getValidMoves(board, player, onlyFrom = null) {
    const moves = [];
    const captures = [];
    const directions = [
        {dr: -1, dc: -1},
        {dr: -1, dc: 1},
        {dr: 1, dc: -1},
        {dr: 1, dc: 1}
    ];

    // determines the position is within the grid
    function inBounds(r, c) {
        return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE; 
    } // end inBounds

    
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (!piece || piece.player !== player) continue;
            if (onlyFrom && (onlyFrom.row !== r || onlyFrom.col !== c)) continue;

            // normal diagonals
            for (const {dr, dc} of directions) {
                if (!piece.king && ((piece.player === PLAYER1 && dr > 0) || 
                    (piece.player === PLAYER2 && dr < 0))) continue;

                const nr = dr + r, nc = dc + c;
                if (inBounds(nr, nc) && !board[nr][nc]) {
                    moves.push({from: {row: r, col: c}, to: {row: nr, col: nc}, capture: false});
                } // end if allowed move

                // now do the captures
                const jr = r + dr * 2, jc = c + dc * 2;
                if (inBounds(jr, jc) && !board[jr][jc] && board[nr][nc] &&
                    board[nr][nc].player !== player) {
                    captures.push({
                        from: {row: r, col: c},
                        to: {row: jr, col: jc},
                        capture: {row: nr, col: nc}
                    });
                } // end if captures
            } // end directions
        } // end nested for c
    } // end for r

    return captures.length > 0 ? captures : moves;
} // end getValidMoves

// places the move and applies it
export function makeMove(board, move) {
    const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
    const piece = { ...newBoard[move.from.row][move.from.col] }; // clone piece

    newBoard[move.from.row][move.from.col] = null;
    newBoard[move.to.row][move.to.col] = piece;

    // Remove captured piece if any
    if (move.capture) {
        newBoard[move.capture.row][move.capture.col] = null;
    }

    // check if multijumps is available
    let moreCaptures = false;
    if (move.capture) {
        const furtherMoves = getValidMoves(newBoard, piece.player, move.to);
        if (furtherMoves.some(m => m.capture)) moreCaptures = true;
    }

    // promotion to king — after cloning, only affects this board
    if (!piece.king && (
        (piece.player === PLAYER1 && move.to.row === 0) ||
        (piece.player === PLAYER2 && move.to.row === BOARD_SIZE - 1)
    )) {
        piece.king = true;
    }

    return {
        newBoard,
        nextPlayer: moreCaptures ? piece.player : (piece.player === PLAYER2 ? PLAYER1 : PLAYER2),
        moreCaptures
    };
} // end makeMove