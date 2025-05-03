#!/usr/bin/env node

const { program } = require("commander");
const axios = require("axios");
const fs = require("fs-extra");
const chalk = require("chalk");
const ora = require("ora");

// Use chalk's built-in colors
const colors = {
  teal: chalk.cyan,
  pink: chalk.magenta,
  yellow: chalk.yellow,
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

const mainC = `
#define ARCADE_IMPLEMENTATION
#include "arcade/arcade.h"

int main(void)
{

    int window_width = 600;
    int window_height = 600;
    int player_speed = 5.0f;
    char text[64];

    ArcadeSprite player = {
        .x = window_width / 2 - 10.0f,
        .y = window_height / 2 - 10.0f,
        .width = 40.0f,
        .height = 40.0f,
        .vy = 0.0f,
        .vx = 0.0f,
        .color = 0xFF0000,
        .active = 1};

    if (arcade_init(window_width, window_height, "ARCADE", 0x000000) != 0) // Black background
    {
        return 1;
    }

    while (arcade_running())
    {

        int status = arcade_update();

        if (status == 0)
            break;

        snprintf(text, sizeof(text), "Use arrow keys to move around");
        arcade_render_text_centered(text, 300.0f, 0xFFFFFF);

        // Handle player movement
        if (arcade_key_pressed(a_right) == 2 && player.active)
        {
            player.x += player_speed;
        }
        else if (arcade_key_pressed(a_left) == 2 && player.active)
        {
            player.x -= player_speed;
        }
        else if (arcade_key_pressed(a_up) == 2 && player.active)
        {
            player.y -= player_speed;
        }
        else if (arcade_key_pressed(a_down) == 2 && player.active)
        {
            player.y += player_speed;
        }

        if (player.active)
        {
            if (player.x < 0)
                player.x = 0;
            if (player.y < 0)
                player.y = 0;
            else if (player.x + player.width > window_width)
                player.x = window_width - player.width;
            else if (player.y + player.height > window_height)
                player.y = window_height - player.height;
        }

        // Prepare sprites for rendering
        ArcadeAnySprite sprites[1]; // Player, bullet, and up to MAX_ASTEROIDS
        int types[1];
        int sprite_count = 0;

        // Add player
        if (player.active)
        {
            sprites[sprite_count].sprite = player;
            types[sprite_count] = SPRITE_COLOR;
            sprite_count++;
        }

        arcade_render_scene(sprites, sprite_count, types);

        usleep(16666); // Approx 60 FPS (1000000 / 60)
    }

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

// Minimal home screen
const showHome = () => {
  try {
    console.log(colors.teal.bold("ARCADE CLI"));
    console.log(colors.pink("Retro 2D Game Development with ARCADE Library"));

    console.log();
    console.log(colors.yellow("Usage:"));
    console.log(colors.yellow("  arcade init <app-name> [--release <tag>]"));
    console.log();
    console.log(colors.yellow("Options:"));
    console.log(
      colors.yellow(
        "  --release <tag>  Specify ARCADE release tag (default: latest)"
      )
    );
    console.log();
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
      "Failed to fetch latest release tag. Check internet connection or specify --release <tag>."
    );
  }
};

// Init command
program
  .command("init <app-name>")
  .description("Create a new ARCADE project")
  .option("--release <tag>", "Specify ARCADE release tag", "latest")
  .action(async (appName, options) => {
    const spinner = ora(colors.teal("Setting up...")).start();

    try {
      // Resolve release tag
      const releaseTag =
        options.release === "latest"
          ? await getLatestReleaseTag()
          : options.release;
      const headers = getHeaders(releaseTag);

      // Check if directory already exists
      if (await fs.pathExists(appName)) {
        spinner.fail(colors.pink(`Directory ${appName} already exists.`));
        process.exit(1);
      }

      // Create directories
      await fs.ensureDir(`${appName}/arcade`);
      await fs.ensureDir(`${appName}/assets`);
      spinner.text = "Fetching headers...";

      // Download headers
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

      // Write main.c, Makefile, and .gitignore
      spinner.text = "Writing project files...";
      await fs.outputFile(`${appName}/main.c`, mainC);
      await fs.outputFile(`${appName}/Makefile`, makefile);
      await fs.outputFile(`${appName}/.gitignore`, gitignore);

      // Add placeholder assets
      spinner.text = "Adding assets...";
      await fs.outputFile(`${appName}/assets/player.png`, "");
      await fs.outputFile(`${appName}/assets/sound.wav`, "");

      spinner.succeed(
        colors.teal(`Created ${appName} with ARCADE ${releaseTag}`)
      );
      console.log(colors.yellow("Next steps:"));
      console.log(`  cd ${appName}`);
      console.log(`  make          # Build the game`);
      console.log(`  make run      # Run the game`);
      console.log(
        colors.pink(
          "Replace assets/player.png and assets/sound.wav with valid files."
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
