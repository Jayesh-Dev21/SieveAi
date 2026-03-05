## Setup, Build & Publish

This document shows how to clone the repo, install dependencies, build the project, run tests, and publish to npm.

Prerequisites
 - Node.js >= 20 (see `package.json` engines)
 - npm (comes with Node.js)
 - Optional: Ollama if you plan to use local LLMs

Clone

```bash
git clone https://github.com/Jayesh-Dev21/SieveAi.git
cd SieveAi
```

Install

```bash
npm install
```

Build

The project uses TypeScript. The build step emits files into `dist`.

```bash
npm run build
```

Development (watch)

```bash
npm run dev
```

Run locally (after build)

The package exposes a CLI binary at `./dist/cli/index.js`. You can run it directly or install the package globally for convenience.

```bash
# run directly
node ./dist/cli/index.js check

# or install locally (for testing) and run `sieveai` command
npm install -g .
sieveai check
```

Tests

Run unit tests with Vitest:

```bash
npm test
# or
npm run test:watch
```

Lint & Format

This project uses Biome for linting/formatting.

```bash
npm run lint
npm run lint:fix
npm run format
```

Publishing to npm

Before publishing, ensure the `name` and `version` fields in `package.json` are correct. The `prepublishOnly` script will run `npm run clean` and `npm run build` automatically.

1. Log in to npm (use the account you want to publish under):

```bash
npm login
```

2. (Optional) If you want to publish under a scoped name (e.g., `@your-org/sieveai`), update `package.json` accordingly.

3. Publish:

```bash
# for public packages
npm publish --access public

# or for scoped packages you may need --access public:
npm publish --access public
```

4. Verify the package on https://www.npmjs.com/

Notes & tips
- If you intend to publish the CLI, make sure `bin` in `package.json` points to the built CLI and that `files` includes `dist`.
- Double-check that `engines.node` matches your intended supported Node versions.
- Use semantic versioning: bump `version` in `package.json` before publishing, e.g. `npm version patch`.
- When publishing updates frequently, consider publishing release notes and GitHub releases.

If you want, I can add a `release` workflow (GitHub Actions) to automate publishing on tagged releases.
