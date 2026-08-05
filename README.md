# Not Ur Regular Snake Game 🐍

A feature-rich, web-based classic Snake game built with HTML5 Canvas, CSS, and JavaScript. It includes customizable themes, local storage leaderboards, and audio support.

### **Features**

- **Classic Gameplay**: Move with W, A, S, D or Arrow keys. Eat food to grow and increase your score. Avoid the walls and your own tail!

- **Customizable Themes**: Mix and match themes for the Snake Head, Body, and Food. Includes Basic, Golden, Xmas, and Carnival themes.

- **Audio SFX & Music**: Enjoy background music while you play, with satisfying sound effects for eating and game over states. Includes mute toggles.

- **Adjustable Speed**: Choose between Slow, Med, and Fast difficulties.

- **Local Leaderboard**: Saves your player name and top 5 high scores locally in your browser so you can compete against yourself.

- **Pause Functionality**: Press `Escape` or use the on-screen button to pause the game at any time.

### **How to Run**

Because this project uses a single-file architecture (all CSS and JS are bundled into one HTML file), running it is incredibly simple.

1. Download or clone the `index.html` file to your local machine.

2. Double-click `index.html` to open it in your preferred web browser (Chrome, Firefox, Safari, Edge, etc.).

3. No server or build process is required!

(Note: In the provided code, generic placeholder images and audio URLs are used. For the best experience, replace these URLs in the `<audio>` and `<img>` tags, as well as the JS objects, with your own local assets).

### **Controls**

- **Movement**: `W`, `A`, `S`, `D` or `Arrow Up`, `Arrow Down`, `Arrow Left`, `Arrow Right`.

- **Pause**: `Escape` key.

- **Start/Restart**: Use the on-screen buttons.

### **Architecture**

- **HTML5 Canvas**: Used for rendering the game grid, snake, and food efficiently.

- **JavaScript**: Handles the game loop (`setInterval`), collision detection, state management, and DOM manipulation.

- **CSS**: Flexbox and Absolute positioning are used to create the layout, control panels, and overlay menus.

### **Customizing Assets**

If you wish to use your own images or audio files, simply update the `src` attributes in the code:

1. **Audio**: Find the `<audio>` tags at the top of the `<body>` in `index.html` and change the `src` attribute within the `<source>` tags to your `.mp3` or `.wav` files.

2. **Images**: Search for the `headColor`, `foodColor`, and the Theme Picker HTML section in the file, and replace the placeholder URLs (e.g., https://placehold.co/...) with paths to your local image assets (e.g., ./assets/my-head.png).
