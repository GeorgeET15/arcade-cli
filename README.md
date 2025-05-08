# Arcade CLI

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/GeorgeET15/arcade-cli/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/GeorgeET15/arcade-cli)](https://github.com/GeorgeET15/arcade-cli/releases)

A command-line tool for initializing retro 2D game projects using the [ARCADE](https://github.com/GeorgeET15/arcade-lib) (Awesome Rendering Control And Dynamics Engine) library, a lightweight, single-header C library for Windows (Win32) and Linux (X11). Compatible with Arcade IDE version 1.1.0 and above.

## Features

- Initializes a game project with `arcade.h` and STB dependencies (`stb_image.h`, `stb_image_write.h`, `stb_image_resize2.h`).
- Creates a `main.c` with a beginner-friendly demo (move a red square with arrow keys, display text, play background music).
- Generates a cross-platform `Makefile` for Windows (`gdi32`, `winmm`) and Linux (`X11`, `libm`) with normalized paths.
- Includes a `.gitignore` for clean version control.
- Supports a `-b`/`--blank` flag for minimal projects with basic setup (library headers, empty `main.c`, `Makefile`).
- Features an interactive UI with ASCII art, colored output, progress spinners, and configuration prompts.
- Automatically downloads `background_music.wav` from the ARCADE repository for the demo project.
- Generates an `arcade.config.json` file to store project metadata (game name, version, etc.).
- Validates assets and provides clear error messages for network issues or missing dependencies.

## Installation

### Prerequisites

- **Node.js**: Version 16+ (recommended for compatibility).
- **gcc**: Required for compiling game projects.
- **Windows**: MinGW with `gdi32` and `winmm` libraries (e.g., via MSYS2).
- **Linux**: X11 development libraries (`libx11-dev`, `libm`).
- **Internet Connection**: Required to fetch `arcade.h`, STB headers, and `background_music.wav` from GitHub.

### Install Arcade CLI

Install globally via npm:

```bash
npm install -g arcade-cli
```

The CLI is installed to your global npm directory, typically:

- **Linux**: `~/.npm-global/bin/arcade`
- **Windows**: `%APPDATA%\npm\arcade`

Verify the installation:

```bash
arcade --help
```

### Additional Setup

1. **Install Build Dependencies**:

   - **Windows**: Install MinGW via MSYS2:
     ```bash
     pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-make
     ```
     Add MinGW’s `bin/` to your system PATH.
   - **Linux (Ubuntu/Debian)**: Install build tools and X11 libraries:
     ```bash
     sudo apt-get install build-essential libx11-dev
     ```

2. **Install Node.js Dependencies** (if running locally):
   If you’re running the CLI from source (not globally installed), install dependencies:
   ```bash
   npm install commander axios fs-extra chalk ora figlet
   ```

## Getting Started

1. **Initialize a Project**:

   - Create a full game project with a demo:
     ```bash
     arcade init my-game
     ```
   - Create a blank project (library headers, empty `main.c`, `Makefile`):
     ```bash
     arcade init my-lib -b
     ```

2. **Answer Configuration Prompts**:

   - The CLI will prompt for:
     - Game Name (default: project name)
     - Version (default: `1.0.0`)
     - Binary Name (default: `game`)
     - Main Source File (default: `main.c`)
     - Icon Path (optional)
     - Author (optional)
     - Description (optional)
   - These details are saved in `arcade.config.json`.

3. **Build and Run** (for full projects):

   ```bash
   cd my-game
   make
   make run
   ```

4. **Explore `main.c`**:
   - The demo in `main.c` includes:
     - A red square movable with arrow keys.
     - A start screen with "Press Space to Start".
     - Background music (`assets/background_music.wav`) played during gameplay.
     - Detailed comments for beginners.
   - Modify `main.c` to add sprites, logic, or assets. See the [ARCADE Wiki](https://arcade-lib.vercel.app/) for documentation.

## Usage

Initialize a new ARCADE project:

```bash
arcade init <app-name> [-b, --blank]
```

### Options

- `-b, --blank`: Create a minimal project with library headers, an empty `main.c`, and a basic `Makefile`.

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
  # Add your own game logic to main.c
  make
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
├── arcade.config.json
```

### Blank Project (`-b`)

```
my-lib/
├── arcade/
│   ├── arcade.h
│   ├── stb_image.h
│   ├── stb_image_write.h
│   ├── stb_image_resize2.h
├── assets
├── main.c
├── Makefile
├── .gitignore
├── arcade.config.json
```

## Requirements

- **Node.js**: Version 16+.
- **gcc**: For compiling game projects.
- **Windows**: MinGW with `gdi32` and `winmm` libraries.
- **Linux**: X11 development libraries (`libx11-dev`, `libm`).
- **Node.js Dependencies**:
  - `commander`, `axios`, `fs-extra`, `chalk`, `ora`, `figlet`.

Install dependencies if running locally:

```bash
npm install commander axios fs-extra chalk ora figlet
```

## Troubleshooting

- **"arcade: command not found"**:
  - Ensure the global npm bin directory is in your PATH:
    - Linux: `export PATH=~/.npm-global/bin:$PATH`
    - Windows: Add `%APPDATA%\npm` to your system PATH.
- **Network Errors**:
  - Verify your internet connection, as the CLI fetches assets from GitHub.
  - Check GitHub status (https://www.githubstatus.com/) for outages.
- **Build Errors**:
  - Ensure `gcc` and platform-specific libraries (`gdi32`, `winmm` for Windows; `libx11-dev`, `libm` for Linux) are installed.
- **Missing `background_music.wav`**:
  - The CLI fetches this file from the ARCADE repository. Ensure the repository is accessible.

## Contributing

See [CONTRIBUTING.md](https://github.com/GeorgeET15/arcade-cli/blob/main/CONTRIBUTING.md) for guidelines on contributing to Arcade CLI.

## License

MIT License. See [LICENSE](https://github.com/GeorgeET15/arcade-cli/blob/main/LICENSE) for details.

## Contact

Have questions or ideas? Open an issue on [GitHub](https://github.com/GeorgeET15/arcade-cli/issues), join our [GitHub Discussions](https://github.com/GeorgeET15/arcade-cli/discussions), or email the maintainer at georgeemmanuelthomas@gmail.com.
