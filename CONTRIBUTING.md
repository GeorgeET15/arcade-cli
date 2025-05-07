# Contributing to Arcade CLI

Thank you for considering contributing to Arcade CLI! We welcome contributions to enhance this command-line tool for initializing retro 2D game projects with the ARCADE library. This document outlines how to contribute code, documentation, or other improvements.

## Getting Started

1. **Fork the Repository**:

   - Fork the [arcade-cli](https://github.com/GeorgeET15/arcade-cli) repository on GitHub.

2. **Clone Your Fork**:

   ```bash
   git clone https://github.com/your-username/arcade-cli.git
   cd arcade-cli
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Link Locally**:
   - Link the CLI for local testing:
     ```bash
     npm link
     ```
   - This makes the `arcade` command available globally for testing.

## Making Changes

1. **Create a Branch**:

   - Create a descriptive branch for your changes:
     ```bash
     git checkout -b feature/your-feature-name
     ```
   - Examples: `fix/asset-validation`, `feature/new-cli-flag`.

2. **Code Standards**:

   - Use ES6+ syntax and ensure compatibility with Node.js 14+.
   - Follow existing code style (use `eslint` if configured, or Prettier for formatting).
   - Normalize file paths with forward slashes (`/`) for cross-platform compatibility (e.g., `path.join(...).replace(/\\/g, "/")`).
   - Maintain CLI UI elements (e.g., `chalk` for colored output, `ora` for spinners) for a consistent user experience.
   - Add inline comments for complex logic, especially for asset validation or file generation.
   - Keep dependencies minimal (`commander`, `axios`, `fs-extra`, `chalk`, `ora`, `figlet`).

3. **Test Changes**:

   - Test locally with both full and blank projects:
     ```bash
     arcade init test-app
     arcade init test-lib -b
     ```
   - Verify the generated full project compiles and runs:
     ```bash
     cd test-app
     make
     make run
     ```
   - Ensure `background_music.wav` is in `./assets/` and validated by the CLI.
   - Test on both Windows (MinGW) and Linux (X11) to confirm cross-platform compatibility.
   - Add unit tests if applicable (e.g., using Jest for file generation logic).
   - Validate error messages for missing assets or dependencies.

4. **Update Documentation**:
   - Update `README.md` if your changes affect usage (e.g., new CLI flags, asset requirements).
   - Add inline comments in code for clarity, especially for new features or asset handling.
   - Update any tutorials or examples in the [ARCADE Wiki](https://arcade-lib.vercel.app/) if relevant.

## Submitting Changes

1. **Commit Changes**:

   - Write clear, concise commit messages:
     ```bash
     git commit -m "Add feature: describe your change here"
     ```
   - Sign off your commits to agree to the [Developer Certificate of Origin (DCO)](https://developercertificate.org/):
     ```bash
     git commit -s -m "Your commit message"
     ```

2. **Push to Your Fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**:
   - Go to the [arcade-cli repository](https://github.com/GeorgeET15/arcade-cli).
   - Click "New Pull Request" and select your branch.
   - Provide a clear title and description, referencing related issues (e.g., “Fixes #123”).
   - Ensure your PR includes tests and documentation updates if applicable.

## Reporting Issues

- Use the [Issues](https://github.com/GeorgeET15/arcade-cli/issues) page to report bugs or suggest features.
- Include steps to reproduce, expected behavior, actual behavior, and your environment (e.g., Node.js version, OS).

## Code of Conduct

- Be respectful and inclusive in all interactions.

## Questions?

Contact GeorgeET15 via [GitHub Issues](https://github.com/GeorgeET15/arcade-cli/issues), [GitHub Discussions](https://github.com/GeorgeET15/arcade-cli/discussions), or email at georgeemmanuelthomas@gmail.com.

Happy coding!
