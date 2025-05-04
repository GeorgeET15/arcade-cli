#!/usr/bin/env node

const { program } = require("commander");
const axios = require("axios");
const fs = require("fs-extra");
const chalk = require("chalk");
const ora = require("ora");
const figlet = require("figlet");
const path = require("path");

// Use chalk's built-in colors
const colors = {
  teal: chalk.cyan.bold,
  pink: chalk.magenta,
  yellow: chalk.yellow.underline,
  white: chalk.white,
};

// Header files with dynamic release tag
const getHeaders = (releaseTag) => [
  {
    url: `https://github.com/GeorgeET15/arcade-lib/releases/download/${releaseTag}/arcade.h`,
    path: "arcade/arcade.h",
  },
  {
    url: "https://raw.githubusercontent.com/GeorgeET15/arcade-lib/main/include/stb_image.h",
    path: "arcade/stb_image.h",
  },
  {
    url: "https://raw.githubusercontent.com/GeorgeET15/arcade-lib/main/include/stb_image_write.h",
    path: "arcade/stb_image_write.h",
  },
  {
    url: "https://raw.githubusercontent.com/GeorgeET15/arcade-lib/main/include/stb_image_resize2.h",
    path: "arcade/stb_image_resize2.h",
  },
];

// Audio asset (static)
const getAssets = () => [
  {
    source: path.join(__dirname, "assets/background_music.wav"),
    path: "assets/background_music.wav",
  },
];

const mainC = `
// move_square.c: A simple Arcade library game where a red square moves with arrow keys
// This demo introduces game states, sprite rendering, input handling, and background music

// Include Arcade library (header + implementation) and standard I/O for text formatting
#define ARCADE_IMPLEMENTATION
#include "arcade/arcade.h"

// Define window dimensions as constants for easy modification
#define WINDOW_WIDTH 600
#define WINDOW_HEIGHT 600

// Enum for game states to manage different screens (Start, Playing)
typedef enum
{
    Start,  // Start screen with "Press Space to Start" prompt
    Playing // Gameplay where the player moves the square
} GameState;

int main(void)
{
    // Game parameters
    float player_speed = 5.0f; // Speed of player movement (pixels per frame)
    char text[64];             // Buffer for rendering text (e.g., instructions)
    GameState state = Start;   // Start the game in the Start state

    // Initialize player sprite (40x40 red square at window center)
    ArcadeSprite player = {
        .x = WINDOW_WIDTH / 2 - 20.0f,  // Center horizontally (600/2 - 40/2)
        .y = WINDOW_HEIGHT / 2 - 20.0f, // Center vertically (600/2 - 40/2)
        .width = 40.0f,
        .height = 40.0f, // Size of the square
        .vy = 0.0f,
        .vx = 0.0f,        // Initial velocity (stationary)
        .color = 0xFF0000, // Red color (RGB hex)
        .active = 1        // Sprite is active (visible)
    };

    // Initialize sprite group to manage rendering of all sprites
    SpriteGroup group;
    arcade_init_group(&group, 1); // Only one sprite (player)

    // Initialize Arcade window (600x600, black background)
    if (arcade_init(WINDOW_WIDTH, WINDOW_HEIGHT, "ARCADE: Move Square", 0x000000) != 0)
    {
        arcade_free_group(&group);
        return 1;
    }

    // Main game loop: runs until the window is closed
    while (arcade_running() && arcade_update())
    {
        // Reset sprite group each frame
        group.count = 0;
        // Add player to render group if active
        arcade_add_sprite_to_group(&group, (ArcadeAnySprite){.sprite = player}, SPRITE_COLOR);

        // Render sprites first to clear the background and draw the player
        arcade_render_group(&group);

        // Handle game states
        switch (state)
        {
        case Start:
            // Display start prompt in the center
            snprintf(text, sizeof(text), "Press Space to Start");
            arcade_render_text_centered(text, WINDOW_HEIGHT / 2.0f, 0xFFFFFF); // White text
            // Transition to Playing state on spacebar press
            if (arcade_key_pressed_once(a_space) == 2)
            {
                arcade_clear_keys(); // Clear input to avoid immediate actions
                state = Playing;
                // Start background music
                arcade_play_sound("assets/background_music.wav");
            }
            break;
        case Playing:
            // Display instructions at the top-left
            snprintf(text, sizeof(text), "Use arrow keys to move around");
            arcade_render_text(text, 10.0f, 30.0f, 0xFFFFFF); // White text

            // Handle player movement: set velocity based on arrow keys
            player.vx = 0.0f; // Reset horizontal velocity
            player.vy = 0.0f; // Reset vertical velocity
            if (arcade_key_pressed(a_right) == 2)
                player.vx = player_speed; // Move right
            if (arcade_key_pressed(a_left) == 2)
                player.vx = -player_speed; // Move left
            if (arcade_key_pressed(a_up) == 2)
                player.vy = -player_speed; // Move up
            if (arcade_key_pressed(a_down) == 2)
                player.vy = player_speed; // Move down

            // Update player position using velocity
            player.x += player.vx;
            player.y += player.vy;
            // Keep player within window bounds
            if (player.x < 0)
                player.x = 0; // Left edge
            if (player.y < 0)
                player.y = 0; // Top edge
            if (player.x + player.width > WINDOW_WIDTH)
                player.x = WINDOW_WIDTH - player.width; // Right edge
            if (player.y + player.height > WINDOW_HEIGHT)
                player.y = WINDOW_HEIGHT - player.height; // Bottom edge
            break;
        }

        // Sleep to maintain ~60 FPS (16ms per frame)
        arcade_sleep(16);
    }

    // Clean up: free sprite group and window
    arcade_free_group(&group);
    arcade_stop_sound();
    arcade_quit();
    return 0;
}
`.trim();

const makefile = `
CC = gcc
CFLAGS = -Iarcade
LDFLAGS_WIN = -lgdi32 -lwinmm
LDFLAGS_LINUX = -lX11 -lm
TARGET = game
SRC = main.c

all: $(TARGET)

$(TARGET): $(SRC)
\t@echo "Building for $(shell uname -s)..."
\t@if [ "$(shell uname -s)" = "Linux" ]; then \
\t\t$(CC) $(SRC) $(CFLAGS) $(LDFLAGS_LINUX) -o $(TARGET); \
\telse \
\t\t$(CC) $(SRC) $(CFLAGS) $(LDFLAGS_WIN) -o $(TARGET).exe; \
\tfi

clean:
\t@rm -f $(TARGET) $(TARGET).exe

run: $(TARGET)
\t@if [ "$(shell uname -s)" = "Linux" ]; then \
\t\t./$(TARGET); \
\telse \
\t\t./$(TARGET).exe; \
\tfi

.PHONY: all clean run
`.trim();

const gitignore = `
# Build artifacts
game
game.exe
*.o

# IDE files
.vscode/
.idea/

# Misc
*.log
`.trim();

// Minimal home screen with ASCII art
const showHome = () => {
  try {
    console.log(
      colors.teal(figlet.textSync("ARCADE CLI", { font: "Standard" }))
    );
    console.log(colors.pink("Retro 2D Game Development with ARCADE Library"));
    console.log(colors.white("========================================"));

    console.log();
    console.log(colors.yellow("Usage:"));
    console.log(colors.white("  arcade init <app-name> [-b, --blank]"));
    console.log();
    console.log(colors.yellow("Options:"));
    console.log(
      colors.white(
        "  -b, --blank  Create a blank project with only the Arcade library"
      )
    );
    console.log();
    console.log(
      colors.pink("Get started with a game demo or a minimal setup!")
    );
  } catch (err) {
    console.error(chalk.red(`Error displaying home screen: ${err.message}`));
  }
};

// Check latest release tag
const getLatestReleaseTag = async () => {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/GeorgeET15/arcade-lib/releases/latest"
    );
    return response.data.tag_name;
  } catch (err) {
    throw new Error(
      "Failed to fetch latest release tag. Check internet connection."
    );
  }
};

// Init command
program
  .command("init <app-name>")
  .description("Create a new ARCADE project")
  .option("-b, --blank", "Create a blank project with only the Arcade library")
  .action(async (appName, options) => {
    const spinner = ora(colors.teal("Initializing project...")).start();

    try {
      // Resolve release tag
      const releaseTag = await getLatestReleaseTag();
      const headers = getHeaders(releaseTag);

      // Check if directory already exists
      if (await fs.pathExists(appName)) {
        spinner.fail(colors.pink(`Directory ${appName} already exists.`));
        process.exit(1);
      }

      // Create arcade directory
      spinner.text = "Creating arcade directory...";
      await fs.ensureDir(`${appName}/arcade`);

      // Download headers
      spinner.text = "Downloading Arcade headers...";
      for (const header of headers) {
        try {
          const response = await axios.get(header.url, {
            responseType: "text",
          });
          await fs.outputFile(`${appName}/${header.path}`, response.data);
        } catch (err) {
          throw new Error(`Failed to fetch ${header.path}: ${err.message}`);
        }
      }

      if (options.blank) {
        spinner.succeed(
          colors.teal(
            `Created blank project ${appName} with ARCADE ${releaseTag}`
          )
        );
        console.log(colors.white("========================================"));
        console.log(colors.yellow("Next steps:"));
        console.log(colors.white(`  cd ${appName}`));
        console.log(colors.white("  Start coding with the Arcade library!"));
        console.log(colors.pink("Headers are in the arcade/ directory."));
        return;
      }

      // Create assets directory and copy music
      spinner.text = "Creating assets directory...";
      await fs.ensureDir(`${appName}/assets`);
      const assets = getAssets();
      spinner.text = "Copying background music...";
      for (const asset of assets) {
        try {
          await fs.copyFile(asset.source, `${appName}/${asset.path}`);
        } catch (err) {
          throw new Error(`Failed to copy ${asset.path}: ${err.message}`);
        }
      }

      // Write main.c, Makefile, and .gitignore
      spinner.text = "Writing project files...";
      await fs.outputFile(`${appName}/main.c`, mainC);
      await fs.outputFile(`${appName}/Makefile`, makefile);
      await fs.outputFile(`${appName}/.gitignore`, gitignore);

      spinner.succeed(
        colors.teal(`Created game project ${appName} with ARCADE ${releaseTag}`)
      );
      console.log(colors.white("========================================"));
      console.log(colors.yellow("Next steps:"));
      console.log(colors.white(`  cd ${appName}`));
      console.log(colors.white(`  make          # Build the game`));
      console.log(colors.white(`  make run      # Run the game`));
      console.log(
        colors.pink(
          "Background music is included in assets/background_music.wav."
        )
      );
    } catch (err) {
      spinner.fail(colors.pink(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// Handle input
(async () => {
  if (!process.argv.slice(2).length || process.argv.includes("--help")) {
    showHome();
    process.exit(0);
  }

  program.on("command:*", () => {
    console.error(colors.pink(`Unknown command: ${program.args.join(" ")}`));
    showHome();
    process.exit(1);
  });

  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    console.error(colors.pink(`Error: ${err.message}`));
    process.exit(1);
  }
})();
