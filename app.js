////////////////////////////////_____Constants_____////////////////////////

const gridSize = 20;
const canvaSize = 400;
const snakeColor = "white";
const foodColor = "orange";

////////////////////////////////_____Audio_______////////////////////////

////////////////////////////////_____Variables(State)_________////////////////////////

let snake = [
  { x: 14, y: 10 },
  { x: 13, y: 10 },
  { x: 12, y: 10 },
];
let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;

////////////////////////////////_____Cached_Element_References___////////////////////////

const canvas = document.getElementById("easy-grid");
const ctx = canvas.getContext("2d");

////////////////////////////////_____Functions____////////////////////////

const handleKeyPress = (event) => {
  if (gameLoop === undefined) {
    gameLoop = setInterval(updateGame, 100);
  }
  const key = event.key;
  if (key === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (key === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (key === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (key === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  }
};
const gameOver = () => {
  clearInterval(gameLoop);
  ctx.clearRect(0, 0, canvaSize, canvaSize);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 120, 130);
  ctx.fillText(`Score: ${score}`, 135, 170);
};
const updateGame = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x < 0) {
    head.x = canvaSize / gridSize - 1;
  } else if (head.x >= canvaSize / gridSize) {
    head.x = 0;
  } else if (head.y < 0) {
    head.y = canvaSize / gridSize - 1;
  } else if (head.y >= canvaSize / gridSize) {
    head.y = 0;
  }

  for (i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }
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
      ctx.fillStyle = "darkgreen";
    } else {
      ctx.fillStyle = snakeColor;
    }
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });
};
const generateFood = () => {
  food = {
    x: Math.floor(Math.random() * (canvaSize / gridSize)),
    y: Math.floor(Math.random() * (canvaSize / gridSize)),
  };
};
const drawFood = () => {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
};
generateFood();
////////////////////////////////_____Event_Listeners_____////////////////////////

document.addEventListener("keydown", handleKeyPress);

////////////////////////////////_____Initialization_________////////////////////////
