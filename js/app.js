/* =========================================
         === CONFIGURATION & CONSTANTS ===
         ========================================= */
const gridSize = 20;
const canvaSize = 400;

const up = ["w", "ArrowUp", "W"];
const down = ["s", "ArrowDown", "S"];
const left = ["a", "ArrowLeft", "A"];
const right = ["d", "ArrowRight", "D"];

/* =========================================
         === ASSETS & THEMES ===
         ========================================= */
const bodyColor = {
  basic: { snakeColorOne: "rgb(0, 121, 0)", snakeColorTwo: "rgb(50, 158, 50)" },
  gold: {
    snakeColorOne: "rgba(253, 209, 10, 0.89)",
    snakeColorTwo: "rgba(211, 138, 4, 0.88)",
  },
  xmas: {
    snakeColorOne: "rgb(240, 8, 8)",
    snakeColorTwo: "rgba(240, 8, 8, 0.72)",
  },
  carnival: [
    "rgb(250, 2, 2)",
    "rgb(250, 114, 2)",
    "rgb(250, 225, 2)",
    "rgb(43, 250, 2)",
    "rgb(2, 250, 238)",
    "rgb(27, 2, 250)",
    "rgb(250, 2, 250)",
  ],
};

const headColor = {
  basic: "rgb(8, 51, 8)",
  gold: new Image(),
  xmas: new Image(),
  carnival: new Image(),
};

const foodColor = {
  basic: new Image(),
  gold: new Image(),
  xmas: new Image(),
  carnival: new Image(),
};

headColor.gold.src = "./assets/pic/snake-pics/gold-head.png";
headColor.xmas.src = "./assets/pic/snake-pics/xmas-head.png";
headColor.carnival.src = "./assets/pic/snake-pics/carnival-head.png";
foodColor.basic.src = "./assets/pic/snake-pics/basic-food.png";
foodColor.gold.src = "./assets/pic/snake-pics/gold-food.png";
foodColor.xmas.src = "./assets/pic/snake-pics/xmas-food.png";
foodColor.carnival.src = "./assets/pic/snake-pics/carnival-food.png";

let activeThemes = {
  head: "basic",
  body: "basic",
  food: "basic",
};

/* =========================================
         === GAME STATE VARIABLES ===
         ========================================= */
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

/* =========================================
         === DOM ELEMENTS ===
         ========================================= */
const canvas = document.getElementById("easy-grid-canvas");
const ctx = canvas.getContext("2d");

const inputs = document.querySelectorAll("input[type='radio']");
const addNewPlayer = document.querySelector(".add-new-player");
const themeBtn = document.querySelector(".themes-btn");
const backBtn = document.getElementById("back");
const restartBtns = document.querySelectorAll(".restart");
const resumeBtn = document.querySelector(".resume");

const pauseBlock = document.querySelector(".pause-block");
const loseBlock = document.querySelector(".lose-block");
const newPlayerBlock = document.getElementById("new-player");
const themeWindowBlock = document.querySelector(".theme-window");

const submitBtn = document.getElementById("submit");
const playerNameInput = document.getElementById("player-name");
const playerNameLabel = document.querySelector(".player-name");
const scoreLabel = document.querySelector(".score");

const playerNamesContainer = document.querySelector(".player-names");
const highScoresContainer = document.querySelector(".high-scores");
const leaderboardSpeedsContainer = document.querySelector(
  ".leaderboard-speeds",
);

const burgerMenuBtn = document.getElementById("burger-menu");
const controlsPanel = document.getElementById("controls-panel");

/* =========================================
         === EVENT LISTENERS ===
         ========================================= */

// Burger menu acts as a toggle for the side panel AND the pause state
burgerMenuBtn.addEventListener("click", () => {
  if (isGameOver) {
    // If game is over, just toggle the menu panel (skip pause logic)
    controlsPanel.classList.toggle("active");
  } else {
    // Mid-game, trigger pause which also opens the menu
    pauseResume();
  }
});

// Handle pointer events for instantaneous touch interactions on mobile
document.getElementById("btn-up").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  handleDpadInput("up");
});
document.getElementById("btn-down").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  handleDpadInput("down");
});
document.getElementById("btn-left").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  handleDpadInput("left");
});
document.getElementById("btn-right").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  handleDpadInput("right");
});

// Handle physical keyboard strokes
const setNextDirection = (direction) => {
  if (direction === "up" && dy !== 1) {
    nextDx = 0;
    nextDy = -1;
  } else if (direction === "down" && dy !== -1) {
    nextDx = 0;
    nextDy = 1;
  } else if (direction === "left" && dx !== 1) {
    nextDx = -1;
    nextDy = 0;
  } else if (direction === "right" && dx !== -1) {
    nextDx = 1;
    nextDy = 0;
  }
};

const handleKeyPress = (event) => {
  const key = event.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
    event.preventDefault();
  }

  if (key === "Escape") {
    if (isGameOver) {
      // If game is over, just toggle the menu panel
      controlsPanel.classList.toggle("active");
    } else {
      pauseResume();
    }
    return;
  }

  const isUp = up.includes(key);
  const isDown = down.includes(key);
  const isLeft = left.includes(key);
  const isRight = right.includes(key);

  if ((!isUp && !isDown && !isLeft && !isRight) || isPaused) return;

  if (!gameLoop) {
    gameLoop = setInterval(updateGame, speed);
  }

  const direction = isUp
    ? "up"
    : isDown
      ? "down"
      : isLeft
        ? "left"
        : isRight
          ? "right"
          : null;
  if (direction) {
    setNextDirection(direction);
  }
};

// Handle on-screen D-Pad mapping
const handleDpadInput = (direction) => {
  if (isPaused || isGameOver) return;

  if (!gameLoop) {
    gameLoop = setInterval(updateGame, speed);
  }

  setNextDirection(direction);
};

// Handle UI configurations (Speed)
const handleInputs = (event) => {
  const id = event.target.id;
  if (id === "slow") speed = 450;
  else if (id === "med") speed = 300;
  else if (id === "fast") speed = 150;

  if (gameLoop && !isPaused && !isGameOver) {
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);
  }
};

const handleRestartClick = () => {
  newGame();
  loseBlock.style.display = "none";
  pauseBlock.style.display = "none";
  controlsPanel.classList.remove("active");
};

const handleResumeClick = () => {
  pauseResume();
};

const handleSubmitClick = () => {
  const isSaved = savePlayerName();
  if (isSaved) {
    newPlayerBlock.style.display = "none";
    newGame();
    loseBlock.style.display = "none";
    pauseBlock.style.display = "none";
    controlsPanel.classList.remove("active");
  }
};

const handleNewPlayerClick = () => {
  newPlayerBlock.style.display = "flex";
};

const handleBackClick = () => {
  themeWindowBlock.style.display = "none";
};

const handleThemePickerClick = () => {
  themeWindowBlock.style.display = "flex";
};

const handleThemeSelection = (event) => {
  let targetImg = null;
  if (event.target.tagName === "IMG") {
    targetImg = event.target;
  } else if (
    event.target.tagName === "BUTTON" &&
    event.target.querySelector("img")
  ) {
    targetImg = event.target.querySelector("img");
  }

  if (targetImg && targetImg.alt) {
    const altText = targetImg.alt;
    const [themeName, bodyPart] = altText.split("-");

    if (themeName && bodyPart) {
      activeThemes[bodyPart] = themeName;
      const buttonContainer = document.getElementById(
        `theme-${bodyPart}-group`,
      );
      if (buttonContainer) {
        buttonContainer
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("theme-selected"));
        const clickedBtn = targetImg.parentElement;
        clickedBtn.classList.add("theme-selected");
      }
      if (!isGameOver) {
        ctx.clearRect(0, 0, canvaSize, canvaSize);
        drawSnake();
        drawFood();
      }
    }
  }
};

/* =========================================
         === CORE GAME LOGIC ===
         ========================================= */

const pauseResume = () => {
  if (isGameOver) return; // Block toggling if game is over

  if (!isPaused) {
    isPaused = true;
    clearInterval(gameLoop);
    pauseBlock.style.display = "flex";
    controlsPanel.classList.add("active"); // Sync panel opening
  } else {
    isPaused = false;
    pauseBlock.style.display = "none";
    controlsPanel.classList.remove("active"); // Sync panel closing
    if (dx !== 0 || dy !== 0) {
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

  // Collision logic (Body)
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  // Collision logic (Walls)
  if (
    head.x < 0 ||
    head.x >= canvaSize / gridSize ||
    head.y < 0 ||
    head.y >= canvaSize / gridSize
  ) {
    gameOver();
    return;
  }

  // Move execution
  snake.unshift(head);

  // Feed execution
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScoreDisplay();
    generateFood();
  } else {
    snake.pop();
  }

  // Re-render
  ctx.clearRect(0, 0, canvaSize, canvaSize);
  drawSnake();
  drawFood();
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

/* =========================================
         === RENDERING (CANVAS) ===
         ========================================= */
const drawSnake = () => {
  snake.forEach((part, idx) => {
    if (idx === 0) {
      // Render Head
      const currentHeadTheme = headColor[activeThemes.head];
      if (
        currentHeadTheme instanceof Image &&
        currentHeadTheme.complete &&
        currentHeadTheme.naturalHeight !== 0
      ) {
        ctx.drawImage(
          currentHeadTheme,
          part.x * gridSize,
          part.y * gridSize,
          gridSize,
          gridSize,
        );
      } else {
        ctx.fillStyle =
          typeof currentHeadTheme === "string" ? currentHeadTheme : "#083308";
        ctx.beginPath();
        ctx.roundRect(
          part.x * gridSize + 1,
          part.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2,
          4,
        );
        ctx.fill();
      }
    } else {
      // Render Body
      const currentBodyTheme = bodyColor[activeThemes.body];
      if (Array.isArray(currentBodyTheme)) {
        ctx.fillStyle = currentBodyTheme[idx % currentBodyTheme.length];
      } else {
        ctx.fillStyle =
          idx % 2
            ? currentBodyTheme.snakeColorOne
            : currentBodyTheme.snakeColorTwo;
      }
      ctx.beginPath();
      ctx.roundRect(
        part.x * gridSize + 1,
        part.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2,
        4,
      );
      ctx.fill();
    }
  });
};

const drawFood = () => {
  const currentFoodTheme = foodColor[activeThemes.food];
  if (
    currentFoodTheme instanceof Image &&
    currentFoodTheme.complete &&
    currentFoodTheme.naturalHeight !== 0
  ) {
    ctx.drawImage(
      currentFoodTheme,
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize,
    );
  } else {
    const fallbackColors = {
      basic: "rgb(240, 8, 8)",
      gold: "rgb(255, 215, 0)",
      xmas: "rgb(0, 128, 0)",
      carnival: "rgb(255, 0, 255)",
    };
    ctx.fillStyle = fallbackColors[activeThemes.food] || "red";
    ctx.beginPath();
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
};

/* =========================================
         === PLAYER & LEADERBOARD DATA ===
         ========================================= */
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
    newPlayerBlock.style.display = "none";
  }
}

const updateLeaderboardUI = () => {
  const scores = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [];
  playerNamesContainer.innerHTML = "";
  highScoresContainer.innerHTML = "";
  if (leaderboardSpeedsContainer) leaderboardSpeedsContainer.innerHTML = "";

  scores.forEach((entry) => {
    const nameDiv = document.createElement("div");
    nameDiv.innerText = entry.name;
    playerNamesContainer.appendChild(nameDiv);

    const scoreDiv = document.createElement("div");
    scoreDiv.innerText = entry.score;
    highScoresContainer.appendChild(scoreDiv);

    const speedDiv = document.createElement("div");
    speedDiv.innerText = entry.speed || "Med";
    if (leaderboardSpeedsContainer)
      leaderboardSpeedsContainer.appendChild(speedDiv);
  });
};

const saveToLeaderboard = () => {
  const currentName = localStorage.getItem("cachedPlayerName") || "Anonymous";
  let scores = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [];

  let currentSpeedStr = "Med";
  if (speed === 150) currentSpeedStr = "Fast";
  else if (speed === 450) currentSpeedStr = "Slow";

  scores.push({ name: currentName, score: score, speed: currentSpeedStr });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5); // Keep top 5

  localStorage.setItem("snakeLeaderboard", JSON.stringify(scores));
  updateLeaderboardUI();
};

/* =========================================
         === INITIALIZATION ===
         ========================================= */
inputs.forEach((input) => {
  input.addEventListener("change", handleInputs);
});
document.addEventListener("keydown", handleKeyPress);
restartBtns.forEach((btn) => btn.addEventListener("click", handleRestartClick));
resumeBtn.addEventListener("click", handleResumeClick);
submitBtn.addEventListener("click", handleSubmitClick);
addNewPlayer.addEventListener("click", handleNewPlayerClick);
themeBtn.addEventListener("click", handleThemePickerClick);
backBtn.addEventListener("click", handleBackClick);
themeWindowBlock.addEventListener("click", handleThemeSelection);

window.onload = () => {
  loadPlayerName();
  updateLeaderboardUI();
  newGame();
};
