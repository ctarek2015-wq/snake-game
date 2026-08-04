Not Ur Regular Snake

A classic Snake game built with HTML5 Canvas, CSS, and vanilla JavaScript. Guide the snake to eat the food, grow longer, and avoid hitting the walls or your own tail.

Features

Classic Gameplay: Smooth grid-based movement using a game loop on an HTML5 <canvas>.

Variable Speed: Choose your difficulty level by selecting Slow, Med, or Fast speed settings from the control panel.

Pause/Resume Functionality: Hit the Escape key or use the on-screen buttons to take a break.

Local Storage Integration: The game remembers your player name across sessions using browser Local Storage.

Input Queuing: Implemented queuing for direction changes (nextDx, nextDy) to prevent the snake from accidentally turning back on itself when keys are pressed in rapid succession.

How to Play

Start: Enter your name in the intro screen and click "Submit".

Move: Use the Arrow Keys or W, A, S, D to control the direction of the snake. The game begins as soon as you press a movement key.

Objective: Guide the snake's head to the red food block. Every time the snake eats, it grows longer and your score increases.

Pause: Press the Escape (Esc) key or click the "Pause" button on the control panel to pause the game.

Game Over: The game ends if the snake hits the edges of the grid or collides with its own body. Click "Play Again" or "Restart" to try again.

Project Structure

index.html: Contains the layout of the game, including the canvas, control panel, leaderboard UI, and overlay messages (intro, pause, game over).

style.css: Provides the styling, colors, and layout for the game interface using Flexbox.

app.js: Contains all the game logic, state management, collision detection, event listeners, and canvas rendering.

Setup

This game requires no build tools, dependencies, or local server. Simply open the index.html file in any modern web browser to play.

Future Enhancements / WIP

Based on the current codebase, here are a few features planned for future updates:

Live Score Updates: Connect the internal score variable to update the UI score display during gameplay.

Audio Implementation: Add functional sound effects for eating, moving, and game over states, connecting them to the existing "Mute SFX" and "Mute Music" toggles.

Leaderboard Logic: Implement the logic to save high scores to local storage and dynamically populate the Leaderboard section in the UI.

Overlay Fixes: Fine-tune the intro screen submission to ensure the overlay smoothly hides (updating display: hidden to display: none).
