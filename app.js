////////////////////////////////_____Constants_____////////////////////////

const easyGridSize = 5;
const canvaSize = 400;
const snakeColor = "green";
const appleColor = "red";
const up = ["ArrowUp", "w"];
const right = ["ArrowRight", "d"];
const down = ["ArrowDown", "s"];
const left = ["ArrowLeft", "a"];

////////////////////////////////_____Audio_______////////////////////////

////////////////////////////////_____Variables(State)_________////////////////////////

let snake = [{ x: 0, y: 0 }];
let food = [{ x: 0, y: 0 }];
let dx = 0;
let dy = 0;
let gameLoop;
////////////////////////////////_____Cached_Element_References___////////////////////////

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

////////////////////////////////_____Functions____////////////////////////

const handleKeyPress = (event) => {
  if (!gameLoop) {
    gameLoop = setInterval(updateGame, 500);
    const key = event.key;
    if (up.includes(key) && dy !== -1) {
      dx = 0;
      dy = 1;
    } else if (down.includes(key) && dy !== 1) {
      dx = 0;
      dy = -1;
    } else if (right.includes(key) && dx !== -1) {
      dx = 1;
      dy = 0;
    } else if (left.includes(key) && dx !== 1) {
      dx = -1;
      dy = 0;
    }
  }
};

const updateGame = () => {};

////////////////////////////////_____Event_Listeners_____////////////////////////

document.addEventListener("keydown", handleKeyPress);

////////////////////////////////_____Initialization_________////////////////////////
// init();
