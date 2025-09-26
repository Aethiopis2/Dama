import Piece from './Piece'

const Board = ({board, selected, validMoves, onSquareClick}) => {
  return (
    <div className="grid grid-cols-8 gap-0 border-4 border-gray-700">
      {board.map((row, r) =>
        row.map((piece, c) => {
          const isDark = (r + c) % 2 === 1;
          const isSelected = selected && selected.row === r && selected.col === c;
          const isValid = validMoves.some((m) => m.to.row === r && m.to.col === c);

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => onSquareClick(r, c)}
              className={`w-16 h-16 flex items-center justify-center cursor-pointer 
                ${isDark ? "bg-gray-600" : "bg-gray-200"} 
                ${isSelected ? "ring-4 ring-yellow-400" : ""} 
                ${isValid ? "bg-green-300" : ""}`}
            >
              {piece ? (
                <Piece type={board[r][c]} />
              ): ""}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Board