
const Square = ({isDark, isSelected, onClick, childern}) => {
  return (
    <div onClick={onClick}
      className={`w-16 h-16 flex items-center justify-center 
        ${isDark ? "bg-green-700" : "bg-green-300"}
        ${isSelected ? "ring-4 ring-yellow-300" : ""} cursor-pointer`}
    >
      {childern}
    </div>
  )
}

export default Square