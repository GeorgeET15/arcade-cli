# Arcade CLI

A command-line tool for initializing retro 2D game projects using the [ARCADE](https://github.com/GeorgeET15/arcade-lib) (Awesome Rendering Control And Dynamics Engine) library, a lightweight, single-header C library for Windows (Win32) and Linux (X11).

## Features

- Initializes a game project with `arcade.h` and dependencies (`stb_image.h`, `stb_image_write.h`, `stb_image_resize2.h`).
- Creates a `main.c` with a basic game template (player sprite, movement, text, sound).
- Includes a `Makefile` for easy compilation on Windows and Linux.
- Adds a `.gitignore` for clean version control.
- Supports custom ARCADE library release tags.

## Installation

Install globally via npm:

```bash
npm install -g arcade-cli
```

## Usage

Initialize a new ARCADE project:

```bash
arcade init <app-name> [--release <tag>]
```

### Options

- `--release <tag>`: Specify an ARCADE release tag (default: `latest`).

### Example

```bash
arcade init my-game
cd my-game
make
make run
```

Replace `assets/player.png` and `assets/sound.wav` with valid files. See the [ARCADE Wiki](https://github.com/GeorgeET15/arcade-lib/wiki) for documentation.

## Project Structure

```
my-game/
├── arcade/
│   ├── arcade.h
│   ├── stb_image.h
│   ├── stb_image_write.h
│   ├── stb_image_resize2.h
├── assets/
│   ├── player.png
│   ├── sound.wav
├── main.c
├── Makefile
├── .gitignore
```

## Requirements

- **Node.js** (for the CLI).
- **gcc** (for compiling the game).
- Windows: MinGW or similar for `gdi32` and `winmm` libraries.
- Linux: X11 development libraries (`libx11-dev`, `libm`).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
