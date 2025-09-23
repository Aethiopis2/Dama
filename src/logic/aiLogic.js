/**
 * @brief the AI opponent logic based on MinMax strategy with
 *  alpha-beta prunning
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 23rd of Septemeber 2025, Tuesday
 */

import { applyMove, BOARD_SIZE, getAllMoves, isKing, pieceOwner, PLAYER1, PLAYER2 } from "./gameLogic";


// evaluation function
function evaluateBoard(board, aiPlayer) {
    let score = 0;
    const opp = aiPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (!piece) continue;

            const owner = pieceOwner(piece);
            const king = isKing(piece);

            if (owner == aiPlayer) score += king ? 5 : 3;
            else if (owner === opp) score -= king ? 5 : 3;
        } // end for c
    } // end for r

    return score;
} // end evaluateBoard


// minmax with alpha-beta prunning
function minMax(board, depth, alpha, beta, maximizing, aiPlayer) {
    const opp = aiPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

    if (depth === 0) {
        return {score: evaluateBoard(board, aiPlayer)};
    } // end if

    const currentPlayer = maximizing ? aiPlayer : opp;
    const moves = getAllMoves(board, currentPlayer);

    if (moves.length === 0) {
        return {score: maximizing ? -9999 : 9999};  // losing state
    } // end if no more moves

    let bestMove = null;
    if (maximizing) {
        let maxVal = -Infinity;
        for (const {from, move} of moves) {
            const newBoard = applyMove(board, from[0], from[1], move);
            const evalResult = minMax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
            if (evalResult.score > maxVal) {
                maxVal = evalResult.score;
                bestMove = {from, move};
            } // end if evaluate score

            alpha = Math.max(alpha, evalResult.score);
            if (beta <= alpha) break;
        } // end for moves

        return {score: maxVal, bestMove};
    } // end if maximizing
    else {
        let minVal = Infinity;
        for (const {from, move} of moves) {
            const newBoard = applyMove(board, from[0], from[1], move);
            const evalResult = minMax(board, depth - 1, alpha, beta, true, aiPlayer);
            if (evalResult.score < minVal) {
                minVal = evalResult.score;
                bestMove = {from, move};
            } // end if
            
            beta = Math.min(beta, evalResult.score);
            if (beta <= alpha) break;
        } // end for
        
        return {score: minVal, bestMove};
    } // end else minimizing
} // end minMax


export function findBestMove(board, aiPlayer, depth = 4) {
  return minMax(board, depth, -Infinity, Infinity, true, aiPlayer).bestMove;
} // end findBestMove