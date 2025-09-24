/**
 * @brief the AI opponent logic based on MinMax strategy with
 *  alpha-beta prunning
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 23rd of Septemeber 2025, Tuesday
 */

import { BOARD_SIZE, getValidMoves, makeMove, PLAYER1, PLAYER2 } from "./gameLogic";


// evaluation function
function evaluateBoard(board) {
    let score = 0;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (!piece) continue;

            const val = piece.king ? 3 : 1;
            score += piece.player === PLAYER1 ? val : -val;
        } // end for c
    } // end for r

    return score;
} // end evaluateBoard


// minmax with alpha-beta prunning
function minMax(board, depth, maximizing, alpha, beta) {
    const player = maximizing ? PLAYER1 : PLAYER2;
    const moves = getValidMoves(board, player);

    if (depth === 0 || moves.length === 0) {
        return {score: evaluateBoard(board)};
    } // end if

    let bestMove = null;

    if (maximizing) {
        let maxVal = -Infinity;
        for (const move of moves) {
            const { newBoard } = makeMove(board, move);
            const evalResult = minMax(newBoard, depth - 1, false, alpha, beta).score;
            if (evalResult > maxVal) {
                maxVal = evalResult;
                bestMove = move;
            } // end if evaluate score

            alpha = Math.max(alpha, evalResult);
            if (beta <= alpha) break;
        } // end for moves

        return {score: maxVal, move: bestMove};
    } // end if maximizing
    else {
        let minVal = Infinity;
        for (const {from, move} of moves) {
            const { newBoard } = makeMove(board, move);
            const evalResult = minMax(newBoard, depth - 1, false, alpha, beta).score;
            if (evalResult < minVal) {
                minVal = evalResult.score;
                bestMove = move;
            } // end if
            
            beta = Math.min(beta, evalResult);
            if (beta <= alpha) break;
        } // end for
        
        return {score: minVal, move: bestMove};
    } // end else minimizing
} // end minMax


export function aiMove(board, player) {
    const depth = 4;        // change this here
    const { move } = minMax(board, depth, player === PLAYER1, -Infinity, Infinity);
    return move;
} // end findBestMove