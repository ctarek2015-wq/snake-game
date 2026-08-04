Snake Game Pseudocode

1. Game State and Constants

Define grid size, canvas size, and colors (snake, head, food).

Map movement controls (w, a, s, d, Arrow keys).

Initialize game state variables:

snake: Array of coordinate objects representing the snake's body.

food: Object containing x, y coordinates.

dx, dy: Current movement direction on the x and y axes.

nextDx, nextDy: Queued movement direction to prevent self-collision on rapid input.

score: Current game score.

gameLoop: Reference to the interval running the game.

speed: Current game speed (milliseconds per tick).

isPaused: Boolean tracking pause state.

isGameOver: Boolean tracking game over state.

2. DOM Elements

Cache references to HTML elements:

Canvas context (ctx).

Buttons (restart, pause, submit).

Inputs (speed radio buttons, player name text input).

UI overlays (pause block, lose block, new player block).

Text displays (player name, score).

3. Initialization

window.onload: Call loadPlayerName() to check for a returning player in local storage.

newGame():

Reset game state variables (score, dx, dy, isPaused, isGameOver).

Clear any existing gameLoop.

Set the snake to a single random position on the grid.

Generate initial food location.

Clear the canvas.

Draw the initial snake and food.

4. Input Handling

handleClicks(event):

If "restart" or "play again" is clicked, hide lose block and call newGame().

If "pause" or "resume" is clicked, call pauseResume().

If "submit" is clicked, save the player's name and hide the new player overlay.

handleKeyPress(event):

Prevent default scrolling for arrow keys and spacebar.

If "Escape" is pressed, call pauseResume().

Ignore input if the game is paused.

Check which movement key was pressed.

If a valid movement key is pressed (not opposite to current direction), update nextDx and nextDy.

Start the gameLoop if it hasn't started yet.

handleInputs(event):

Listen for changes on speed radio buttons.

Update the speed variable based on the selected input (slow, med, fast).

5. Core Game Loop (updateGame())

Update dx and dy with the values from nextDx and nextDy.

Calculate the new head position based on the current head position and movement direction.

Collision Detection:

Self-Collision: Check if the new head coordinates match any part of the snake array. If yes, call gameOver().

Wall Collision: Check if the new head coordinates are outside the grid boundaries. If yes, call gameOver().

Movement & Eating:

Add the new head to the front of the snake array (unshift).

Check if the new head coordinates match the food coordinates.

If yes: Increase score, generate new food (generateFood()).

If no: Remove the tail segment of the snake (pop()).

Rendering:

Clear the canvas.

Call drawSnake().

Call drawFood().

6. Helper Functions

savePlayerName(): Save name from input to localStorage, update UI greeting.

loadPlayerName(): Retrieve name from localStorage on page load, update UI greeting if found.

pauseResume():

Toggle isPaused state.

If pausing: Clear gameLoop interval, show pause overlay.

If resuming: Hide pause overlay, set gameLoop interval with current speed.

gameOver():

Clear gameLoop interval.

Set isGameOver to true.

Show the lose block overlay.

drawSnake(): Iterate through the snake array. Draw the head color for index 0, and alternate body colors for the rest.

generateFood(): Generate random x/y coordinates for food until the coordinates do not overlap with any segment of the snake.

drawFood(): Draw a rectangle at the food coordinates.
