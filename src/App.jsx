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
import Board3D from "./components/Board3D";
import Controls from "./components/Controls";

export default function App() {
  const [board, setBoard] = useState(initBoard());
  const [selected, setSelected] = useState(null);        // [r,c] or null
  const [validMoves, setValidMoves] = useState([]);      // moves for selected piece
  const [player, setPlayer] = useState(PLAYER1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [captured, setCaptured] = useState([]);
  const [aiDepth, setAiDepth] = useState(4);
  const [is3D, setIs3D] = useState(true);

  // Remove captured piece after fade-out
  function removePieceFromBoard(r, c) {
    setCapturedPieces(prev =>
      prev.filter(p => !(p.row === r && p.col === c))
    );
  } // end removePieceFromBoard

  function countPieces(p) {
    return board.flat().filter(piece => piece && piece.player === p).length;
  }

  // check for win/loss after every turn
  useEffect(() => {
    const movesLeft = getValidMoves(board, player);
    const countP1 = countPieces(PLAYER1);
    const countP2 = countPieces(PLAYER2);

    if (movesLeft === 0) {
      setGameOver(true);
      setWinner(countP2 > countP1 ? PLAYER2 : PLAYER1);
    } // end if
  }, [board, player]);

  // ai plays at ticks on its turn
  useEffect(() => {
    if (!gameOver && player === PLAYER2) {
      const timer = setTimeout(() => {
        const bestMove = aiMove(board, PLAYER2, aiDepth);
        if (bestMove) {
          const { newBoard, nextPlayer } = makeMove(board, bestMove);
          setBoard(newBoard);
          setCaptured([captured]);
          setPlayer(nextPlayer);
        } // end if bestMove
        else {
          setGameOver(true);
          setWinner(PLAYER1);
        } // end else
        setCaptured([]);
      }, 500);

      return () => clearTimeout(timer);
    } // end if 
  }, [player, board, gameOver]);

  function handleSquareClick(row, col) {
    if (gameOver || player !== PLAYER1) return;

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
          setCaptured([move.captured]);
          setValidMoves(getValidMoves(newBoard, PLAYER1, move.to));
        } // end if captures
        else {
          setPlayer(nextPlayer);
          setCaptured([]);
        } // end else not
      } // end if move
      else {
        setSelected(null);
        setCaptured([]);
        setValidMoves([]);
      } // end else not
    }  // end if selected
    else {
      const piece = board[row][col];
      if (piece && piece.player === PLAYER1) {
        setSelected({ row, col });
        setValidMoves(getValidMoves(board, PLAYER1, { row, col }));
      } // end if player piece selected
    } // end else first timer
  } // end handleSquareClick

  function restartGame() {
    setBoard(initBoard());
    setSelected(null);
    setValidMoves([]);
    setPlayer(PLAYER1);
    setGameOver(false);
    setWinner(null);
  } // end restartGame

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        {is3D ? (
          <Board3D board={board} onSquareClick={handleSquareClick}
            selected={selected} validMoves={validMoves} 
            capturedPieces={captured} removeCapturedPiece={removePieceFromBoard} />
        ) : (
          <Board
            board={board}
            selected={selected}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
          />
        )}
      </div>

      <Controls setIs3D={setIs3D} is3D={is3D} restartGame={restartGame} 
        gameOver={gameOver} aiDepth={aiDepth} setAiDepth={setAiDepth} />
    </div>
    
  );
}