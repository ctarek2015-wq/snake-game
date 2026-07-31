console.log("hi");
////////////////////////////////_____Constants_____////////////////////////

const gameOverState = false;
const movementCtrls = ["w", "a", "s", "d"];
const timeIntervalSpeed = { slow: 2000, med: 1000, fast: 500 };

////////////////////////////////_____Audio_______////////////////////////

////////////////////////////////_____Variables(State)_________////////////////////////

////////////////////////////////_____Cached_Element_References___////////////////////////

const keyStroke = document.querySelector("body");
const inputs = document.querySelectorAll("input");
const btns = document.querySelectorAll("button");
const grids = document.querySelector(".grids");

////////////////////////////////_____Functions____////////////////////////

const chosen = (event) => console.log("chosen");
const typed = (event) => console.log(event.key);
const clicked = (event) => console.log("clicked");
const render = (event) => console.log("clicked");
const init = () => {};
////////////////////////////////_____Event_Listeners_____////////////////////////

for (input of inputs) input.addEventListener("click", chosen);
keyStroke.addEventListener("keydown", typed);
for (btn of btns) btn.addEventListener("click", clicked);

////////////////////////////////_____Initialization_________////////////////////////
init();
