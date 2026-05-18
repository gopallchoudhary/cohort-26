

interface BlockProps {
  value: string | null
  onClick: () => void
  isWinning?: boolean
  gameOver?: boolean
}

// Slightly wobbly X — two crossing lines that aren't perfectly straight
const XMark = () => (
  <div className="mark-x">
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* first diagonal — top-left to bottom-right */}
      <path d="M10,11 Q22,30 53,54" strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.28s" fill="freeze" />
      </path>
      {/* second diagonal — top-right to bottom-left */}
      <path d="M54,10 Q35,33 11,54" strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.28s" begin="0.1s" fill="freeze" />
      </path>
    </svg>
  </div>
)

// Slightly wobbly O — an imperfect ellipse
const OMark = () => (
  <div className="mark-o">
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        cx="32" cy="32" rx="22" ry="22"
        transform="rotate(-8 32 32)"
        strokeDasharray="250"
        strokeDashoffset="250"
      >
        <animate attributeName="stroke-dashoffset" from="250" to="0" dur="0.4s" fill="freeze" />
      </ellipse>
    </svg>
  </div>
)

const Block = ({ value, onClick, isWinning = false, gameOver = false }: BlockProps) => {
  return (
    <div
      className={`cell ${value ? 'filled' : ''} ${isWinning ? 'winning' : ''} ${gameOver ? 'game-over' : ''}`}
      onClick={onClick}
    >
      {value === 'X' && <XMark />}
      {value === 'O' && <OMark />}
    </div>
  )
}

export default Block