# auto-types 🎯

Automatically install TypeScript type definitions for your project dependencies with zero configuration.

## Features ✨

- 🔍 Automatically detects packages that need TypeScript definitions
- 🚀 Installs missing `@types/*` packages with a single command
- 📦 Works with existing `package.json` dependencies
- ⚡ Zero configuration required
- 🛠️ Supports both interactive and CI environments

## Installation 📥

```bash
npm install -g auto-types
```

## Usage 💻

### Scan Current Project

Simply run `auto-types` in your project directory to scan `package.json` and install missing type definitions:

```bash
auto-types
```

### Install New Packages with Types

Install new packages and their type definitions in one command:

```bash
auto-types install express lodash moment
```

### Install Types for Specific Packages

Install type definitions for specific packages:

```bash
auto-types express lodash moment
```

## How It Works 🔧

`auto-types` performs the following steps:

1. Scans your project's dependencies
2. Checks the NPM registry for available `@types/*` packages
3. Automatically installs missing TypeScript definitions as dev dependencies
4. Provides clear feedback about installed type packages

## Requirements 📋

- Node.js ≥ 14
- npm ≥ 6
- TypeScript ≥ 4.0

## Dependencies 📚

- axios: HTTP client for checking NPM registry
- chalk: Terminal string styling
- ora: Elegant terminal spinners

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Author ✍️

Created with ❤️ by Prashant Patil for the TypeScript community.