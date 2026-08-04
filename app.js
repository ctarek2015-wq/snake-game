////////////////////////////////_____Constants_____////////////////////////

const gridSize = 20;
const canvaSize = 400;
const snakeColorOne = "rgb(0, 121, 0)";
const snakeColorTwo = "rgb(50, 158, 50)";
const headColor = "rgb(8, 51, 8)";
const foodColor = "red";
const up = ["w", "ArrowUp"];
const down = ["s", "ArrowDown"];
const left = ["a", "ArrowLeft"];
const right = ["d", "ArrowRight"];

////////////////////////////////_____Audio_______////////////////////////

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

const canvas = document.getElementById("easy-grid");
const ctx = canvas.getContext("2d");

const inputs = document.querySelectorAll("input");
const btns = document.querySelectorAll("button");

const pauseBlock = document.querySelector(".pause-block");
const loseBlock = document.querySelector(".lose-block");
const newPlayerBlock = document.querySelector(".new-player");

const submit = document.getElementById("submit");
const playerNameInput = document.getElementById("player-name");

const playerNameLabel = document.querySelector(".player-name");
const scoreLabel = document.querySelector(".score");

const playerNames = document.querySelector(".player-names");
const highScores = document.querySelector(".high-scores");

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
    newPlayerBlock.style.display = "none";
    console.log("hi");
  }
  console.log(event.target.id);
};

const handleKeyPress = (event) => {
  const key = event.key;
  // Prevent scrolling for arrow keys
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

  // Doesn't process gameloop unless it's a movement key
  // Doesn't change directions while the game is paused
  // Added nextdx & nextdy to ensure the game renders
  // only one key at a time to prevent self collision
  if ((!isUp && !isDown && !isLeft && !isRight) || isPaused) return;
  if (!gameLoop) {
    gameLoop = setInterval(updateGame, speed);
  }
  if (up.includes(key) && dy !== 1) {
    nextDx = 0;
    nextDy = -1;
  } else if (down.includes(key) && dy !== -1) {
    nextDx = 0;
    nextDy = 1;
  } else if (left.includes(key) && dx !== 1) {
    nextDx = -1;
    nextDy = 0;
  } else if (right.includes(key) && dx !== -1) {
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
};

////////////////////////////////_____Functions____////////////////////////

const updateScoreDisplay = () => {
  scoreLabel.innerText = "Score: " + score;
};

const savePlayerName = () => {
  const name = playerNameInput.value;
  if (name.trim() === "") {
    // playerNameInput.value = "";
    playerNameInput.placeholder = "NAME REQUIRED!";
    return false;
  }
  localStorage.setItem("cachedPlayerName", name);
  playerNameLabel.innerText = "Welcome, " + name + "!";
  playerNameInput.value = "";
};
function loadPlayerName() {
  const storedName = localStorage.getItem("cachedPlayerName");
  if (storedName) {
    playerNameLabel.innerText = "Welcome back, " + storedName + "!";
  }
}

const newPlayer = (event) => {
  //   newPlayerBlock.style.display = "flex";
};

const pauseResume = () => {
  // Can't pause when the game hasn't started
  if (!isGameOver && !gameLoop) {
    return;
  }

  // the pause logic
  // Can't pause when the game is over
  if (!isPaused && !isGameOver) {
    isPaused = true;
    clearInterval(gameLoop);
    pauseBlock.style.display = "flex";
  } else {
    isPaused = false;
    pauseBlock.style.display = "none";
    gameLoop = setInterval(updateGame, speed);
  }
};

const gameOver = () => {
  clearInterval(gameLoop);
  isGameOver = true;
  ctx.clearRect(0, 0, canvaSize, canvaSize);
  //   ctx.fillStyle = "white";
  //   ctx.font = "30px Arial";
  //   ctx.fillText("Game Over", 120, 130);
  //   ctx.fillText(`Score: ${score}`, 135, 170);
  loseBlock.style.display = "flex";
};

const updateGame = () => {
  dx = nextDx;
  dy = nextDy;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  //self collision logic
  for (i = 0; i < snake.length; i++) {
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
  });
};

const generateFood = () => {
  // Ensures the food doesn't get spawned on the snake body
  isFoodOnSnake = true;
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
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
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
  input.addEventListener("click", handleInputs);
});
document.addEventListener("keydown", handleKeyPress);
btns.forEach((btn) => {
  btn.addEventListener("click", handleClicks);
});
submit.addEventListener("click", savePlayerName);
window.onload = loadPlayerName;

////////////////////////////////_____Initialization_________////////////////////////
newGame();
