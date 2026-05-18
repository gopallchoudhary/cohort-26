import { useState } from "react"
import Block from "./components/Block"
import "./App.css"

// ── Win conditions ──────────────────────────────────────────────────────────
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
]

function checkWinner(board: (string | null)[]): { winner: string | null; line: number[] | null } {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  return { winner: null, line: null }
}

// ── Sketchy SVG grid lines ──────────────────────────────────────────────────
const SketchGrid = () => (
  <svg className="board-svg" viewBox="0 0 330 330" xmlns="http://www.w3.org/2000/svg">
    {/* vertical line 1 */}
    <path d="M110,8 Q111,80 109,160 Q110,240 111,322" stroke="#2c2c2c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* vertical line 2 */}
    <path d="M220,8 Q221,90 219,165 Q220,245 221,322" stroke="#2c2c2c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* horizontal line 1 */}
    <path d="M8,110 Q90,109 165,111 Q245,110 322,109" stroke="#2c2c2c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* horizontal line 2 */}
    <path d="M8,220 Q90,221 165,219 Q245,220 322,221" stroke="#2c2c2c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
)

// ── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<string>("X")
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const { winner, line: winLine } = checkWinner(board)
  const isDraw = !winner && board.every(Boolean)
  const gameOver = !!winner || isDraw

  function handleClick(index: number) {
    if (board[index] || gameOver) return
    const next = [...board]
    next[index] = currentPlayer
    console.log(next);
    
    setBoard(next)
    
    

    const { winner: w } = checkWinner(next)
    const draw = !w && next.every(Boolean)

    if (w) {
      setScores(s => ({ ...s, [w]: s[w as "X" | "O"] + 1 }))
    } else if (draw) {
      setScores(s => ({ ...s, draws: s.draws + 1 }))
    } else {
      setCurrentPlayer(p => (p === "X" ? "O" : "X"))
    }
  }

  function handleReset() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(winner ?? (isDraw ? "X" : currentPlayer))
  }

  // Status text
  let statusText = ""
  let statusClass = ""
  if (winner) {
    statusText = `Player ${winner} wins! 🎉`
    statusClass = `winner-${winner.toLowerCase()}`
  } else if (isDraw) {
    statusText = "It's a draw! 🤝"
    statusClass = "draw"
  } else {
    statusText = `Player ${currentPlayer}'s turn`
  }

  return (
    <>
      {/* Corner doodles */}
      <div className="doodle-corner tl">✏️</div>
      <div className="doodle-corner tr">📐</div>
      <div className="doodle-corner bl">📏</div>
      <div className="doodle-corner br">✏️</div>

      <div className="app-wrapper">
        {/* Title */}
        <div>
          <h1 className="game-title">
            <span className="x-letter">X</span>ic-
            <span className="o-letter">O</span>ac-Toe
          </h1>
          <div className="title-underline" />
        </div>

        {/* Scoreboard */}
        <div className="scoreboard">
          <div className="score-card">
            <span className="score-label x">Player X</span>
            <span className="score-value">{scores.X}</span>
          </div>
          <span className="score-divider">vs</span>
          <div className="score-card">
            <span className="score-label o">Player O</span>
            <span className="score-value">{scores.O}</span>
          </div>
          <div className="score-card">
            <span className="score-label">Draws</span>
            <span className="score-value">{scores.draws}</span>
          </div>
        </div>

        {/* Status */}
        <div className={`status-banner ${statusClass}`}>
          {statusText}
        </div>

        {/* Board */}
        <div className="board-container">
          <SketchGrid />
          <div className="board">
            {board.map((val, index) => (
              <Block
                key={index}
                value={val}
                onClick={() => handleClick(index)}
                isWinning={winLine?.includes(index) ?? false}
                gameOver={gameOver}
              />
            ))}
          </div>
        </div>

        {/* Reset */}
        <button className="reset-btn" onClick={handleReset}>
          {gameOver ? "Play Again ↩" : "Reset ↺"}
        </button>
      </div>
    </>
  )
}

export default App
