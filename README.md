# SieveAi

![](https://raw.githubusercontent.com/Jayesh-Dev21/SieveAi/refs/heads/master/sieveAssets/banner_f.png?token=GHSAT0AAAAAADMCDFJPSGFGCRY5XQA6J34K2NJCCLA)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Vitest](https://img.shields.io/badge/tests-vitest-10b981?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![npm](https://img.shields.io/npm/v/sieveai?color=cb3837&logo=npm&logoColor=white)

**Local-first AI code review CLI/TUI with hybrid static+AI analysis**

SieveAi is an open-source code review tool that combines static analysis with local LLM-powered insights. Review your code privately without sending it to external servers.

## Features

- 🔒 **Local-first**: Code never leaves your machine (uses Ollama by default)
- 🤖 **Hybrid Analysis**: Combines static patterns with AI reasoning
- ⚡ **Fast & Incremental**: SQLite-based caching for speed
- 🎯 **Confidence Filtering**: Only show high-confidence findings (default ≥78%)
- 🔍 **Multiple Agents**: Bug detection, security analysis, style/maintainability
- 📊 **Rich Output**: Text, JSON, or TUI formats
- 🧠 **Learning System**: Reduce false positives over time

## Quick Start

### Prerequisites

1. **Node.js 20+**
2. **Ollama** (for local LLM)
  ```bash
  # Install Ollama: https://ollama.ai
  # Pull default model
  ollama pull glm-4.7
  ```

### Installation

```bash
npm install -g sieveai
```

### Usage

```bash
# Review current changes
sieveai check

# Review staged changes only
git add .
sieveai check

# Compare branches
sieveai check --base main --target feature-branch

# Output as JSON
sieveai check --format json

# Use different model
sieveai check --model ollama:llama3.3

# Adjust confidence threshold
sieveai check --min-confidence 85
```

## Configuration

Create `.sieveai.config.json` in your project root:

```json
{
  "model": "ollama:glm-4.7",
  "minConfidence": 78,
  "enableCache": true,
  "enableSecretScanning": true,
  "parallel": true,
  "format": "text",
  "verbose": false,
  "showRationale": true
}
```

## Architecture

```
CLI → Git Diff → Static Analysis → AI Agents (parallel) → Filter → Cache → Report
                     ↓                    ↓
                Secret Scanner      Bug/Security/Style
                                   (Ollama/Local LLM)
```

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/sieveai
cd sieveai

# Install dependencies
npm install

# Build
npm run build

# Run locally
./dist/cli/index.js check

# Run tests
npm test

# Lint/format
npm run lint:fix
npm run format
```

For a complete step-by-step guide (clone → build → test → publish), see [docs/SETUP_BUILD.md](docs/SETUP_BUILD.md).

## Project Structure

```
src/
├── agents/          # AI review agents (bug, security, style)
├── cache/           # SQLite caching layer
├── cli/             # Command-line interface
├── config/          # Configuration loading
├── git/             # Git operations & diff parsing
├── llm/             # LLM client abstraction
├── orchestrator/    # Agent coordination
├── reporters/       # Output formatters
├── static/          # Static analysis (secrets)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Roadmap

**Phase 1 (Current)**: MVP with text output, Ollama support, basic caching
**Phase 2**: TUI interface (Ink), GitHub PR integration
**Phase 3**: Memory/learning system, more agents (performance, architecture)
**Phase 4**: VS Code extension, custom agent plugins

See [docs/ROADMAP.md](docs/ROADMAP.md) for details.

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for development guidelines.

## Security

See [docs/SECURITY.md](docs/SECURITY.md) for threat model and security practices.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by Anthropic's code review patterns
- Uses Ollama for local LLM inference
- Built with TypeScript, Commander.js, Ink, and better-sqlite3

---

**Made with ❤️ for developers who value privacy and code quality**
