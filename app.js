////////////////////////////////_____Constants_____////////////////////////

const gridSize = 40;
const canvaSize = 400;
const snakeColor = "white";
const foodColor = "red";
const up = ["w", "ArrowUp"];
const down = ["s", "ArrowDown"];
const left = ["a", "ArrowLeft"];
const right = ["d", "ArrowRight"];

////////////////////////////////_____Audio_______////////////////////////

////////////////////////////////_____Variables(State)_________////////////////////////

let snake = [{ x: 14, y: 10 }];
let food = { x: 15, y: 10 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let score = 0;
let gameLoop;
let speed = 500;
let isPaused = false;
let isGameOver = false;

////////////////////////////////_____Cached_Element_References___////////////////////////

const canvas = document.getElementById("easy-grid");
const ctx = canvas.getContext("2d");
const divs = document.querySelectorAll("div");
const inputs = document.querySelectorAll("input");
const btns = document.querySelectorAll("button");

////////////////////////////////_____Handle_Functions____////////////////////////

const handleClicks = (event) => {
  const btnFinder = event.target.textContent.toLowerCase();
  if (btnFinder.includes("restart") || btnFinder.includes("play again")) {
    newGame();
    divs.forEach((div) => {
      if (div.classList.contains("lose")) {
        div.style.display = "none";
      }
    });
    isPaused = false;
    divs.forEach((div) => {
      if (div.classList.contains("pause-block")) {
        div.style.display = "none";
      }
    });
  }
  if (btnFinder.includes("pause") || btnFinder.includes("resume")) {
    pauseResume();
  }
};

const handleKeyPress = (event) => {
  const key = event.key;
  if (key === "Escape") {
    pauseResume();
    return;
  }
  const isUp = up.includes(key);
  const isDown = down.includes(key);
  const isLeft = left.includes(key);
  const isRight = right.includes(key);

  if (!isUp && !isDown && !isLeft && !isRight) return;

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
    speed = 500;
  } else if (id === "med") {
    speed = 350;
  } else if (id === "fast") {
    speed = 200;
  }
};

////////////////////////////////_____Functions____////////////////////////

const pauseResume = () => {
  if (!isPaused && !isGameOver) {
    isPaused = true;
    clearInterval(gameLoop);
    divs.forEach((div) => {
      if (div.classList.contains("pause-block")) {
        div.style.display = "flex";
      }
    });
  } else {
    isPaused = false;
    divs.forEach((div) => {
      if (div.classList.contains("pause-block")) {
        div.style.display = "none";
      }
    });
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
  divs.forEach((div) => {
    if (div.classList.contains("lose")) {
      div.style.display = "flex";
    }
  });
};

const updateGame = () => {
  dx = nextDx;
  dy = nextDy;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  //self collision:
  for (i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }
  // wall collision:
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
    for (part of snake) {
      do {
        generateFood();
      } while (food.x === part.x && food.y === part.y);
    }
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
  console.log(isGameOver);
};

////////////////////////////////_____Event_Listeners_____////////////////////////
inputs.forEach((input) => {
  input.addEventListener("click", handleInputs);
});
document.addEventListener("keydown", handleKeyPress);
btns.forEach((btn) => {
  btn.addEventListener("click", handleClicks);
});
////////////////////////////////_____Initialization_________////////////////////////
newGame();
