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

////////////////////////////////_____Cached_Element_References___////////////////////////

const keyStroke = document.querySelector("body");
const inputs = document.querySelectorAll("input");
const btns = document.querySelectorAll("button");
const easyGrid = document.querySelectorAll(".box");

////////////////////////////////_____Functions____////////////////////////

// const randomizer = () => {
//   randomBox.letter = easyBoxes.letters.at(randomNum);
//   randomBox.number = easyBoxes.numbers.at(randomNum);
// };
// randomizer();
const snakePlace = () => {
  snakeBox.letter = easyBoxes.letters.at(Math.floor(Math.random() * 5));
  snakeBox.number = easyBoxes.numbers.at(Math.floor(Math.random() * 5));
  console.log(snakeBox);

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
  console.log(appleBox);
  if (
    snakeBox.letter === appleBox.letter &&
    snakeBox.number === appleBox.number
  ) {
    appleBox.letter = easyBoxes.letters.at(Math.floor(Math.random() * 5));
    appleBox.number = easyBoxes.numbers.at(Math.floor(Math.random() * 5));
  }
  console.log(appleBox);

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

const runGame = () => {
  snakePlace();
  applePlace();
};
runGame();
const chosen = (event) => console.log("chosen");
const typed = (event) => console.log(event.key);
const clicked = (event) => console.log("clicked");
const render = (event) => {};
const init = () => {};
////////////////////////////////_____Event_Listeners_____////////////////////////

for (input of inputs) input.addEventListener("click", chosen);
keyStroke.addEventListener("keydown", typed);
for (btn of btns) btn.addEventListener("click", clicked);

////////////////////////////////_____Initialization_________////////////////////////
init();
