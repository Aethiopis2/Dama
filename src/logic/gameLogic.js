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

// // a king its its own object
// export function isKing(piece) {
//     return typeof piece === "object" && piece.king;
// } // end isKing

// function makeKing(piece) {
//     return {player: piece, king: true};
// } // end makeKing

// initalizes and returns a new board
export function initBoard() {
    const board = Array(BOARD_SIZE).fill().map(()=> Array(BOARD_SIZE).fill(EMPTY));

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if ((row + col) % 2 === 1) {
                if (row < 3) board[row][col] = {player: PLAYER2, king: false};
                if (row > 4) board[row][col] = {player: PLAYER1, king: false};
            } // end if mark
        } // end nested for col
    } // end for row

    return board;
} // end initBoard


// // determines the position is within the grid
// function inBounds(r, c) {
//     return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE; 
// } // end inBounds


// export function pieceOwner(piece) {
//     return isKing(piece) ? piece.player : piece;
// } // end pieceOwner


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
            if (onlyFrom && (onlyFrom.row !== r && onlyFrom.col !== c)) continue;

            // normal diagonals
            for (const {dr, dc} of directions) {
                if (!piece.king && ((piece.player === PLAYER1 && dr < 0) || 
                    (piece.player === PLAYER2 && dr > 0))) continue;

                const nr = dr + r, nc = dc + c;
                if (inBounds(nr, nc) && !board[nr][nc]) {
                    moves.push({from: {row: r, col: c}, to: {row: nr, col: nc}, capture: false});
                } // end if allowed move

                // now do the captures
                const jr = r + dr * 2, jc = c + dc * 2;
                if (inBounds(jr, jc) && !board[jr][jc] && board[nr][nc] &&
                    board[nr][nc] !== player) {
                    
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


// // checks if anything has been captured
// export function hasAnyCaptures(board, turn) {
//     for (let r = 0; r < BOARD_SIZE; r++) {
//         for (let c = 0; c < BOARD_SIZE; c++) {
//             if (pieceOwner(board[r][c]) === turn) {
//                 const moves = getValidMoves(board, turn, r, c);
//                 if (moves.some((m) => m.capture)) return true;
//             } // end if
//         } // end for c
//     } // end for r
//   return false;
// } // end hasAnyCaptures


// places the move and applies it
export function makeMove(board, move) {
    const newBoard = board.map((row) => row.slice());
    const piece = newBoard[move.from.row][move.from.col];

    newBoard[move.from.row][move.from.col] = null;
    newBoard[move.to.row][move.to.col] = piece;

    // Remove captured piece if any
    if (move.capture) {
        newBoard[move.capture.row][move.capture.col] = null;
    } // end if captured

    // promotion to king
    if (!piece.king && ((move.to.row === 0 && piece.player === PLAYER2) ||
        (move.to.row === BOARD_SIZE - 1 && piece.player === PLAYER1))) {
        piece.king = true;
    } // end if piece king

    // check if multijumps is available
    let moreCaptures = false;
    if (move.capture) {
        const furtherMoves = getValidMoves(board, piece.player, move.to);
        if (furtherMoves.some(m => m.capture))
            moreCaptures = true;
    } // end if


    return {newBoard, nextPlayer: moreCaptures ? 
        piece.player : (piece.player === PLAYER2 ? PLAYER1 : PLAYER2), moreCaptures };
} // end applyMove

// // returns all available moves with forced capture; i.e.
// //  the rules of the game
// export function getAllMoves(board, player) {
//     const all = [];
//     let captureMoves = [];

//     for (let r = 0; r < BOARD_SIZE; r++) {
//         for (let c = 0; c < BOARD_SIZE; c++) {
//             if (pieceOwner(board[r][c]) === player) {
//                 const moves = getValidMoves(board, player, r, c);
//                 moves.forEach(m => {
//                     all.push({from: [r, c], move: m});
//                     if (m.capture) captureMoves.push({from: [r, c], move: m});
//                 });
//             } // end if player's piece
//         } // for nested for c
//     } // end for r

//     return captureMoves.length > 0 ? captureMoves : all;
// } // end getAllMoves