const gridSize = 20;
const canvaSize = 400;

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

headColor.gold.src = "/assets/pic/snake-pics/gold-head.png";
headColor.xmas.src = "/assets/pic/snake-pics/xmas-head.png";
headColor.carnival.src = "/assets/pic/snake-pics/carnival-head.png";
foodColor.basic.src = "/assets/pic/snake-pics/basic-food.png";
foodColor.gold.src = "/assets/pic/snake-pics/gold-food.png";
foodColor.xmas.src = "/assets/pic/snake-pics/xmas-food.png";
foodColor.carnival.src = "/assets/pic/snake-pics/carnival-food.png";

const up = ["w", "ArrowUp", "W"];
const down = ["s", "ArrowDown", "S"];
const left = ["a", "ArrowLeft", "A"];
const right = ["d", "ArrowRight", "D"];

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

// Track the selected themes
let activeThemes = {
  head: "basic",
  body: "basic",
  food: "basic",
};

const canvas = document.getElementById("easy-grid-canvas");
const ctx = canvas.getContext("2d");

const inputs = document.querySelectorAll("input[type='radio']");
const btns = document.querySelectorAll("button");
const addNewPlayer = document.querySelector(".add-new-player");
const themeBtn = document.querySelector(".themes-btn");
const backBtn = document.getElementById("back");

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

const handleClicks = (event) => {
  const btnFinder = event.target.textContent.toLowerCase();

  if (btnFinder.includes("restart") || btnFinder.includes("play again")) {
    newGame();
    loseBlock.style.display = "none";
  }
  if (btnFinder.includes("pause") || btnFinder.includes("resume")) {
    pauseResume();
  }
  if (event.target.id === "submit") {
    const isSaved = savePlayerName();
    if (isSaved) {
      newPlayerBlock.style.display = "none";
      newGame();
      loseBlock.style.display = "none";
    }
  }
  if (btnFinder.includes("new player")) {
    newPlayerBlock.style.display = "flex";
  }
  if (btnFinder.includes("back") || event.target.id === "back") {
    themeWindowBlock.style.display = "none";
  }
  if (btnFinder.includes("theme picker")) {
    themeWindowBlock.style.display = "flex";
  }

  // --- THEME PICKER FIX ---
  // Find if an image was clicked, or a button containing the image
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
    const [themeName, bodyPart] = altText.split("-"); // e.g. ["gold", "head"]

    if (themeName && bodyPart) {
      // Update State
      activeThemes[bodyPart] = themeName;

      // Visual Button Update
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

      // Request a re-draw immediately so user sees changes if paused
      if (!isGameOver) {
        ctx.clearRect(0, 0, canvaSize, canvaSize);
        drawSnake();
        drawFood();
      }
    }
  }
};

const handleKeyPress = (event) => {
  const key = event.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
    event.preventDefault();
  }

  if (key === "Escape") {
    pauseResume();
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
  if (id === "slow") speed = 450;
  else if (id === "med") speed = 300;
  else if (id === "fast") speed = 150;

  if (gameLoop && !isPaused && !isGameOver) {
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);
  }
};

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

  for (let i = 0; i < snake.length; i++) {
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
    updateScoreDisplay();
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
      // -- HEAD DRAWING --
      const currentHeadTheme = headColor[activeThemes.head];

      // Check if it's an image and has loaded successfully
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
        // Fallback drawing if image is missing/broken, or if it's a solid color (basic theme)
        ctx.fillStyle =
          typeof currentHeadTheme === "string" ? currentHeadTheme : "#083308"; // Default dark green
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
      // -- BODY DRAWING --
      const currentBodyTheme = bodyColor[activeThemes.body];

      if (Array.isArray(currentBodyTheme)) {
        // Carnival (array of colors)
        ctx.fillStyle = currentBodyTheme[idx % currentBodyTheme.length];
      } else {
        // Alternating two-color themes (basic, gold, xmas)
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
  const currentFoodTheme = foodColor[activeThemes.food];

  // Ensure we properly draw images (ctx.fillStyle doesn't accept image objects)
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
    // Fallback to circles if the image URL is broken/missing
    const fallbackColors = {
      basic: "rgb(240, 8, 8)", // Red apple fallback
      gold: "rgb(255, 215, 0)", // Gold fallback
      xmas: "rgb(0, 128, 0)", // Green fallback
      carnival: "rgb(255, 0, 255)", // Magenta fallback
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

inputs.forEach((input) => {
  input.addEventListener("change", handleInputs);
});
document.addEventListener("keydown", handleKeyPress);
btns.forEach((btn) => {
  btn.addEventListener("click", handleClicks);
});

window.onload = () => {
  loadPlayerName();
  updateLeaderboardUI();
  newGame();
};
