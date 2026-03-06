# SieveAi Usage Guide

Complete guide for using SieveAi CLI with its modern terminal interface.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Command Reference](#command-reference)
- [Configuration](#configuration)
- [Output Formats](#output-formats)
- [Features](#features)
- [Web Interface](#web-interface)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

1. **Node.js 20+** - [Download from nodejs.org](https://nodejs.org/)
2. **Ollama** (for AI analysis) - [Install from ollama.ai](https://ollama.ai/)
3. **Git** - Required for diff analysis

### Install SieveAi

```bash
# Global installation
npm install -g sieveai

# Or run directly with npx
npx sieveai check
```

### Setup Ollama

```bash
# Install Ollama (see ollama.ai for your OS)
ollama pull gemma3:latest  # or your preferred model
ollama serve              # start the server
```

## Quick Start

```bash
# 1. Navigate to your git repository
cd your-project

# 2. Make some changes
echo "console.log('test')" >> file.js

# 3. Run SieveAi (uses modern TUI by default)
sieveai check

# 4. Try different formats
sieveai check --format text   # Plain text for scripts
sieveai check --format json   # JSON for integrations
```

## Command Reference

### `sieveai check`

Main command for code review.

**Syntax:**
```bash
sieveai check [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--model <model>` | LLM model to use | `ollama:gemma3:latest` |
| `--min-confidence <number>` | Minimum confidence threshold (0-100) | `78` |
| `--format <format>` | Output format: `tui`, `text`, `json` | `tui` |
| `--no-cache` | Disable caching | Cache enabled |
| `--no-parallel` | Disable parallel agent execution | Parallel enabled |
| `--verbose` | Enable verbose logging | Disabled |
| `--base <ref>` | Base git ref to compare against | `HEAD` |
| `--target <ref>` | Target git ref to compare | Working tree |
| `--config <path>` | Path to config file | `.sieveai.config.json` |

**Examples:**

```bash
# Basic usage (TUI format)
sieveai check

# Compare specific branches
sieveai check --base main --target feature-branch

# Use different model with high confidence
sieveai check --model ollama:llama3.3 --min-confidence 90

# Verbose output with detailed info
sieveai check --verbose

# Text format for CI/CD pipelines
sieveai check --format text

# JSON for integration with other tools
sieveai check --format json

# Custom config file
sieveai check --config .sieve-custom.json
```

## Configuration

### Config File

Create `.sieveai.config.json` in your project root:

```json
{
  "model": "ollama:gemma3:latest",
  "temperature": 0.7,
  "maxTokens": 2048,
  "minConfidence": 78,
  "enableCache": true,
  "parallel": true,
  "maxConcurrency": 3,
  "enableSecretScanning": true,
  "format": "tui",
  "verbose": false,
  "showRationale": true,
  "enableMemory": true,
  "cachePath": ".sieveai/cache.db"
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `model` | string | LLM model (format: `provider:model`) |
| `temperature` | number | LLM creativity (0.0-1.0) |
| `maxTokens` | number | Maximum tokens per request |
| `minConfidence` | number | Minimum confidence to show findings (0-100) |
| `enableCache` | boolean | Enable SQLite caching |
| `parallel` | boolean | Run agents in parallel |
| `maxConcurrency` | number | Max concurrent agent requests |
| `enableSecretScanning` | boolean | Enable secret detection |
| `format` | string | Default output format (`tui`, `text`, `json`) |
| `verbose` | boolean | Show verbose output |
| `showRationale` | boolean | Show AI reasoning |
| `enableMemory` | boolean | Enable learning system |

### Supported Models

**Ollama (Local):**
- `ollama:gemma3:latest` - Google Gemma 3 (recommended)
- `ollama:llama3.3` - Meta Llama 3.3
- `ollama:codellama` - Code-specialized Llama
- `ollama:mistral` - Mistral model

**Future Support:**
- OpenAI GPT models
- Anthropic Claude
- Local transformer models

## Output Formats

### TUI Format (Default)

Modern, clean terminal interface with professional styling:

```
╔═════════════════════════════════════════════════════════════════════════════════════════╗
║   SieveAi Code Review Report                                                            ║
╚═════════════════════════════════════════════════════════════════════════════════════════╝

SUMMARY
  Total findings: 2
  Files reviewed: 3
  Duration: 1.2s

  BY SEVERITY
    ● CRITICAL: 1
    ● HIGH: 1

FINDINGS
╭─────────────────────────────────────────────────────────────────────────────────────────╮
│  ● CRITICAL | BUG | src/utils.js:42                                                     │
│  Potential null pointer dereference                                                     │
│    Reason: The variable 'data' could be null when accessed without checking.            │
│    Fix: Add null checking: if (data) { ... }                                            │
╰─────────────────────────────────────────────────────────────────────────────────────────╯
```

### Text Format

Clean, readable text output for CI/CD and scripting:

```
================================================================================
  SieveAi Code Review Report
================================================================================

Summary:
  Total findings: 2
  Files reviewed: 3
  Duration: 1.2s

By Severity:
  Critical: 1
  High: 1

CRITICAL | Bug | src/utils.js:42
  Potential null pointer dereference
  
  Reason: The variable 'data' could be null when accessed without checking.
  Fix: Add null checking: if (data) { ... }
```

### JSON Format

Structured data for integration:

```json
{
  "summary": {
    "totalFindings": 2,
    "bySeverity": { "critical": 1, "high": 1 },
    "byCategory": { "bug": 2 }
  },
  "findings": [
    {
      "id": "null-check-utils.js-42",
      "message": "Potential null pointer dereference",
      "location": { "file": "src/utils.js", "line": 42 },
      "severity": "critical",
      "category": "bug",
      "confidence": 85,
      "source": "ai"
    }
  ]
}
```

### TUI Format

Beautiful terminal interface with professional styling:

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║  
║  SieveAi Code Review Report                                                   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

SUMMARY:
  Total findings: 2
  Files reviewed: 3

BY SEVERITY
  ● CRITICAL: 1
  ● HIGH: 1

FINDINGS

╭─────────────────────────────────────────────────────────────────────────────╮
│  ● CRITICAL | BUG | src/utils.js:42                                        │
│  Potential null pointer dereference                                         │
│    Reason: The variable 'data' could be null when accessed without checking. │
│    Fix: Add null checking: if (data) { ... }                                 │
╰─────────────────────────────────────────────────────────────────────────────╯
```

## Features

### 🔍 Analysis Types

**Static Analysis:**
- **Secret scanning** - Detects API keys, passwords, tokens
- **Syntax checking** - JavaScript/JSX syntax errors
- **Pattern matching** - Common code smells

**AI Analysis:**
- **Bug detection** - Logic errors, edge cases
- **Security review** - Vulnerabilities, unsafe patterns  
- **Style analysis** - Code quality, maintainability
- **Performance** - Inefficient algorithms, memory leaks

### 🎯 Confidence System

SieveAi uses confidence scores (0-100) to reduce false positives:
- **90-100**: Very high confidence (likely real issues)
- **78-89**: High confidence (default threshold)
- **60-77**: Medium confidence
- **40-59**: Lower confidence
- **0-39**: Very low confidence (usually filtered out)

### ⚡ Caching System

- **SQLite database** for fast subsequent runs
- **Content-based hashing** - Only re-analyze changed code
- **Agent versioning** - Invalidates cache when agents improve
- **Configurable retention** - Automatic cleanup of old entries

### 🧠 Learning System (Future)

- **False positive detection** - Learn from user feedback
- **Project-specific tuning** - Adapt to codebase patterns
- **Historical analysis** - Track code quality trends

## Web Interface

SieveAi includes a documentation and demo website.

### Development

```bash
# Start development server
npm run web:dev
# Visit http://localhost:5173

# Or from web folder
cd web
npm run dev
```

### Features

- **Interactive demos** - Try SieveAi without installation
- **Documentation** - Complete guides and API reference
- **Configuration builder** - Generate config files
- **Model comparison** - Compare different LLM outputs

### Building

```bash
# Build for production
npm run web:build

# Preview built site
npm run web:preview
```

## Advanced Usage

### CI/CD Integration

**GitHub Actions:**
```yaml
name: Code Review
on: [pull_request]
jobs:
  sieve:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g sieveai
      - run: sieveai check --format json > review.json
      - uses: actions/upload-artifact@v3
        with:
          name: code-review
          path: review.json
```

**Pre-commit Hook:**
```bash
#!/bin/sh
# .git/hooks/pre-commit
sieveai check --min-confidence 85
if [ $? -ne 0 ]; then
  echo "Code review failed. Fix issues before committing."
  exit 1
fi
```

### Custom Workflows

**Review only changed files:**
```bash
# Review staged changes
git add .
sieveai check

# Review specific commit
sieveai check --base HEAD~1 --target HEAD

# Review branch against main
sieveai check --base main --target $(git branch --show-current)
```

**Filter by severity:**
```bash
# Only critical and high severity
sieveai check --min-confidence 85

# All findings including low confidence
sieveai check --min-confidence 0 --verbose
```

**Performance optimization:**
```bash
# Disable AI for faster runs (static only)
sieveai check --model none

# Reduce concurrency on limited resources
sieveai check --no-parallel
```

## Troubleshooting

### Common Issues

**"Failed to initialize cache database"**
```bash
# Fix: Ensure directory permissions
mkdir -p .sieveai
chmod 755 .sieveai

# Or disable cache temporarily  
sieveai check --no-cache
```

**"Ollama request failed: Not Found"**
```bash
# Fix: Pull the correct model
ollama pull gemma3:latest
ollama list  # verify model is available

# Update config to use correct model name
echo '{"model": "ollama:gemma3:latest"}' > .sieveai.config.json
```

**"No changes to review"**
```bash
# Fix: Ensure you have git changes
git status
git add .    # Stage changes if needed

# Or specify explicit comparison
sieveai check --base main
```

**TUI format not working**
```bash
# Fix: Ensure terminal supports colors and UTF-8
export TERM=xterm-256color
sieveai check --format tui
```

### Debug Mode

```bash
# Enable verbose logging
sieveai check --verbose

# Check configuration
echo '{"verbose": true}' > .sieveai.config.json
sieveai check
```

### Performance Issues

**Slow analysis:**
- Reduce `maxConcurrency` in config
- Use smaller/faster models: `ollama:gemma3:2b`
- Enable caching: `"enableCache": true`
- Use `--no-parallel` for sequential processing

**High memory usage:**
- Reduce `maxTokens` in config
- Process fewer files at once
- Restart Ollama occasionally

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/Jayesh-Dev21/SieveAi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Jayesh-Dev21/SieveAi/discussions)  
- **Documentation**: [docs/](../docs/)

---

## Examples

### Example 1: Basic Code Review

```bash
$ sieveai check
✔ Found changes in 2 files
✓ Review complete: 3 findings in 1.2s

🐛 HIGH | Bug | src/api.js:15
  Potential race condition in async function
  
🔒 MEDIUM | Security | src/auth.js:8
  Hardcoded API key detected
  
🎨 LOW | Style | src/utils.js:22
  Consider using const instead of let
```

### Example 2: TUI Interface

```bash
$ sieveai check --format tui
```
![TUI Example](../images/tui-example.png)

### Example 3: JSON Integration

```bash
$ sieveai check --format json | jq '.findings[].severity' | sort | uniq -c
   2 critical
   1 high
   3 medium
```

This guide covers all aspects of using SieveAi effectively. For more specific scenarios, see the individual documentation files in the `docs/` folder.