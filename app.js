////////////////////////////////_____Constants_____////////////////////////
const gridSize = 20;
const canvaSize = 400;
const snakeColorOne = "rgb(0, 121, 0)";
const snakeColorTwo = "rgb(50, 158, 50)";
const headColor = "rgb(8, 51, 8)";
const foodColor = "red";
const up = ["w", "ArrowUp", "W"];
const down = ["s", "ArrowDown", "S"];
const left = ["a", "ArrowLeft", "A"];
const right = ["d", "ArrowRight", "D"];

////////////////////////////////_____Variables(State)_________////////////////////////
let snake = [];
let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let score = 0;
let gameLoop;
let speed = 300;
let isPaused = false;
let isGameOver = false;

////////////////////////////////_____Cached_Element_References___////////////////////////
const canvas = document.getElementById("easy-grid-canvas");
const ctx = canvas.getContext("2d");

const inputs = document.querySelectorAll("input[type='radio']");
const btns = document.querySelectorAll("button");
const addNewPlayer = document.querySelector(".add-new-player");

const pauseBlock = document.querySelector(".pause-block");
const loseBlock = document.querySelector(".lose-block");
const newPlayerBlock = document.getElementById("new-player");

const submitBtn = document.getElementById("submit");
const playerNameInput = document.getElementById("player-name");

const playerNameLabel = document.querySelector(".player-name");
const scoreLabel = document.querySelector(".score");

const playerNamesContainer = document.querySelector(".player-names");
const highScoresContainer = document.querySelector(".high-scores");

////////////////////////////////_____Handle_Functions____////////////////////////
const handleClicks = (event) => {
  const btnFinder = event.target.textContent.toLowerCase();

  // Handle restart and playagain buttons
  if (btnFinder.includes("restart") || btnFinder.includes("play again")) {
    newGame();
    loseBlock.style.display = "none";
  }

  // Handle pause/resume buttons
  if (btnFinder.includes("pause") || btnFinder.includes("resume")) {
    pauseResume();
  }

  // Handle submit button
  if (event.target.id === "submit") {
    const isSaved = savePlayerName();
    if (isSaved) {
      newPlayerBlock.style.display = "none"; // Fixed bug: changed "hidden" to "none"
      if (audioCtx.state === "suspended") audioCtx.resume();
    }
  }
};

const handleKeyPress = (event) => {
  const key = event.key;
  // Prevent scrolling for arrow keys and space
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
    event.preventDefault();
  }

  // Handle the pause key
  if (key === "Escape") {
    pauseResume();
    return;
  }

  const isUp = up.includes(key);
  const isDown = down.includes(key);
  const isLeft = left.includes(key);
  const isRight = right.includes(key);

  if ((!isUp && !isDown && !isLeft && !isRight) || isPaused) return;

  // Ensure audio unlocks on first interaction
  if (audioCtx.state === "suspended") audioCtx.resume();

  if (!gameLoop) {
    gameLoop = setInterval(updateGame, speed);
  }

  if (isUp && dy !== 1) {
    nextDx = 0;
    nextDy = -1;
  } else if (isDown && dy !== -1) {
    nextDx = 0;
    nextDy = 1;
  } else if (isLeft && dx !== 1) {
    nextDx = -1;
    nextDy = 0;
  } else if (isRight && dx !== -1) {
    nextDx = 1;
    nextDy = 0;
  }
};

const handleInputs = (event) => {
  const id = event.target.id;
  if (id === "slow") {
    speed = 450;
  } else if (id === "med") {
    speed = 300;
  } else if (id === "fast") {
    speed = 150;
  }

  // If game is active, update interval seamlessly
  if (gameLoop && !isPaused && !isGameOver) {
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);
  }
};

////////////////////////////////_____Functions____////////////////////////
const updateScoreDisplay = () => {
  scoreLabel.innerText = "Score: " + score;
};

const savePlayerName = () => {
  const name = playerNameInput.value;
  if (name.trim() === "") {
    playerNameInput.value = "";
    playerNameInput.placeholder = "NAME REQUIRED!";
    return false;
  }
  localStorage.setItem("cachedPlayerName", name);
  playerNameLabel.innerText = "Welcome, " + name + "!";
  playerNameInput.value = "";
  return true;
};

function loadPlayerName() {
  const storedName = localStorage.getItem("cachedPlayerName");
  if (storedName) {
    playerNameLabel.innerText = "Welcome back, " + storedName + "!";
    newPlayerBlock.style.display = "none"; // Hide intro if returning player
  }
}

const updateLeaderboardUI = () => {
  const scores = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [];
  playerNamesContainer.innerHTML = "";
  highScoresContainer.innerHTML = "";

  scores.forEach((entry) => {
    const nameDiv = document.createElement("div");
    nameDiv.innerText = entry.name;
    playerNamesContainer.appendChild(nameDiv);

    const scoreDiv = document.createElement("div");
    scoreDiv.innerText = entry.score;
    highScoresContainer.appendChild(scoreDiv);
  });
};

const saveToLeaderboard = () => {
  const currentName = localStorage.getItem("cachedPlayerName") || "Anonymous";
  let scores = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [];

  // Add new score
  scores.push({ name: currentName, score: score });

  // Sort descending
  scores.sort((a, b) => b.score - a.score);

  // Keep top 5
  scores = scores.slice(0, 5);

  localStorage.setItem("snakeLeaderboard", JSON.stringify(scores));
  updateLeaderboardUI();
};

const pauseResume = () => {
  if (!isGameOver && !gameLoop && !isPaused) return;

  if (!isPaused && !isGameOver) {
    isPaused = true;
    clearInterval(gameLoop);
    pauseBlock.style.display = "flex";
  } else {
    isPaused = false;
    pauseBlock.style.display = "none";
    if (dx !== 0 || dy !== 0) {
      // Only restart interval if moving
      gameLoop = setInterval(updateGame, speed);
    }
  }
};

const gameOver = () => {
  clearInterval(gameLoop);
  isGameOver = true;
  saveToLeaderboard();
  loseBlock.style.display = "flex";
};

const updateGame = () => {
  dx = nextDx;
  dy = nextDy;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // self collision logic
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  // wall collision logic
  if (
    head.x < 0 ||
    head.x >= canvaSize / gridSize ||
    head.y < 0 ||
    head.y >= canvaSize / gridSize
  ) {
    gameOver();
    return;
  }

  // Snake eating and movement logic
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScoreDisplay(); // Live Score Update
    generateFood();
  } else {
    snake.pop();
  }
  ctx.clearRect(0, 0, canvaSize, canvaSize);
  drawSnake();
  drawFood();
};

const drawSnake = () => {
  snake.forEach((part, idx) => {
    if (idx === 0) {
      ctx.fillStyle = headColor;
    } else {
      if (idx % 2) {
        ctx.fillStyle = snakeColorOne;
      } else {
        ctx.fillStyle = snakeColorTwo;
      }
    }
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    // Optional stroke for clarity
    ctx.strokeStyle = "#f2e8cf";
    ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });
};

const generateFood = () => {
  let isFoodOnSnake = true;
  while (isFoodOnSnake) {
    food = {
      x: Math.floor(Math.random() * (canvaSize / gridSize)),
      y: Math.floor(Math.random() * (canvaSize / gridSize)),
    };
    isFoodOnSnake = snake.some(
      (part) => part.x === food.x && part.y === food.y,
    );
  }
};

const drawFood = () => {
  ctx.fillStyle = foodColor;
  // Drawing food slightly smaller than grid for aesthetic
  ctx.fillRect(
    food.x * gridSize + 2,
    food.y * gridSize + 2,
    gridSize - 4,
    gridSize - 4,
  );
};

const newGame = () => {
  const randomSnakePlace = [
    {
      x: Math.floor(Math.random() * (canvaSize / gridSize)),
      y: Math.floor(Math.random() * (canvaSize / gridSize)),
    },
  ];
  snake = randomSnakePlace;
  clearInterval(gameLoop);
  gameLoop = 0;
  isGameOver = false;
  isPaused = false;
  score = 0;
  updateScoreDisplay();

  nextDx = 0;
  nextDy = 0;
  dx = 0;
  dy = 0;

  ctx.clearRect(0, 0, canvaSize, canvaSize);
  generateFood();
  drawSnake();
  drawFood();
};

////////////////////////////////_____Event_Listeners_____////////////////////////
inputs.forEach((input) => {
  input.addEventListener("change", handleInputs);
});
document.addEventListener("keydown", handleKeyPress);
btns.forEach((btn) => {
  btn.addEventListener("click", handleClicks);
});

////////////////////////////////_____Initialization_________////////////////////////
window.onload = () => {
  loadPlayerName();
  updateLeaderboardUI();
  newGame();
};
