// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({renderSquare}) {
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])
  const [currStep, setCurrStep] = useLocalStorageState('tic-tac-toe:step', 0)

  const currSquares = history[currStep]
  const winner = calculateWinner(currSquares)
  const nextValue = calculateNextValue(currSquares)
  const status = calculateStatus(winner, currSquares, nextValue)

  function selectSquare(square) {
    if (winner || currSquares[square]) return

    const squares = [...currSquares]
    const historyCopy = history.slice(0, currStep + 1)

    squares[square] = nextValue
    setHistory([...historyCopy, squares])
    setCurrStep(historyCopy.length)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {currSquares[i]}
      </button>
    )
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrStep(0)
  }

  const moves = history.map((stepSquares, step) => {
    const desc = step === 0 ? 'Go to game start' : `Go to move #${step}`
    const isCurrentStep = step === currStep

    return (
      <li key={step}>
        <button onClick={() => setCurrStep(step)} disabled={isCurrentStep}>
          {desc}
          {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board renderSquare={renderSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>

      <div className="game-info">
        <div>{status}</div>

        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
