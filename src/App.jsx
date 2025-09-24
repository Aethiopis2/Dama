// src/App.jsx
import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import {
  initBoard,
  getValidMoves,
  PLAYER1,
  PLAYER2,
  makeMove,
} from "./logic/gameLogic";
import { aiMove } from "./logic/aiLogic";

export default function App() {
  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState(null);        // [r,c] or null
  const [validMoves, setValidMoves] = useState([]);      // moves for selected piece
  const [player, setPlayer] = useState(PLAYER1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // check for win/loss after every turn
  useEffect(() => {
    const movesLeft = getValidMoves(board, player);
    if (movesLeft === 0) {
      setGameOver(true);
      setWinner(player === PLAYER2 ? PLAYER2 : PLAYER1);
    } // end if
  }, [board, player]);

  // ai plays at ticks on its turn
  useEffect(() => {
    if (!gameOver && player === PLAYER1) {
      const timer = setTimeout(() => {
        const bestMove = aiMove(board, PLAYER1);
        if (bestMove) {
          const { newBoard, nextPlayer } = makeMove(board, bestMove);
          setBoard(newBoard);
          setPlayer(nextPlayer);
        } // end if bestMove
        else {
          setGameOver(true);
          setWinner(PLAYER1);
        } // end else
      }, 500);

      return () => clearTimeout(timer);
    } // end if 
  }, [player, board, gameOver]);

  function handleSquareClick(row, col) {
    if (gameOver || player !== "R") return;
    if (selected) {
      const move = validMoves.find((m) => m.to.row === row && m.to.col === col);
      if (move) {
        const { newBoard, nextPlayer, moreCaptures } = makeMove(board, move);
        setBoard(newBoard);
        setSelected(null);
        setValidMoves([]);
        if (moreCaptures) {
          // Let player continue capturing if possible
          setSelected(move.to);
          setValidMoves(getValidMoves(newBoard, "R", move.to));
        } else {
          setPlayer(nextPlayer);
        }
      } else {
        setSelected(null);
        setValidMoves([]);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.color === "R") {
        setSelected({ row, col });
        setValidMoves(getValidMoves(board, "R", { row, col }));
      }
    }
  }

  function restartGame() {
    setBoard(initBoard());
    setSelected(null);
    setValidMoves([]);
    setPlayer("R");
    setGameOver(false);
    setWinner(null);
  }

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-2xl font-bold">Dama / Checkers</h1>
      <Board
        board={board}
        selected={selected}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
      {gameOver && (
        <div className="text-center">
          <p className="text-lg font-semibold">
            {winner === "R"
              ? "🎉 You Win!"
              : winner === "B"
              ? "😢 You Lose!"
              : "🤝 Draw!"}
          </p>
          <button
            onClick={restartGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Restart Game
          </button>
        </div>
      )}
      {!gameOver && <p className="italic">Current Turn: {player}</p>}
    </div>
  );
}