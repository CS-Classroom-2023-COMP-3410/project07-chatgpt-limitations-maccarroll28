Feature: Dynamically Resizing Game Window Inside the Fruit Border
This update improves the game window by making it dynamically resize while staying centered within the fruit border. Previously, the window expanded incorrectly, causing layout issues. Now, the game container adjusts smoothly while keeping all elements properly formatted.

Changes Implemented:
Game Container Resizing

The .game-container now expands dynamically when the game starts, using min(80vw, 700px) and min(80vh, 90%) to ensure proper scaling.
It remains centered using transform: translate(-50%, -50%).
Grid Responsiveness

Updated .grid styles to use grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); so the card layout adapts to different screen sizes.
Button Adjustments

Buttons now scale properly with width: 80%; max-width: 300px; to prevent layout shifts.
Fruit Border Alignment

The generateFruitBorder() function now repositions fruits dynamically to surround the resized game area instead of the entire screen.
These changes ensure the game remains playable at any window size without breaking the layout.

