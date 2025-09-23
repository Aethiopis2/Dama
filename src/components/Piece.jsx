import { PLAYER1, isKing } from '../logic/gameLogic'

const Piece = ({type}) => {
  const player = isKing(type) ? type.player : type;
  const king = isKing(type);

  return (
    <div
      className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center
        ${player === PLAYER1 ? "bg-red-500" : "bg-black border-2 border-gray-300"}
      `}
    >
      {king && <span className="text-white font-bold text-lg">👑</span>}
    </div>
  )
}

export default Piece