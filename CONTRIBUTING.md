# Contributing to Arcade CLI

Thank you for considering contributing to Arcade CLI! This document outlines how to contribute to the project.

## Getting Started

1. **Fork the Repository**:

   - Fork [arcade-cli](https://github.com/GeorgeET15/arcade-cli) on GitHub.

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
   ```bash
   npm link
   ```

## Making Changes

1. **Create a Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Code Standards**:

   - Follow the existing code style (use `eslint` if configured).
   - Write clear, concise commit messages.
   - Ensure the CLI remains compatible with Node.js 14+.

3. **Test Changes**:

   - Test locally with `arcade init test-app`.
   - Verify the generated project compiles with `make` and runs with `make run`.
   - Add tests if applicable (e.g., using Jest).

4. **Update Documentation**:
   - Update `README.md` or other docs if your changes affect usage.
   - Add comments in code for clarity.

## Submitting Changes

1. **Commit Changes**:

   ```bash
   git commit -m "Add your feature description"
   ```

2. **Push to Your Fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**:
   - Go to the [arcade-cli repository](https://github.com/GeorgeET15/arcade-cli).
   - Click "New Pull Request" and select your branch.
   - Provide a clear title and description of your changes.

## Reporting Issues

- Use the [Issues](https://github.com/GeorgeET15/arcade-cli/issues) page to report bugs or suggest features.
- Include steps to reproduce, expected behavior, and actual behavior.

## Code of Conduct

- Be respectful and inclusive.
- Follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Questions?

Contact [GeorgeET15](mailto:georgeemmanuelthomas@gmail.com) or open an issue.

Happy coding!
