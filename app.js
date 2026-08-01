////////////////////////////////_____Constants_____////////////////////////

const gameOverState = false;
const movementCtrls = ["w", "a", "s", "d"];
const timeIntervalSpeed = { slow: 2000, med: 1000, fast: 500 };
const easyBoxes = {
  letters: ["a", "b", "c", "d", "e"],
  numbers: [1, 2, 3, 4, 5],
};
// const mediumBoxes;
// const hardBoxes;

////////////////////////////////_____Audio_______////////////////////////

////////////////////////////////_____Variables(State)_________////////////////////////

let snakeBox = { letter: [], number: [] };
let appleBox = { letter: [], number: [] };
let lastKeyStroke = "";
let lastSnakeBox = { letter: [], number: [] };

////////////////////////////////_____Cached_Element_References___////////////////////////

const keyStroke = document.querySelector("body");
const inputs = document.querySelectorAll("input");
const btns = document.querySelectorAll("button");
const easyGrid = document.querySelectorAll(".box");

////////////////////////////////_____Functions____////////////////////////

const snakePlace = () => {
  snakeBox.letter = easyBoxes.letters.at(Math.floor(Math.random() * 5));
  snakeBox.number = easyBoxes.numbers.at(Math.floor(Math.random() * 5));
  easyGrid.forEach((box) => {
    if (
      box.classList.contains(snakeBox.letter) &&
      box.classList.contains(snakeBox.number)
    ) {
      box.style.backgroundColor = "green";
      box.style.borderRadius = "15%";
    }
  });
};
const applePlace = () => {
  appleBox.letter = easyBoxes.letters.at(Math.floor(Math.random() * 5));
  appleBox.number = easyBoxes.numbers.at(Math.floor(Math.random() * 5));
  if (
    snakeBox.letter === appleBox.letter &&
    snakeBox.number === appleBox.number
  ) {
    appleBox.letter = easyBoxes.letters.at(Math.floor(Math.random() * 5));
    appleBox.number = easyBoxes.numbers.at(Math.floor(Math.random() * 5));
  }
  easyGrid.forEach((box) => {
    if (
      box.classList.contains(appleBox.letter) &&
      box.classList.contains(appleBox.number)
    ) {
      box.style.backgroundColor = "red";
      box.style.borderRadius = "50%";
    }
  });
};
const snakeMove = (event) => {
  lastKeyStroke = event.key;
  console.log(lastKeyStroke);
  if (lastKeyStroke === "s" || lastKeyStroke === "ArrowDown") {
    const downBoxes = easyBoxes.letters;
    console.log(downBoxes);
    const snakeMove = setInterval(() => {
      easyGrid.forEach((box) => {
        if (
          box.classList.contains(snakeBox.letter) &&
          box.classList.contains(snakeBox.number)
        ) {
          box.style.backgroundColor = "rgb(144, 250, 130)";
          box.style.borderRadius = "0%";
        }
      });
      let idx = {
        letterValue: snakeBox.letter,
        letterIdx: downBoxes.findIndex((el) => el === snakeBox.letter),
        number: snakeBox.number,
      };
      snakeBox = {
        letter: downBoxes.at(idx.letterIdx + 1),
        number: idx.number,
      };
      easyGrid.forEach((box) => {
        if (
          box.classList.contains(snakeBox.letter) &&
          box.classList.contains(snakeBox.number)
        ) {
          box.style.backgroundColor = "green";
          box.style.borderRadius = "15%";
        }
      });
    }, 1000);
    console.log("hi");

    console.log(snakeBox);
    console.log(easyBoxes.letters.reverse());
  }
};
const runGame = () => {
  snakePlace();
  applePlace();
};
const chosen = (event) => console.log("chosen");
const typed = (event) => console.log(event.key);
const clicked = (event) => console.log("clicked");
const render = (event) => {};
const init = () => {
  runGame();
  //   snakeMove();
};
////////////////////////////////_____Event_Listeners_____////////////////////////

for (input of inputs) input.addEventListener("click", chosen);
keyStroke.addEventListener("keydown", snakeMove);
for (btn of btns) btn.addEventListener("click", clicked);

////////////////////////////////_____Initialization_________////////////////////////
init();
