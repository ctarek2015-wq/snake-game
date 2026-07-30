# Snake Game Pseudocode

## table of content:

| parts  | topic      |
| :----- | :--------- |
| part 1 | Game logic |
| Part 2 | UI/UX      |
| Part 3 | html       |

## 1. Game logic:

- the grid is `5 * 5` boxes.
- the snake can move up or down, right or left in the grid as long as it's not the opposite direction of the current one.
- the snake grows by 1 box if he eats an apple.
- there will be controls for:
  - speed: `slow` `med` `fast`.
  - difficulty:
    - easy: `5 * 5`.
    - medium: `10 * 10`.
    - hard: `15 * 15`.
  - mute button.
  - restart button.
  - pause button.
- the win/lose condition:
  - WIN: when there are no space left on the grid for the snake to move.
  - lose: when the snake hits any edge of the grid or hits itself.

## 2. UI/UX:

- The game will fill 100% of height and width of the view port screen.
- The grid will take 2 thirds of the screen ftom the right, and the remaining third will be the controls for:
  - speed: `slow` `med` `fast`.
  - difficulty:
    - easy: `5 * 5`.
    - medium: `10 * 10`.
    - hard: `15 * 15`.
  - mute sound effects button.
  - mute background music.
  - restart button.
  - pause button.
- there is a background music, start game sound, winning sound, game over sound, eating sound
- Up on winning: an overlaying object will show infront of the grid saying you win, and a button of play again.
- Up on losing: an overlaying object will show infront of the grid saying you lose, and a button of play again.

## 3. Html:

- body: .game-interface `vh: 100%` / `vw: 100%`
  - header: .banner
  - section: .controls
    - h2: .speed
      - input radio: .slow
      - input radio: .med
      - input radio: .fast
    - h2: .difficulty
      - input radio: .easy
      - input radio: .medium
      - input radio: .hard
    - input checkbox: .mute-sound
    - input checkbox: .mute-music
    - button: .restart
    - button: .pause
  - section: .grid
    - div: .easy-grid
    - div: .medium-grid
    - div: .hard-grid
    - div: .win-block
      - h2: .win-msg
      - button: .restart
    - div: .lose-block
      - h2: .lose-msg
      - button: .restart

## 4. Javascript:
