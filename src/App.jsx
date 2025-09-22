import { useState } from 'react'
import './index.css'
import { initBoard, isValidMove, movePiece, PLAYER1, PLAYER2 } from './logic/gameLogic'
import Board from './components/Board';

function App() {
  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState(PLAYER1);

  function handleSquareClick(row, col) {
    if (selected) {
      const [sr, sc] = selected;
      if (isValidMove(board, turn, sr, sc, row, col)) {
        setBoard(movePiece(board, sr, sc, row, col));
        setTurn(turn === PLAYER1 ? PLAYER2 : PLAYER1);
      } // end if isVaid move

      setSelected(null);
    } // end if selected
    else {
      if (board[row][col] === turn) setSelected[row, col];
    } // end else mark
  } // end handleSquareClick

  return (
    <div className='flex justify-center items-center h-screen bg-gray-900'>
      <Board board={board} selected={selected} onSquareClick={handleSquareClick} />
    </div>
  )
}

export default App
