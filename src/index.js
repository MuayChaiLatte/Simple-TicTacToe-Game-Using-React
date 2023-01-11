import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function calculateWinningLine(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c]; 
    }
  }
  return null;
}

function Square(props) {
  return (
    <button
      className= {`square ${props.isWinner? 'winner' : ''}`} // Only adds the winner class if square identified as a winner
      onClick={props.onClick}
      >
        {props.value}
      </button>
  )
}
  
  class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinner = {this.props.winningLine.includes(i)} // Checks if the winning line is present and if the currently rendered square is a winning square
                />
        );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          lastMove: null
        }],
        stepNumber: 0,
        xIsNext: true,
        moveListReversed: false,
      };
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    toggleMoveListOrder() {
      this.setState({
        moveListReversed: !this.state.moveListReversed
      })
    }

    handleClick(i) {

      // Associates indices of array representing TicTacToe squares with the actual positons
      const positions = {
        0: '(col: 1, row: 1)',
        1: '(col: 2, row: 1)',
        2: '(col: 3, row: 1)',
        3: '(col: 1, row: 2)',
        4: '(col: 2, row: 2)',
        5: '(col: 3, row: 2)',
        6: '(col: 1, row: 3)',
        7: '(col: 2, row: 3)',
        8: '(col: 3, row: 3)',
      }
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinningLine(squares) || squares[i]) {
        return
      }
      squares[i] = this.state.xIsNext? 'X' : 'O';

      this.setState({
        history: history.concat([{
          squares: squares,
          lastMove: positions[i] // Allows the lastMove played to be tracked along with squares being updated
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      })
    }
    
    render() {
      const history = this.state.history
      const current = history[this.state.stepNumber]
      const winner = calculateWinningLine(current.squares)

      let moves = history.map((step,moveNumber) => {
        const lastMove = step.lastMove
        const desc = moveNumber ?
          'Go to move #' + moveNumber + ` ${lastMove}`: // lastMove only added when the board is not in its initial state
          'Go to game start'; 
        return (          // The last move played or the last move jumped to is made bold based on if the stepNumber matches moveNumber
          <li key = {moveNumber}>
            <button onClick={() => this.jumpTo(moveNumber)}>
              <span className={this.state.stepNumber === moveNumber ?  'bold' : ''}>
                {desc}
              </span>
            </button>
          </li>
        )
      })
      if (this.state.moveListReversed) {
        moves = moves.reverse()
      }

      let status;
      if (winner) {
        status = 'Winner: ' + current.squares[winner[0]] // winner contains the positions of only winning squares so will select the correct character fomr squares
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O')
      }



      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares = {current.squares} 
            onClick = {(i) => this.handleClick(i)}
            winningLine = {winner? winner : ''} // winningLine only defined as a prop if a player wins
            />
          </div>
          <div className="game-info">
            <div><button onClick={() => this.toggleMoveListOrder()}>Toggle Move List Order</button></div>
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  

/*
ORIGINAL BOARD GAME
DESCRIPTION: Simple Tic Tac Toe game
FEATURES:
  Basic expected functionality of Tic Tac Toe:
    Prompts next player's turn
    Ends game and prevents further playing when game won
  
  Tracks move history and displays it for the players
  
  Any previously seen move can be "jumped to" changing the board state appropriately


FEATURES I HAVE ADDED:
Ability to display the location for each move in the format (col, row)
in the move history list

Bold the currently selected item in the move list.

Add a toggle button that lets you sort the moves in either ascending or descending order.

Highlights the three winning squares upon winning
*/