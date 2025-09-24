import { PLAYER1 } from '../logic/gameLogic'

const Piece = ({type}) => {

  return (
    <div
      className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center
        ${type.player === PLAYER1 ? "bg-red-500" : "bg-black border-2 border-gray-300"}
      `}
    >
      {type.king && <span className="text-white font-bold text-lg">👑</span>}
    </div>
  )
}

export default Piece