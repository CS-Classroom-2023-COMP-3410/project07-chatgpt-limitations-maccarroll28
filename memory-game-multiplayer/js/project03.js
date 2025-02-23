// Selecting DOM elements
const gameGrid = document.getElementById("gameGrid");
const moveCounter = document.getElementById("moveCounter");
const timer = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gridRowsInput = document.getElementById("gridRows");
const gridColsInput = document.getElementById("gridCols");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");

// Multiplayer UI setup
const playerTurnDisplay = document.createElement("h2");
const playerScoreDisplay = document.createElement("p");
playerTurnDisplay.id = "playerTurn";
playerScoreDisplay.id = "playerScore";
gameContainer.insertBefore(playerTurnDisplay, gameGrid);
gameContainer.insertBefore(playerScoreDisplay, restartBtn);

// Game state variables
let cards = [];
let flippedCards = [];
let moves = 0;
let timerInterval = null;
let timeElapsed = 0;
let gridRows = 4;
let gridCols = 4;

// Multiplayer state
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };

// Image options
const animalImages = [
  "cat.png", "dog.png", "elephant.png", "fox.png", "lion.png",
  "monkey.png", "panda.png", "rabbit.png", "tiger.png", "zebra.png"
];

// Start game logic
startGameBtn.addEventListener("click", () => {
  gridRows = parseInt(gridRowsInput.value);
  gridCols = parseInt(gridColsInput.value);
  const totalCards = gridRows * gridCols;

  if (totalCards % 2 === 0 && gridRows >= 2 && gridRows <= 10 && gridCols >= 2 && gridCols <= 10) {
    welcomeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    initializeGame();
  } else {
    alert("Invalid grid size! Choose even numbers between 2 and 10.");
  }
});

// Game setup
function initializeGame() {
  const totalCards = gridRows * gridCols;
  const uniquePairs = totalCards / 2;

  const selectedImages = [];
  for (let i = 0; i < uniquePairs; i++) {
    selectedImages.push(animalImages[i % animalImages.length]);
  }

  cards = shuffleArray([...selectedImages, ...selectedImages]);
  createGrid();
  resetGameInfo();
  startTimer();
  updatePlayerTurn();
}

// Fisher-Yates shuffle for randomness
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Grid creation logic
function createGrid() {
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

  cards.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = image;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="images/${image}" alt="Animal"></div>
      </div>
    `;
    card.addEventListener("click", handleCardClick);
    gameGrid.appendChild(card);
  });
}

// Handle card clicks
function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (clickedCard.classList.contains("flipped") || clickedCard.classList.contains("matched") || flippedCards.length === 2) {
    return;
  }

  flippedCards.push(clickedCard);
  clickedCard.classList.add("flipped");

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = moves;
    checkForMatch();
  }
}

// Match checking
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    playerScores[currentPlayer]++;
    flippedCards = [];

    if (document.querySelectorAll(".card.matched").length === cards.length) {
      clearInterval(timerInterval);
      announceWinner();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      switchPlayer();
      updatePlayerTurn();
    }, 1000);
  }

  updatePlayerTurn();
}

// Player turn switching
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Update player UI
function updatePlayerTurn() {
  playerTurnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  playerScoreDisplay.textContent = `Scores: Player 1 - ${playerScores[1]} | Player 2 - ${playerScores[2]}`;
}

// Declare winner
function announceWinner() {
  let winnerMessage = playerScores[1] > playerScores[2] 
    ? "🎉 Player 1 Wins!" 
    : playerScores[2] > playerScores[1] 
    ? "🎉 Player 2 Wins!" 
    : "It's a tie! 🤝";

  setTimeout(() => {
    alert(`${winnerMessage}\nFinal Score:\nPlayer 1 - ${playerScores[1]}\nPlayer 2 - ${playerScores[2]}`);
  }, 500);
}

// Timer functionality
function startTimer() {
  timeElapsed = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeElapsed++;
    timer.textContent = formatTime(timeElapsed);
  }, 1000);
}

// Time formatting helper
function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

// Reset game state
function resetGameInfo() {
  moves = 0;
  playerScores = { 1: 0, 2: 0 };
  currentPlayer = 1;
  moveCounter.textContent = moves;
  clearInterval(timerInterval);
  timer.textContent = "00:00";
  updatePlayerTurn();
}

// Restart game
restartBtn.addEventListener("click", () => {
  gameContainer.classList.add("hidden");
  welcomeContainer.classList.remove("hidden");
  clearInterval(timerInterval);
  resetGameInfo();
});
