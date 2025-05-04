# Arcade CLI

A command-line tool for initializing retro 2D game projects using the [ARCADE](https://github.com/GeorgeET15/arcade-lib) (Awesome Rendering Control And Dynamics Engine) library, a lightweight, single-header C library for Windows (Win32) and Linux (X11).

## Features

- Initializes a game project with `arcade.h` and STB dependencies (`stb_image.h`, `stb_image_write.h`, `stb_image_resize2.h`).
- Creates a `main.c` with a beginner-friendly template (move a red square with arrow keys, display text, play background music).
- Includes a `Makefile` for cross-platform compilation (Windows and Linux).
- Adds a `.gitignore` for clean version control.
- Supports a `-b`/`--blank` flag for minimal projects (only library headers).
- Features a polished UI with ASCII art, colored output, and progress spinners.
- Includes a static `background_music.mp3` for the game demo.

## Installation

Install globally via npm:

```bash
npm install -g arcade-cli
```

### Additional Setup

1. **Place `background_music.mp3`**:

   - Create an `assets/` directory in the CLI's installation directory (where `arcade-cli.js` is located).
   - Add a valid `background_music.mp3` file to `./assets/`. You can use a Creative Commons MP3 from [freesound.org](https://freesound.org) or another source.
   - Example path: `./node_modules/arcade-cli/assets/background_music.mp3`.

2. **Install Dependencies**:
   - Ensure Node.js dependencies are installed:
     ```bash
     npm install commander axios fs-extra chalk ora figlet
     ```

## Getting Started

1. **Initialize a Project**:

   - Create a full game project with a demo:
     ```bash
     arcade init my-game
     ```
   - Create a blank project (only library headers):
     ```bash
     arcade init my-lib -b
     ```

2. **Build and Run** (for full projects):

   ```bash
   cd my-game
   make
   make run
   ```

3. **Explore `main.c`**:
   - The generated `main.c` includes:
     - A red square player movable with arrow keys.
     - A start screen with "Press Space to Start".
     - Background music (`assets/background_music.mp3`) played in the game state.
     - Detailed comments for beginners.
   - Modify `main.c` to add sprites, logic, or assets. See the [ARCADE Wiki](https://github.com/GeorgeET15/arcade-lib/wiki) for documentation.

## Usage

Initialize a new ARCADE project:

```bash
arcade init <app-name> [-b, --blank]
```

### Options

- `-b, --blank`: Create a minimal project with only the Arcade library headers.

### Examples

- Full game project:

  ```bash
  arcade init my-game
  cd my-game
  make
  make run
  ```

- Blank project:
  ```bash
  arcade init my-lib -b
  cd my-lib
  # Add your own source files and Makefile
  ```

## Project Structure

### Full Project

```
my-game/
├── arcade/
│   ├── arcade.h
│   ├── stb_image.h
│   ├── stb_image_write.h
│   ├── stb_image_resize2.h
├── assets/
│   ├── background_music.mp3
├── main.c
├── Makefile
├── .gitignore
```

### Blank Project (`-b`)

```
my-lib/
├── arcade/
│   ├── arcade.h
│   ├── stb_image.h
│   ├── stb_image_write.h
│   ├── stb_image_resize2.h
```

## Requirements

- **Node.js**: Required to run the CLI.
- **gcc**: For compiling the game.
- **Windows**: MinGW or equivalent for `gdi32` and `winmm` libraries.
- **Linux**: X11 development libraries (`libx11-dev`, `libm`).
- **Static Asset**: A valid `background_music.mp3` in the CLI’s `./assets/` directory (e.g., `./node_modules/arcade-cli/assets/`).
- **Node.js Dependencies**:
  - `commander`, `axios`, `fs-extra`, `chalk`, `ora`, `figlet`.

Install dependencies if running locally:

```bash
npm install commander axios fs-extra chalk ora figlet
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
