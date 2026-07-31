# Snake Game Pseudocode

## table of content:

| parts  | topic      |
| :----- | :--------- |
| part 1 | Game logic |
| Part 2 | UI/UX      |
| Part 3 | Html       |
| Part 4 | Javascript |

## 1. Game logic:

- the initial _grid_ is `5 * 5` boxes.
- the snake can move up or down, right or left in the grid as long as it's not the opposite direction of the current one.
- the snake _grows_ by 1 box if he eats an apple.
- there will be controls for:
  - _speed_: `slow` `med` `fast`.
  - _difficulty_:
    - easy: `5 * 5`.
    - medium: `10 * 10`.
    - hard: `15 * 15`.
  - _mute_ button.
  - _restart_ button.
  - _pause_ button.
- the _win/lose_ condition:
  - WIN: when there are no space left on the grid for the snake to move.
  - lose: when the snake hits any edge of the grid or hits itself.

## 2. UI/UX:

- The game will fill 100% of height and width of the view port screen.
- The grid will take 2 thirds of the screen ftom the right, and the remaining third will be the controls for:
  - _speed_: `slow` `med` `fast`.
  - _difficulty_:
    - easy: `5 * 5`.
    - medium: `10 * 10`.
    - hard: `15 * 15`.
  - _mute_ sound effects button.
  - _mute_ background music.
  - _restart_ button.
  - _pause_ button.
- there is a background music, start game sound, winning sound, game over sound, eating sound
- Up on winning: an overlaying object will show infront of the grid saying you win, and a button of play again.
- Up on losing: an overlaying object will show infront of the grid saying you lose, and a button of play again.

## 3. Html:

- **body**: .game-interface `vh: 100%` / `vw: 100%`
  - **_header_**: .banner
  - **_section_**: .controls
    - **h2**: .speed
      - input radio: .slow
      - input radio: .med
      - input radio: .fast
    - **h2**: .difficulty
      - input radio: .easy
      - input radio: .medium
      - input radio: .hard
    - **input** _checkbox_: .mute-sfx
    - **input** _checkbox_: .mute-music
    - **button**: .restart
    - **button**: .pause
  - **_section_**: .grid
    - **div**: .easy-grid
    - **div**: .medium-grid
    - **div**: .hard-grid
    - **div**: .win-block
      - h2: .win-msg
      - button: .restart
    - **div**: .lose-block
      - h2: .lose-msg
      - button: .restart

## 4. Javascript:

> ### Constants:

- gameOverState: `false`
- movementControls: w a s d ArrowUp ArrowLeft ArrowRight ArrowDown
- speed: slow med fast
- difficulty: easy medium hard

> ### Audio:

- win
- lose
- startGame
- eating
- crashing
- moving
- bgMusic

> ### Variables(State):

- leaderBoard
- timeInterval

> ### Cached Element References:

> query selector for:

- grids
- winBlock
- loseBlock
- buttons
- inputs

> ### Functions:

- init
- reset
- pause
- render
- gameStatus:
  - selfHit
  - edgeHit
- checkDirection
- directionMovement:
  - upMove
  - rightMove
  - downMove
  - leftMove
- speed:
  - setinterval for directionMovement
- difficulty:
  - reset
  - toggle grids

> ### Event Listeners:

- keyboardStrokes
- control elements:
  - buttons
  - inputs

> ### Initialization:

- init():
  - reset

#
