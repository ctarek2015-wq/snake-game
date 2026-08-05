# Snake Game - Pseudocode

### 1. Initialization

- **Define Constants**: Grid size, Canvas size, Movement keys (W,A,S,D, Arrows).

- **Define Assets**: Dictionaries/Objects for Snake Head, Body, and Food themes (colors and images).

- **Define Variables**:
  - `snake` (Array of coordinates)

  - `food` (Coordinate object)

  - `dx`, `dy` (Current direction)

  - `nextDx`, `nextDy` (Queued direction to prevent reversing into self)

  - `score`, `speed`

  - State flags: `isPaused`, `isGameOver`

  - `activeThemes` (Object storing currently selected themes)

- **Get DOM Elements**: Canvas context, buttons, modals (new player, game over, theme picker), input fields, audio elements.

#

### 2. Event Listeners

- **Keyboard Listener**:
  - Prevent default scrolling for arrow keys.

  - If `Escape` pressed -> Toggle Pause.

  - **If valid movement key pressed**:
    - If `gameLoop` is inactive and not paused -> Start `gameLoop` interval.

    - Start background music if not muted.

    - Set `nextDx` and `nextDy` based on key pressed (ensuring it's not directly opposite to current direction).

- **Click Listener (Global)**:
  - **Route action based on button text/ID**:
    - "**Restart/Play Again**": Reset game variables, close modals.

    - "**Pause/Resume**": Toggle `isPaused` and `gameLoop` interval.

    - "**Submit**": Validate name, close login modal, start game.

    - "**New Player**": Open login modal.

    - "**Theme Picker**": Open theme modal.

    - "**Back**": Close theme modal.

  - **If target is a theme image/button**:
    - Extract theme name and body part from `alt` tag.

    - Update `activeThemes`.

    - Update UI highlights.

    - Redraw canvas if game is not over.

  - **Input Listeners (Radio/Checkboxes)**:
    - Speed Radios: Update `speed` variable. Restart `gameLoop` with new interval if currently playing.

    - Mute Music Checkbox: Pause or Play `bgMusic` based on checked state.

#

### 3. Core Game Logic (`updateGame`)

Update `dx` and `dy` with `nextDx` and `nextDy`.

Calculate new `head` position (`snake[0].x + dx`, `snake[0].y + dy`).

**Collision Detection**:

Loop through `snake` array. If `head` matches any body part -> `gameOver()`.

If `head` is out of canvas bounds (< 0 or > max grid) -> `gameOver()`.

**Movement & Eating**:

Add new `head` to start of `snake` array (`unshift`).

If head matches `food` coordinates:

Increase `score`.

Update Score UI.

Play `eatSfx` (if not muted).

`generateFood()`.

**Else**:

Remove last element of `snake` array (`pop`) - creates movement effect.

**Rendering**:

Clear canvas.

`drawSnake()`.

`drawFood()`.

#

### 4. Helper Functions

`generateFood()`:

Generate random X, Y within grid bounds.

Check if X, Y overlap with any `snake` segment.

If overlapping, repeat generation until safe spot found.

`drawSnake()`:

Loop through `snake` array.

If index 0 (Head): Draw using selected Head theme (image or fallback color).

Else (Body): Draw using selected Body theme (alternating colors or array of colors).

`drawFood()`:

Draw food using selected Food theme (image or fallback color).

`newGame()`:

Reset `snake` to random starting position.

Reset scores, directions, flags.

Stop existing intervals.

Clear canvas, generate new food, draw initial state.

`gameOver()`:

Set `isGameOver` to true.

Clear interval.

Play `loseSfx`. Pause music.

Save score to leaderboard.

Show Game Over modal.

`pauseResume()`:

Toggle state.

Stop/Start interval.

Show/Hide Pause modal.

Pause/Play music.

**Leaderboard Functions**:

Load/Save `cachedPlayerName` from `localStorage`.

Retrieve `snakeLeaderboard` array from `localStorage`.

Add new score object (name, score, speed).

Sort array descending by score.

Keep top 5 (`slice(0, 5)`).

Save back to `localStorage`.

Update DOM elements to display top scores.

#

### 5. Startup (`window.onload`)

Check for existing player name in storage; if found, hide login modal.

Populate leaderboard UI.

Call `newGame()` to set up initial canvas state.
