import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

interface Room {
  code: string
  players: {
    X?: string // socket ID
    O?: string // socket ID
  }
  board: (string | null)[]
  currentPlayer: 'X' | 'O'
  scores: {
    X: number
    O: number
    draws: number
  }
  startingPlayer: 'X' | 'O' // to alternate starting player
}

const rooms = new Map<string, Room>()

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

// Generate unique 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code: string
  do {
    code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  } while (rooms.has(code))
  return code
}

// Find room and symbol for a socket
function getSocketRoom(socketId: string): { room: Room; symbol: 'X' | 'O' } | null {
  for (const room of rooms.values()) {
    if (room.players.X === socketId) {
      return { room, symbol: 'X' }
    }
    if (room.players.O === socketId) {
      return { room, symbol: 'O' }
    }
  }
  return null
}

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`)

  // Create room
  socket.on('create-room', () => {
    const code = generateRoomCode()
    const room: Room = {
      code,
      players: { X: socket.id },
      board: Array(9).fill(null),
      currentPlayer: 'X',
      scores: { X: 0, O: 0, draws: 0 },
      startingPlayer: 'X',
    }
    rooms.set(code, room)
    socket.join(code)

    console.log(`Room created: ${code} by ${socket.id}`)
    socket.emit('room-created', {
      code,
      symbol: 'X',
      scores: room.scores,
    })
  })

  // Join room
  socket.on('join-room', (code: string) => {
    const uppercaseCode = code.trim().toUpperCase()
    const room = rooms.get(uppercaseCode)

    if (!room) {
      socket.emit('room-error', 'Room not found! Check the code and try again.')
      return
    }

    if (room.players.X && room.players.O) {
      socket.emit('room-error', 'Room is full! Only 2 players allowed.')
      return
    }

    // Set player O
    room.players.O = socket.id
    socket.join(uppercaseCode)

    console.log(`User ${socket.id} joined room ${uppercaseCode}`)

    // Notify player O of join details
    socket.emit('room-joined', {
      code: uppercaseCode,
      symbol: 'O',
      board: room.board,
      currentPlayer: room.currentPlayer,
      scores: room.scores,
    })

    // Notify player X that opponent joined, starting the game
    io.to(room.players.X!).emit('opponent-joined', {
      scores: room.scores,
      board: room.board,
      currentPlayer: room.currentPlayer,
    })

    // Broadcast update to the room
    io.to(uppercaseCode).emit('game-update', {
      board: room.board,
      currentPlayer: room.currentPlayer,
      scores: room.scores,
      active: true,
    })
  })

  // Make move
  socket.on('make-move', ({ index }: { index: number }) => {
    const details = getSocketRoom(socket.id)
    if (!details) return

    const { room, symbol } = details

    // Validate turn
    if (room.currentPlayer !== symbol) {
      socket.emit('move-error', "It's not your turn!")
      return
    }

    // Validate vacancy and active room (both players present)
    if (!room.players.X || !room.players.O) {
      socket.emit('move-error', 'Waiting for opponent to join!')
      return
    }

    if (room.board[index] !== null) {
      socket.emit('move-error', 'Cell already taken!')
      return
    }

    // Update board
    room.board[index] = symbol

    // Check winner
    const { winner, line: winLine } = checkWinner(room.board)
    const isDraw = !winner && room.board.every((cell) => cell !== null)

    if (winner) {
      room.scores[winner as 'X' | 'O'] += 1
      io.to(room.code).emit('game-over', {
        board: room.board,
        winner,
        winLine,
        scores: room.scores,
      })
    } else if (isDraw) {
      room.scores.draws += 1
      io.to(room.code).emit('game-over', {
        board: room.board,
        winner: null,
        winLine: null,
        isDraw: true,
        scores: room.scores,
      })
    } else {
      // Toggle player turn
      room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X'
      io.to(room.code).emit('game-update', {
        board: room.board,
        currentPlayer: room.currentPlayer,
        scores: room.scores,
        active: true,
      })
    }
  })

  // Restart game
  socket.on('restart-game', () => {
    const details = getSocketRoom(socket.id)
    if (!details) return

    const { room } = details

    // Reset board
    room.board = Array(9).fill(null)

    // Alternate starting player
    room.startingPlayer = room.startingPlayer === 'X' ? 'O' : 'X'
    room.currentPlayer = room.startingPlayer

    console.log(`Room ${room.code} restarted. Next starting: ${room.currentPlayer}`)

    io.to(room.code).emit('game-restarted', {
      board: room.board,
      currentPlayer: room.currentPlayer,
      scores: room.scores,
    })
  })

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    const details = getSocketRoom(socket.id)
    if (!details) return

    const { room, symbol } = details

    // Notify opponent
    const opponentId = symbol === 'X' ? room.players.O : room.players.X
    if (opponentId) {
      io.to(opponentId).emit('opponent-disconnected')
    }

    // Clean up or remove player from room
    if (symbol === 'X') {
      delete room.players.X
    } else {
      delete room.players.O
    }

    // If both players left, delete room
    if (!room.players.X && !room.players.O) {
      rooms.delete(room.code)
      console.log(`Room deleted: ${room.code}`)
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Multiplayer server listening on port ${PORT}`)
})
