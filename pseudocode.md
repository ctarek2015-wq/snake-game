Game logic:

- the grid is 10 \* 10 boxes.
- the snake can move up or down, right or left in the grid as long as it's not the opposite direction of the current one.
- the snake grows by 1 box if he eats an apple.
- the win/lose condition:
  - WIN: when there are no space left on the grid for the snake to move.
  - lose: when the snake hits any edge of the grid or hits itself.

UI/UX:

html:

body `vh: 100% , vw: 100%` `
