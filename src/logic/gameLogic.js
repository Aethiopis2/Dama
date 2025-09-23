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

// a king its its own object
export function isKing(piece) {
    return typeof piece === "object" && piece.king;
} // end isKing

function makeKing(piece) {
    return {player: piece, king: true};
} // end makeKing

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


// determines the position is within the grid
function inBounds(r, c) {
    return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE; 
} // end inBounds


export function pieceOwner(piece) {
    return isKing(piece) ? piece.player : piece;
} // end pieceOwner


// determines all the valid moves given the current position
export function getValidMoves(board, turn, sr, sc) {
    const moves = [];
    const piece = board[sr][sc];
    if (piece === EMPTY || pieceOwner(piece) !== turn) return moves;

    const dirs = [];
    if (isKing(piece)) {
        dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
    } // end if
    else {
        const dir = turn === PLAYER1 ? -1 : 1;
        dirs.push([dir,1],[dir,-1]);
    } // end else

    // normal diagonals
    for (const [dr, dc] of dirs) {
        const tr = sr + dr;
        const tc = sc + dc;
        if (inBounds(tr, tc) && board[tr][tc] === EMPTY) {
            moves.push({ tr, tc, capture: false });
        } // end if
    } // end for

    // Capture moves (jumping)
    for (const [dr, dc] of dirs) {
        const mr = sr + dr;
        const mc = sc + dc;
        const tr = sr + dr * 2;
        const tc = sc + dc * 2;

        if (inBounds(tr, tc) && board[tr][tc] === EMPTY &&
            board[mr][mc] !== EMPTY && pieceOwner(board[mr][mc]) !== turn) {
            moves.push({ tr, tc, capture: true, captured: [mr, mc] });
        } // end if
    } // end for

    return moves;
} // end getValidMoves


// checks if anything has been captured
export function hasAnyCaptures(board, turn) {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (pieceOwner(board[r][c]) === turn) {
                const moves = getValidMoves(board, turn, r, c);
                if (moves.some((m) => m.capture)) return true;
            } // end if
        } // end for c
    } // end for r
  return false;
} // end hasAnyCaptures


// places the move and applies it
export function applyMove(board, sr, sc, move) {
    const newBoard = board.map((row) => row.slice());
    const piece = newBoard[sr][sc];
    newBoard[sr][sc] = EMPTY;
    newBoard[move.tr][move.tc] = piece;

    // Remove captured piece if any
    if (move.capture) {
        const [cr, cc] = move.captured;
        newBoard[cr][cc] = EMPTY;
    }

    // promotion to king
    if (!isKing(piece)) {
        if (piece === PLAYER1 && move.tr === 0)
            newBoard[move.tr][move.tc] = makeKing(PLAYER1);
        if (piece === PLAYER2 && move.tr === BOARD_SIZE - 1)
            newBoard[move.tr][move.tc] = makeKing(PLAYER2);
    }
    return newBoard;
} // end applyMove

// returns all available moves with forced capture; i.e.
//  the rules of the game
export function getAllMoves(board, player) {
    const all = [];
    let captureMoves = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (pieceOwner(board[r][c]) === player) {
                const moves = getValidMoves(board, player, r, c);
                moves.forEach(m => {
                    all.push({from: [r, c], move: m});
                    if (m.capture) captureMoves.push({from: [r, c], move: m});
                });
            } // end if player's piece
        } // for nested for c
    } // end for r

    return captureMoves.length > 0 ? captureMoves : all;
} // end getAllMoves