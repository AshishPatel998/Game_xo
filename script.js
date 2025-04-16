const board = document.getElementById("board");
const info = document.getElementById("info");

let cells = [];
let currentPlayer = "X";
let gameActive = true;

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", onCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }

  info.textContent = "Your turn (X)";
  gameActive = true;
}

function onCellClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== "") return;

  cell.textContent = currentPlayer;
  if (checkWinner(currentPlayer)) {
    info.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    info.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  info.textContent = "Computer's turn (O)";
  setTimeout(computerMove, 500);
}

function computerMove() {
  const bestMove = getBestMove();
  cells[bestMove].textContent = "O";

  if (checkWinner("O")) {
    info.textContent = "Computer wins! 😢";
    gameActive = false;
    return;
  }

  if (isDraw()) {
    info.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  info.textContent = "Your turn (X)";
}

// Minimax Algorithm to make AI smart (Hard level)
function minimax(board, depth, isMaximizingPlayer) {
  const winner = checkWinner("O") ? "O" : (checkWinner("X") ? "X" : null);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizingPlayer) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (cells[i].textContent === "") {
        cells[i].textContent = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        cells[i].textContent = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (cells[i].textContent === "") {
        cells[i].textContent = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        cells[i].textContent = "";
      }
    }
    return best;
  }
}

function getBestMove() {
  let bestVal = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (cells[i].textContent === "") {
      cells[i].textContent = "O"; // Try this move
      let moveVal = minimax(cells, 0, false);
      cells[i].textContent = ""; // Undo move

      if (moveVal > bestVal) {
        move = i;
        bestVal = moveVal;
      }
    }
  }
  return move;
}

function checkWinner(player) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winCombos.some(combo => 
    combo.every(index => cells[index].textContent === player)
  );
}

function isDraw() {
  return cells.every(cell => cell.textContent !== "");
}

function resetGame() {
  currentPlayer = "X";
  createBoard();
}

createBoard();  
