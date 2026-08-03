////////////////////////////////_____Constants_____////////////////////////

const gridSize = 20;
const canvaSize = 400;
const snakeColor = "white";
const foodColor = "red";

////////////////////////////////_____Audio_______////////////////////////

////////////////////////////////_____Variables(State)_________////////////////////////

let snake = [{ x: 14, y: 10 }];
let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let speed;

////////////////////////////////_____Cached_Element_References___////////////////////////

const canvas = document.getElementById("easy-grid");
const ctx = canvas.getContext("2d");
const divs = document.querySelectorAll("div");
const inputs = document.querySelectorAll("input");

////////////////////////////////_____Functions____////////////////////////

const handleKeyPress = (event) => {
  if (gameLoop === undefined) {
    gameLoop = setInterval(updateGame, 200);
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

// console.log(gameOverMsg.classList.remove());
const gameOver = () => {
  clearInterval(gameLoop);
  ctx.clearRect(0, 0, canvaSize, canvaSize);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 120, 130);
  ctx.fillText(`Score: ${score}`, 135, 170);
  divs.forEach((div) => {
    div.classList.remove("lose");
  });
};
const updateGame = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  for (i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }
  if (
    head.x < 0 ||
    head.x >= canvaSize / gridSize ||
    head.y < 0 ||
    head.y >= canvaSize / gridSize
  ) {
    gameOver();
    return;
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
