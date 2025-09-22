import Piece from './Piece'
import Square from './Square';

const Board = ({board, selected, onSquareClick}) => {
  return (
    <div className="grid grid-cols-8 gap-0 border-4 border-yellow-500">
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const isDark = (rIdx + cIdx) % 2 === 1;
          const isSelected =
            selected && selected[0] === rIdx && selected[1] === cIdx;
          return (
            <Square
              key={`${rIdx}-${cIdx}`}
              isDark={isDark}
              isSelected={isSelected}
              onClick={() => onSquareClick(rIdx, cIdx)}
            >
              {cell !== 0 && <Piece type={cell} />}
            </Square>
          );
        })
      )}
    </div>
  );
}

export default Board