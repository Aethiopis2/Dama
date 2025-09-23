// src/App.jsx
import React, { useState } from "react";
import Board from "./components/Board";
import {
  initBoard,
  getValidMoves,
  applyMove,
  hasAnyCaptures,
  pieceOwner,
  PLAYER1,
  PLAYER2,
} from "./logic/gameLogic";

export default function App() {
  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState(null);        // [r,c] or null
  const [validMoves, setValidMoves] = useState([]);      // moves for selected piece
  const [turn, setTurn] = useState(PLAYER1);

  function handleSquareClick(row, col) {
    // 1) Nothing selected -> try select a piece that belongs to current player
    if (!selected) {
      const piece = board[row][col];
      if (pieceOwner(piece) === turn) {
        const moves = getValidMoves(board, turn, row, col);
        const mustCapture = hasAnyCaptures(board, turn);
        const filtered = mustCapture ? moves.filter(m => m.capture) : moves;

        if (filtered.length > 0) {
          setSelected([row, col]);
          setValidMoves(filtered);
        } else {
          // piece has no legal moves -> keep nothing selected
          setSelected(null);
          setValidMoves([]);
        }
      }
      return;
    }

    // 2) Clicked the same selected square -> deselect
    if (selected[0] === row && selected[1] === col) {
      setSelected(null);
      setValidMoves([]);
      return;
    }

    // 3) If clicked a valid destination -> perform the move
    const chosenMove = validMoves.find(m => m.tr === row && m.tc === col);
    if (chosenMove) {
      // compute the resulting board synchronously so we can inspect further moves
      const newBoard = applyMove(board, selected[0], selected[1], chosenMove);
      setBoard(newBoard);

      if (chosenMove.capture) {
        // If the move was a capture, check whether the moved piece can capture again
        const further = getValidMoves(newBoard, turn, chosenMove.tr, chosenMove.tc)
          .filter(m => m.capture);

        if (further.length > 0) {
          // More captures available -> same player continues, new selection is landing square
          setSelected([chosenMove.tr, chosenMove.tc]);
          setValidMoves(further);
          return;
        }
      }

      // No further captures (or the move wasn't a capture) -> switch turn
      setSelected(null);
      setValidMoves([]);
      setTurn(prev => (prev === PLAYER1 ? PLAYER2 : PLAYER1));
      return;
    }

    // 4) Clicked another friendly piece while something selected -> switch selection
    const clickedPiece = board[row][col];
    if (pieceOwner(clickedPiece) === turn) {
      const moves = getValidMoves(board, turn, row, col);
      const mustCapture = hasAnyCaptures(board, turn);
      const filtered = mustCapture ? moves.filter(m => m.capture) : moves;
      if (filtered.length > 0) {
        setSelected([row, col]);
        setValidMoves(filtered);
      } else {
        setSelected(null);
        setValidMoves([]);
      }
      return;
    }

    // 5) Otherwise click was invalid -> deselect
    setSelected(null);
    setValidMoves([]);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      <h1 className="text-white mb-4 text-2xl">
        {turn === PLAYER1 ? "🔴 Red's Turn" : "⚫ Black's Turn"}
      </h1>

      <Board
        board={board}
        selected={selected}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}