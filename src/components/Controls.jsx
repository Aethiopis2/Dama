
const Controls = ({setIs3D, is3D, restartGame, gameOver, aiDepth, setAiDepth}) => {
    
  return (
    <aside className="w-1/6 p-4 bg-gray-200 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Controls</h2>

        {/* 2D/3D toggle */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => setIs3D(!is3D)}
        >
          Switch to {is3D ? "2D" : "3D"}
        </button>

        {/* AI depth slider */}
        <div>
          <label htmlFor="depth" className="block mb-1 font-semibold">
            AI Depth: {aiDepth}
          </label>
          <input
            id="depth"
            type="range"
            min="1"
            max="9"
            value={aiDepth}
            onChange={(e) => setAiDepth(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Restart button */}
        <button
          onClick={restartGame}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Restart Game
        </button>

        {/* Game status */}
        {gameOver && (
          <p className="mt-4 text-lg font-semibold">
            {winner === PLAYER1
              ? "🎉 You Win!"
              : winner === PLAYER2
              ? "😢 You Lose!"
              : "🤝 Draw!"}
          </p>
        )}
      </aside>
  )
}

export default Controls