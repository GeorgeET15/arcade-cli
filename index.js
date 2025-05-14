#!/usr/bin/env node
const { program } = require("commander");
const axios = require("axios");
const fs = require("fs-extra");
const chalk = require("chalk");
const ora = require("ora");
const gradient = require("gradient-string");
const path = require("path");
const inquirer = require("inquirer");
const ProgressBar = require("cli-progress");
const figlet = require("figlet");

const colors = {
  teal: chalk.hex("#14c9c9").bold,
  pink: chalk.hex("#FF7BDF"),
  yellow: chalk.hex("#ffda41").underline,
  white: chalk.hex("#F7EFEA"),
  magenta: chalk.hex("#EC2955").bold,
  blue: chalk.hex("#3ad1ff"),
  border: chalk.hex("#262533"),
  green: chalk.hex("#00FF00"),
};

const minimalSpinner = {
  interval: 80,
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
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

// Audio asset
const getAssets = () => [
  {
    url: "https://raw.githubusercontent.com/GeorgeET15/arcade-lib/main/include/background_music.wav",
    path: "assets/background_music.wav",
  },
];

// Empty C file for blank project
const emptyC = (name) =>
  `
// ${name}.c: Main source file for your Arcade game
#define ARCADE_IMPLEMENTATION
#include "arcade/arcade.h"

int main(void) {
    // Your game code here
    return 0;
}
`.trim();

// Empty Makefile for blank project
const emptyMakefile = (srcFile) =>
  `
CC = gcc
CFLAGS = -Iarcade
LDFLAGS_WIN = -lgdi32 -lwinmm
LDFLAGS_LINUX = -lX11 -lm
TARGET = game
SRC = ${srcFile}

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

// Gitignore file
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

const showHome = () => {
  try {
    const gradientColors = [
      "#14c9c9",
      "#FF7BDF",
      "#ffda41",
      "#F7EFEA",
      "#EC2955",
      "#3ad1ff",
    ];
    const customGradient = gradient(gradientColors);

    const arcadeArt = figlet.textSync("ARCADE", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    const lines = arcadeArt.split("\n");
    const maxWidth = Math.max(...lines.map((line) => line.length));
    const paddedArt = lines
      .map((line) => customGradient(line.padEnd(maxWidth)))
      .join("\n");

    console.log("\n");
    console.log(`${paddedArt}`);
    console.log(colors.yellow("Usage:"));
    console.log(colors.white("  arcade init [app-name] [-b, --blank]"));
    console.log(colors.yellow("Options:"));
    console.log(colors.white("  -b, --blank  Create a blank project"));
  } catch (err) {
    console.error(colors.magenta(`Error: ${err.message}`));
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
    throw new Error("Failed to fetch latest release tag.");
  }
};

// Prompt user for config data
const promptForConfig = async (appName) => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "gameName",
        message: colors.teal("Game Name"),
        default: appName,
        validate: (input) =>
          input.trim() ? true : "Game name cannot be empty.",
      },
      {
        type: "input",
        name: "version",
        message: colors.teal("Version"),
        default: "1.0.0",
      },
      {
        type: "input",
        name: "binaryName",
        message: colors.teal("Binary Name"),
        default: "game",
        validate: (input) => {
          if (!input.trim()) return "Binary name cannot be empty.";
          if (!/^[a-zA-Z0-9_-]+$/.test(input))
            return "Binary name can only contain letters, numbers, hyphens, and underscores.";
          return true;
        },
      },
      {
        type: "input",
        name: "main",
        message: colors.teal("Main Source File"),
        default: "main.c",
        validate: (input) =>
          input.endsWith(".c") ? true : "File must end with .c",
      },
      {
        type: "input",
        name: "iconPath",
        message: colors.teal("Icon Path (leave blank for none)"),
        default: "",
      },
      {
        type: "input",
        name: "author",
        message: colors.teal("Author (leave blank for none)"),
        default: "",
      },
      {
        type: "input",
        name: "description",
        message: colors.teal("Description (leave blank for none)"),
        default: "",
      },
    ]);
    return answers;
  } catch (err) {
    throw new Error("Configuration prompt cancelled or failed.");
  }
};

// Prompt for project name if not provided
const promptForProjectName = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: colors.teal("Enter project name"),
        validate: (input) => {
          if (!input.trim()) return "Project name cannot be empty.";
          // Exclude filesystem-reserved characters and reserved names
          if (!/^[a-zA-Z0-9_-]+$/.test(input))
            return "Project name can only contain letters, numbers, hyphens, and underscores.";
          const reservedNames = ["CON", "PRN", "AUX", "NUL", "COM1", "LPT1"];
          if (reservedNames.includes(input.toUpperCase()))
            return "Project name is a reserved system name.";
          return true;
        },
      },
    ]);
    return answers.projectName;
  } catch (err) {
    throw new Error("Project name prompt cancelled or failed.");
  }
};

// Main C file for the game demo
const mainC = `
// A simple Arcade library game where a red square moves with arrow keys
// This demo introduces game states, sprite rendering, input handling, and background music

// Include Arcade library (header + implementation) and standard I/O for text formatting
#define ARCADE_IMPLEMENTATION
#include "arcade.h"

/* Define window dimensions as constants for easy modification */
#define WINDOW_WIDTH 600  /* Width of the game window in pixels */
#define WINDOW_HEIGHT 600 /* Height of the game window in pixels */

/* Enum for game states to manage different screens */
typedef enum
{
    Start,   /* Start screen with "Press Space to Start" prompt */
    Playing  /* Gameplay state where the player moves the square */
} GameState;

int main(void)
{
    /* Game parameters */
    float player_speed = 5.0f; /* Speed of player movement (pixels per frame at 60 FPS) */
    char text[64];             /* Buffer for rendering text (e.g., instructions or prompts) */
    GameState state = Start;   /* Initialize the game in the Start state */

    /* Initialize player sprite as a 40x40 red square positioned at the window's center */
    ArcadeSprite player = {
        .x = WINDOW_WIDTH / 2 - 20.0f,  /* Center horizontally (600/2 - 40/2 = 280) */
        .y = WINDOW_HEIGHT / 2 - 20.0f, /* Center vertically (600/2 - 40/2 = 280) */
        .width = 40.0f,                 /* Width of the square in pixels */
        .height = 40.0f,                /* Height of the square in pixels */
        .vy = 0.0f,                     /* Initial vertical velocity (stationary) */
        .vx = 0.0f,                     /* Initial horizontal velocity (stationary) */
        .color = 0xFF0000,              /* Red color in ARGB format (opaque red) */
        .active = 1                     /* Sprite is active (visible and renderable) */
    };

    /* Initialize sprite group to manage rendering of all sprites */
    SpriteGroup group;               /* Rendering group to hold sprites for drawing */
    arcade_init_group(&group, 1);    /* Initialize group with capacity for 1 sprite (player) */

    /* Initialize Arcade window with specified dimensions, title, and black background */
    if (arcade_init(WINDOW_WIDTH, WINDOW_HEIGHT, "ARCADE: Move Square", 0x000000) != 0)
    {
        arcade_free_group(&group);   /* On initialization failure, free the sprite group */
        return 1;                    /* Exit with error code */
    }

    /* Main game loop: runs until the window is closed or ESC is pressed */
    while (arcade_running() && arcade_update())
    {
        /* Reset sprite group each frame to prepare for rendering */
        group.count = 0;
        /* Add player to render group if active (always true in this game) */
        arcade_add_sprite_to_group(&group, (ArcadeAnySprite){.sprite = player}, SPRITE_COLOR);

        /* Render sprites first to clear the background and draw the player */
        arcade_render_group(&group);

        /* Handle game states using a switch statement */
        switch (state)
        {
        case Start:
            /* Display start prompt in the center of the screen */
            snprintf(text, sizeof(text), "Press Space to Start"); /* Format the start message */
            arcade_render_text_centered(text, WINDOW_HEIGHT / 2.0f, 0xFFFFFF); /* Render white text at center Y */
            /* Transition to Playing state on spacebar press */
            if (arcade_key_pressed_once(a_space) == 2)
            {
                arcade_clear_keys(); /* Clear input buffer to prevent immediate actions in Playing state */
                state = Playing;     /* Transition to Playing state */
                /* Start background music when the game begins */
                arcade_play_sound("assets/background_music.wav");
            }
            break;

        case Playing:
            /* Display movement instructions at the top-left of the screen */
            snprintf(text, sizeof(text), "Use arrow keys to move around"); /* Format instructions */
            arcade_render_text(text, 10.0f, 30.0f, 0xFFFFFF); /* Render white text at (10, 30) */

            /* Handle player movement: set velocity based on arrow key input */
            player.vx = 0.0f; /* Reset horizontal velocity each frame */
            player.vy = 0.0f; /* Reset vertical velocity each frame */
            if (arcade_key_pressed(a_right) == 2)
                player.vx = player_speed;  /* Move right: set positive horizontal velocity */
            if (arcade_key_pressed(a_left) == 2)
                player.vx = -player_speed; /* Move left: set negative horizontal velocity */
            if (arcade_key_pressed(a_up) == 2)
                player.vy = -player_speed; /* Move up: set negative vertical velocity */
            if (arcade_key_pressed(a_down) == 2)
                player.vy = player_speed;  /* Move down: set positive vertical velocity */

            /* Update player position using velocity (simple Euler integration) */
            player.x += player.vx; /* Update X position */
            player.y += player.vy; /* Update Y position */

            /* Keep player within window bounds to prevent moving off-screen */
            if (player.x < 0)
                player.x = 0; /* Clamp to left edge */
            if (player.y < 0)
                player.y = 0; /* Clamp to top edge */
            if (player.x + player.width > WINDOW_WIDTH)
                player.x = WINDOW_WIDTH - player.width; /* Clamp to right edge */
            if (player.y + player.height > WINDOW_HEIGHT)
                player.y = WINDOW_HEIGHT - player.height; /* Clamp to bottom edge */
            break;
        }

        /* Sleep to maintain ~60 FPS (16ms per frame) */
        arcade_sleep(16);
    }

    /* Clean up: free allocated resources before exiting */
    arcade_free_group(&group); /* Free the sprite group */
    arcade_stop_sound();       /* Stop background music */
    arcade_quit();             /* Close the Arcade window */
    return 0;                  /* Exit program successfully */
}
`.trim();

// Makefile for building the game
const getMakefile = (binaryName, srcFile) =>
  `
CC = gcc
CFLAGS = -Iarcade
LDFLAGS_WIN = -lgdi32 -lwinmm
LDFLAGS_LINUX = -lX11 -lm
TARGET = ${binaryName}
SRC = ${srcFile}

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

// Simplified success messages
const successMessages = [
  (appName, releaseTag) => `${appName} ready with ARCADE ${releaseTag}!`,
  (appName, releaseTag) => `${appName} loaded with ARCADE ${releaseTag}!`,
  (appName, releaseTag) => `${appName} set with ARCADE ${releaseTag}!`,
];

// Init command
program
  .command("init [app-name]")
  .description("Create a new ARCADE project")
  .option("-b, --blank", "Create a blank project with only the Arcade library")
  .action(async (appName, options) => {
    let spinner = ora({
      text: "Starting arcade machine...",
      spinner: minimalSpinner,
      color: "cyan",
    }).start();

    try {
      // Prompt for project name if not provided
      let resolvedAppName = appName;
      if (!resolvedAppName) {
        spinner.stop();
        resolvedAppName = await promptForProjectName();
        spinner = ora({
          text: "Starting arcade machine...",
          spinner: minimalSpinner,
          color: "cyan",
        }).start();
      }

      // Resolve release tag with fallback
      spinner.text = "Fetching release tag...";
      let releaseTag;
      try {
        releaseTag = await getLatestReleaseTag();
      } catch (err) {
        spinner.warn(
          colors.yellow(
            "Failed to fetch latest release tag. Using default v1.0.0."
          )
        );
        releaseTag = "v1.0.0"; // Fallback tag
      }
      const headers = getHeaders(releaseTag);

      // Check if directory already exists
      spinner.text = "Checking directory...";
      if (await fs.pathExists(resolvedAppName)) {
        spinner.fail(
          colors.magenta(`Error: Directory ${resolvedAppName} exists!`)
        );
        process.exit(2); // Specific exit code for directory conflict
      }

      // Create arcade directory
      spinner.text = "Creating arcade directory...";
      try {
        await fs.ensureDir(path.join(resolvedAppName, "arcade"));
      } catch (err) {
        throw new Error(`Failed to create arcade directory: ${err.message}`);
      }

      // Download headers with progress bar
      spinner.text = "Downloading headers...";
      const headerBar = new ProgressBar.SingleBar({
        format: `${colors.teal("Headers")} [${colors.blue(
          "█"
        )}:bar${colors.blue("█")}] :percent`,
        barCompleteChar: "█",
        barIncompleteChar: "▒",
        total: headers.length,
      });
      headerBar.start(headers.length, 0);
      await Promise.all(
        headers.map(async (header) => {
          try {
            const response = await axios.get(header.url, {
              responseType: "text",
            });
            await fs.outputFile(
              path.join(resolvedAppName, header.path),
              response.data
            );
            headerBar.increment();
          } catch (err) {
            throw new Error(
              `Failed to download ${header.path}: ${err.message}`
            );
          }
        })
      );
      headerBar.stop();

      // Create assets directory
      spinner.text = "Creating assets directory...";
      try {
        await fs.ensureDir(path.join(resolvedAppName, "assets"));
      } catch (err) {
        throw new Error(`Failed to create assets directory: ${err.message}`);
      }

      if (options.blank) {
        // Prompt for configuration
        spinner.text = "Configuring project...";
        spinner.stop();
        const config = await promptForConfig(resolvedAppName);
        spinner = ora({
          text: "Writing files...",
          spinner: minimalSpinner,
          color: "cyan",
        }).start();

        // Write empty C file, Makefile, and .gitignore
        try {
          await fs.outputFile(
            path.join(resolvedAppName, config.main),
            emptyC(config.main.replace(".c", ""))
          );
          await fs.outputFile(
            path.join(resolvedAppName, "Makefile"),
            emptyMakefile(config.main)
          );
          await fs.outputFile(
            path.join(resolvedAppName, ".gitignore"),
            gitignore
          );
          await fs.outputFile(
            path.join(resolvedAppName, "arcade.config.json"),
            JSON.stringify(config, null, 2)
          );
        } catch (err) {
          throw new Error(`Failed to write project files: ${err.message}`);
        }

        console.log("\n");
        spinner.succeed(
          colors.green(
            successMessages[Math.floor(Math.random() * successMessages.length)](
              resolvedAppName,
              releaseTag
            )
          )
        );
        console.log("\n");
        console.log(
          colors.white(`Navigate to project: `) +
            colors.yellow(`cd ${resolvedAppName}`)
        );
        console.log("\n");
        console.log(colors.magenta("Happy coding !!!"));
        return;
      }

      // Download music for non-blank project
      spinner.text = "Downloading assets...";
      const assets = getAssets();
      const assetBar = new ProgressBar.SingleBar({
        format: `${colors.teal("Assets")} [${colors.blue("█")}:bar${colors.blue(
          "█"
        )}] :percent`,
        barCompleteChar: "█",
        barIncompleteChar: "▒",
        total: assets.length,
      });
      assetBar.start(assets.length, 0);
      await Promise.all(
        assets.map(async (asset) => {
          try {
            const response = await axios.get(asset.url, {
              responseType: "arraybuffer",
            });
            await fs.outputFile(
              path.join(resolvedAppName, asset.path),
              response.data
            );
            assetBar.increment();
          } catch (err) {
            throw new Error(`Failed to download ${asset.path}: ${err.message}`);
          }
        })
      );
      assetBar.stop();

      // Prompt for and write arcade.config.json
      spinner.text = "Configuring project...";
      spinner.stop();
      const config = await promptForConfig(resolvedAppName);
      spinner = ora({
        spinner: minimalSpinner,
        color: "cyan",
      }).start();

      // Write main.c, Makefile, and .gitignore
      try {
        await fs.outputFile(path.join(resolvedAppName, config.main), mainC);
        await fs.outputFile(
          path.join(resolvedAppName, "Makefile"),
          getMakefile(config.binaryName, config.main)
        );
        await fs.outputFile(
          path.join(resolvedAppName, ".gitignore"),
          gitignore
        );
        await fs.outputFile(
          path.join(resolvedAppName, "arcade.config.json"),
          JSON.stringify(config, null, 2)
        );
      } catch (err) {
        throw new Error(`Failed to write project files: ${err.message}`);
      }
      console.log("\n");
      spinner.succeed(
        colors.green(
          successMessages[Math.floor(Math.random() * successMessages.length)](
            resolvedAppName,
            releaseTag
          )
        )
      );
      console.log("\n");
      console.log(
        colors.white(`Navigate to project: `) +
          colors.yellow(`cd ${resolvedAppName}`)
      );
      console.log(colors.white("Build the game: ") + colors.yellow("make"));
      console.log(colors.white("Run the game: ") + colors.yellow("make run"));
      console.log("\n");
      console.log(colors.magenta("Happy coding !!!"));
    } catch (err) {
      spinner.fail(colors.magenta(`Error: ${err.message}`));
      process.exit(3); // Specific exit code for general errors
    } finally {
      spinner.stop();
    }
  });

// Display home screen and parse commands
showHome();
program.parse(process.argv);
