# Arcade CLI

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/GeorgeET15/arcade-cli/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/GeorgeET15/arcade-cli)](https://github.com/GeorgeET15/arcade-cli/releases)

A command-line tool for initializing retro 2D game projects using the [ARCADE](https://github.com/GeorgeET15/arcade-lib) (Awesome Rendering Control And Dynamics Engine) library, a lightweight, single-header C library for Windows (Win32) and Linux (X11). Compatible with Arcade IDE version 1.1.0 and above.

## Features

- Initializes a game project with `arcade.h` and STB dependencies (`stb_image.h`, `stb_image_write.h`, `stb_image_resize2.h`).
- Creates a `main.c` with a beginner-friendly template (move a red square with arrow keys, display text, play background music).
- Includes a `Makefile` for cross-platform compilation (Windows and Linux) with normalized paths for consistency.
- Adds a `.gitignore` for clean version control.
- Supports a `-b`/`--blank` flag for minimal projects (only library headers).
- Features a polished UI with ASCII art, colored output, and progress spinners.
- Includes a static `background_music.wav` for the game demo.
- Validates assets and provides clear error messages for missing files or dependencies.

## Installation

### Prerequisites

- **Node.js**: Version 14+ required to run the CLI.
- **gcc**: For compiling game projects.
- **Windows**: MinGW with `gdi32` and `winmm` libraries.
- **Linux**: X11 development libraries (`libx11-dev`, `libm`).
- **Static Asset**: A valid `background_music.wav` in the CLI’s `./assets/` directory.

### Install Arcade CLI

Install globally via npm:

```bash
npm install -g arcade-cli
```

The CLI is installed to your global npm directory, typically:

- Linux/Mac: `~/.npm-global/bin/arcade`
- Windows: `%APPDATA%\npm\arcade`

### Additional Setup

1. **Place `background_music.wav`**:

   - Locate the CLI’s installation directory (e.g., `./node_modules/arcade-cli/` in your global npm modules).
   - Create an `assets/` directory: `./node_modules/arcade-cli/assets/`.
   - Add a valid `background_music.wav` file (e.g., a Creative Commons wav from [freesound.org](https://freesound.org)).
   - Verify the file exists at: `./node_modules/arcade-cli/assets/background_music.wav`.
   - The CLI validates this file and outputs an error if missing or invalid.

2. **Install Build Dependencies**:

   - **Windows**: Install MinGW (e.g., via MSYS2):
     ```bash
     pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-make
     ```
     Add MinGW’s `bin/` to your system PATH.
   - **Linux (Ubuntu/Debian)**: Install build tools and X11 libraries:
     ```bash
     sudo apt-get install build-essential libx11-dev
     ```

3. **Install Node.js Dependencies** (if running locally):
   - Ensure dependencies are installed:
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
     - Background music (`assets/background_music.wav`) played in the game state.
     - Detailed comments for beginners.
   - Modify `main.c` to add sprites, logic, or assets. See the [ARCADE Wiki](https://arcade-lib.vercel.app/) for documentation.

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
│   ├── background_music.wav
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

- **Node.js**: Version 14+.
- **gcc**: For compiling the game.
- **Windows**: MinGW or equivalent for `gdi32` and `winmm` libraries.
- **Linux**: X11 development libraries (`libx11-dev`, `libm`).
- **Static Asset**: A valid `background_music.wav` in the CLI’s `./assets/` directory (e.g., `./node_modules/arcade-cli/assets/`).
- **Node.js Dependencies**:
  - `commander`, `axios`, `fs-extra`, `chalk`, `ora`, `figlet`.

Install dependencies if running locally:

```bash
npm install commander axios fs-extra chalk ora figlet
```

## Contributing

See [CONTRIBUTING.md](https://github.com/GeorgeET15/arcade-cli/blob/main/CONTRIBUTING.md) for guidelines on contributing to Arcade CLI.

## License

MIT License. See [LICENSE](https://github.com/GeorgeET15/arcade-cli/blob/main/LICENSE) for details.

## Contact

Have questions or ideas? Open an issue on [GitHub](https://github.com/GeorgeET15/arcade-cli/issues), join our [GitHub Discussions](https://github.com/GeorgeET15/arcade-cli/discussions), or email GeorgeET15 at georgeemmanuelthomas@gmail.com.
