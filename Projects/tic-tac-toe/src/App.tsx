import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import Block from "./components/Block"
import "./App.css"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"

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
  const [localScores, setLocalScores] = useState({ X: 0, O: 0, draws: 0 })

  // Multiplayer mode states
  const [gameMode, setGameMode] = useState<"local" | "online">("local")
  const socketRef = useRef<Socket | null>(null)
  const [sessionKey, setSessionKey] = useState<number>(0)
  const [roomCode, setRoomCode] = useState<string>("")
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null)
  const [roomStatus, setRoomStatus] = useState<"lobby" | "waiting" | "active" | "disconnected">("lobby")
  const [lobbyError, setLobbyError] = useState<string | null>(null)
  const [joinInput, setJoinInput] = useState<string>("")
  const [onlineScores, setOnlineScores] = useState({ X: 0, O: 0, draws: 0 })
  const [copied, setCopied] = useState<boolean>(false)

  const { winner, line: winLine } = checkWinner(board)
  const isDraw = !winner && board.every(Boolean)
  const gameOver = !!winner || isDraw

  const scores = gameMode === "local" ? localScores : onlineScores

  // Socket IO setup
  useEffect(() => {
    if (gameMode === "online") {
      console.log("Connecting to Socket.io server at", SOCKET_URL)
      const newSocket = io(SOCKET_URL)
      socketRef.current = newSocket

      newSocket.on("connect", () => {
        console.log("Connected to server!")
      })

      newSocket.on("room-created", ({ code, symbol, scores: initialScores }) => {
        setRoomCode(code)
        setPlayerSymbol(symbol)
        setRoomStatus("waiting")
        setOnlineScores(initialScores)
        setLobbyError(null)
      })

      newSocket.on("room-joined", ({ code, symbol, board: sBoard, currentPlayer: sTurn, scores: initialScores }) => {
        setRoomCode(code)
        setPlayerSymbol(symbol)
        setRoomStatus("active")
        setBoard(sBoard)
        setCurrentPlayer(sTurn)
        setOnlineScores(initialScores)
        setLobbyError(null)
      })

      newSocket.on("opponent-joined", ({ board: sBoard, currentPlayer: sTurn, scores: sScores }) => {
        setRoomStatus("active")
        setBoard(sBoard)
        setCurrentPlayer(sTurn)
        setOnlineScores(sScores)
      })

      newSocket.on("game-update", ({ board: sBoard, currentPlayer: sTurn, scores: sScores }) => {
        setBoard(sBoard)
        setCurrentPlayer(sTurn)
        setOnlineScores(sScores)
        setRoomStatus("active")
      })

      newSocket.on("game-over", ({ board: sBoard, scores: sScores }) => {
        setBoard(sBoard)
        setOnlineScores(sScores)
      })

      newSocket.on("game-restarted", ({ board: sBoard, currentPlayer: sTurn, scores: sScores }) => {
        setBoard(sBoard)
        setCurrentPlayer(sTurn)
        setOnlineScores(sScores)
      })

      newSocket.on("room-error", (msg) => {
        setLobbyError(msg)
      })

      newSocket.on("opponent-disconnected", () => {
        setRoomStatus("disconnected")
      })

      return () => {
        newSocket.disconnect()
        socketRef.current = null
      }
    } else {
      socketRef.current = null
    }
  }, [gameMode, sessionKey])

  function handleClick(index: number) {
    if (board[index] || gameOver) return

    if (gameMode === "online") {
      if (roomStatus !== "active") return
      if (currentPlayer !== playerSymbol) return
      socketRef.current?.emit("make-move", { index })
      return
    }

    const next = [...board]
    next[index] = currentPlayer
    setBoard(next)

    const { winner: w } = checkWinner(next)
    const draw = !w && next.every(Boolean)

    if (w) {
      setLocalScores(s => ({ ...s, [w]: s[w as "X" | "O"] + 1 }))
    } else if (draw) {
      setLocalScores(s => ({ ...s, draws: s.draws + 1 }))
    } else {
      setCurrentPlayer(p => (p === "X" ? "O" : "X"))
    }
  }

  function handleReset() {
    if (gameMode === "online") {
      socketRef.current?.emit("restart-game")
      return
    }

    setBoard(Array(9).fill(null))
    setCurrentPlayer(winner ?? (isDraw ? "X" : currentPlayer))
  }

  function handleBackToLobby() {
    setSessionKey(k => k + 1)
    setRoomCode("")
    setPlayerSymbol(null)
    setRoomStatus("lobby")
    setLobbyError(null)
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
  }

  const switchToLocal = () => {
    setGameMode("local")
    setRoomCode("")
    setPlayerSymbol(null)
    setRoomStatus("lobby")
    setLobbyError(null)
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
  }

  const handleCreateRoom = () => {
    socketRef.current?.emit("create-room")
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinInput.trim()) return
    socketRef.current?.emit("join-room", joinInput)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Status text
  let statusText: string
  let statusClass = ""
  if (winner) {
    statusText = gameMode === "online"
      ? (winner === playerSymbol ? "You win! 🎉" : "Opponent wins! 😢")
      : `Player ${winner} wins! 🎉`
    statusClass = `winner-${winner.toLowerCase()}`
  } else if (isDraw) {
    statusText = "It's a draw! 🤝"
    statusClass = "draw"
  } else {
    if (gameMode === "online") {
      if (currentPlayer === playerSymbol) {
        statusText = `Your turn (Player ${playerSymbol}) ✏️`
      } else {
        statusText = `Opponent's turn (Player ${currentPlayer}) ⏳`
      }
    } else {
      statusText = `Player ${currentPlayer}'s turn`
    }
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

        {/* Mode Selector */}
        <div className="mode-selector">
          <button
            className={`mode-btn ${gameMode === "local" ? "active" : ""}`}
            onClick={switchToLocal}
          >
            Local Play ✏️
          </button>
          <button
            className={`mode-btn ${gameMode === "online" ? "active" : ""}`}
            onClick={() => setGameMode("online")}
          >
            Online Play 🌐
          </button>
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

        {gameMode === "online" && roomStatus === "lobby" && (
          <div className="lobby-container">
            <div className="lobby-card">
              <h2 className="lobby-heading">Create Room</h2>
              <p className="lobby-desc">Start a new online game and invite a friend.</p>
              <button className="lobby-btn create" onClick={handleCreateRoom}>
                Create Room ⚡
              </button>
            </div>

            <div className="lobby-divider">
              <span className="divider-text">OR</span>
            </div>

            <div className="lobby-card">
              <h2 className="lobby-heading">Join Room</h2>
              <p className="lobby-desc">Enter a room code to join an existing game.</p>
              <form onSubmit={handleJoinRoom} className="lobby-form">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                  className="lobby-input"
                  maxLength={6}
                />
                <button type="submit" className="lobby-btn join">
                  Join Room ↩
                </button>
              </form>
              {lobbyError && <p className="lobby-error">⚠️ {lobbyError}</p>}
            </div>
          </div>
        )}

        {gameMode === "online" && roomStatus === "waiting" && (
          <div className="lobby-container">
            <div className="lobby-card waiting-card">
              <h2 className="lobby-heading">Room Created!</h2>
              <p className="lobby-desc">Share this code with your opponent:</p>
              
              <div className="code-display-container">
                <span className="code-text">{roomCode}</span>
                <button className="copy-btn" onClick={copyToClipboard}>
                  {copied ? "Copied! 📋" : "Copy 📄"}
                </button>
              </div>
              
              <div className="waiting-spinner">
                <span className="loading-pencil">✏️</span>
                <p className="waiting-text">Waiting for Player 2 to join...</p>
              </div>

              <button className="lobby-btn cancel" onClick={handleBackToLobby}>
                Cancel Room ❌
              </button>
            </div>
          </div>
        )}

        {gameMode === "online" && roomStatus === "disconnected" && (
          <div className="lobby-container">
            <div className="lobby-card disconnected-card">
              <h2 className="lobby-heading">Connection Lost!</h2>
              <p className="lobby-desc">Your opponent has disconnected from the room.</p>
              
              <button className="lobby-btn cancel" onClick={handleBackToLobby}>
                Back to Lobby ↩
              </button>
            </div>
          </div>
        )}

        {/* Game Active Screen (Local or Active Online) */}
        {(gameMode === "local" || roomStatus === "active") && (
          <>
            {/* Status */}
            <div className={`status-banner ${statusClass}`}>
              {statusText}
            </div>

            {gameMode === "online" && roomStatus === "active" && playerSymbol && (
              <div className={`player-badge badge-${playerSymbol.toLowerCase()}`}>
                You are Player {playerSymbol}
              </div>
            )}

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
                    currentPlayer={currentPlayer}
                  />
                ))}
              </div>
            </div>

            <div className="controls-container">
              {/* Reset / Play Again Button */}
              {(!gameOver && gameMode === "online") ? null : (
                <button className="reset-btn" onClick={handleReset}>
                  {gameOver ? "Play Again ↩" : "Reset ↺"}
                </button>
              )}

              {/* Online mode leave button */}
              {gameMode === "online" && roomStatus === "active" && (
                <button className="leave-btn" onClick={handleBackToLobby}>
                  Leave Room 🚪
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
