# SieveAi

![](https://sieve-ai.vercel.app/banner_f.png)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Vitest](https://img.shields.io/badge/tests-vitest-10b981?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![npm](https://img.shields.io/npm/v/sieveai?color=cb3837&logo=npm&logoColor=white)

**Advanced AI-Powered Code Review Tool with hybrid static + Active AI analysis**

> 📦 **Available on npm:** `npm install -g sieveai` | [View on NPM](https://www.npmjs.com/package/sieveai)

SieveAi is an intelligent code review tool that combines static analysis with AI-powered insights to help maintain code quality, security, and performance. It supports 15+ programming languages and provides deep analysis including const correctness, security vulnerabilities, logic errors, and architectural improvements.
## Showcase

![](./sieveAssets/demo_no_review.gif)
![](./sieveAssets/demo_now_review.gif)

## Features

### AI-Powered Analysis
- **Logic & Bug Detection**: Identifies complex logic errors, race conditions, memory leaks
- **Security Analysis**: Detects injection vulnerabilities, authentication issues, unsafe patterns  
- **Performance Optimization**: Suggests const correctness, inline functions, algorithmic improvements
- **Architecture Review**: SOLID principles, encapsulation, design patterns

### Multi-Language Support
- **Systems Languages**: C++, C, Rust, Go
- **JVM Languages**: Java, Kotlin, Scala
- **Web Technologies**: JavaScript, TypeScript, HTML, CSS
- **Scripting**: Python, Ruby, Shell, PHP
- **Data Formats**: JSON, YAML, Markdown
- **And more**: Automatic language detection

### Comprehensive Analysis
- **Static Analysis**: Syntax checking, secret scanning, dependency analysis
- **Whitespace Analysis**: Formatting consistency, unnecessary diff noise detection
- **Security Scanning**: Built-in secret detection, vulnerability patterns
- **Performance Insights**: Optimization opportunities, algorithmic improvements

### Professional Output
- **Clean TUI Interface**: Professional bordered output with severity indicators
- **Multiple Formats**: TUI, JSON, plain text
- **Detailed Reports**: Confidence scores, rationale, fix suggestions
- **Git Integration**: Works with diffs, staged changes, commits

## Quick Start

### Installation

#### Option 1: NPM Package (Recommended)

```bash
# Install globally for CLI usage
npm install -g sieveai

# Or install locally in your project
npm install --save-dev sieveai
```

#### Option 2: From Source

```bash
# Clone the repository
git clone https://github.com/Jayesh-Dev21/SieveAi.git
cd SieveAi

# Install dependencies
npm install

# Build the project
npm run build

# Make globally available (optional)
npm link
```

### Setup LLM Backend

SieveAi requires an LLM for AI-powered analysis. Currently supports Ollama:

```bash
# Install Ollama (https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a supported model
ollama pull gemma3:latest
# or
ollama pull llama3.2:latest
# or
ollama pull deepseek-coder:latest
```

### Basic Usage

```bash
# Run code review on current git changes
sieveai check

# Run with verbose output
sieveai check --verbose

# Run with specific format
sieveai check --format json

# Run with custom model
sieveai check --model ollama:deepseek-coder:latest

# If installed locally in project:
npx sieveai check
```

## Configuration

Create a `.sieveai.config.json` file in your project root:

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
  "showRationale": true
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | string | `"ollama:gemma3:latest"` | LLM model (provider:model:tag) |
| `temperature` | number | `0.7` | AI creativity (0.0-1.0) |
| `maxTokens` | number | `2048` | Maximum response length |
| `minConfidence` | number | `78` | Minimum confidence for findings (0-100) |
| `enableCache` | boolean | `true` | Enable result caching |
| `parallel` | boolean | `true` | Run agents in parallel |
| `maxConcurrency` | number | `3` | Max parallel agent execution |
| `enableSecretScanning` | boolean | `true` | Scan for leaked secrets |
| `format` | string | `"tui"` | Output format: `"tui"`, `"json"`, `"text"` |
| `verbose` | boolean | `false` | Enable detailed logging |
| `showRationale` | boolean | `true` | Show reasoning for findings |

## Usage Examples

### Example 1: C++ Code Review

```cpp
// ProcessingUnit.cpp
class ProcessingUnit {
public:
    void execute(std::vector<int> data) {  // ❌ Missing const, pass by value
        if (data.size() > 0) {             // ❌ Use !data.empty()
            process(data[0]);
        }
    }
private:
    std::string secret_key = "hardcoded_key"; // ❌ Security issue
};
```

**SieveAi Analysis:**
```
● HIGH | PERFORMANCE | ProcessingUnit.cpp:3
  Function parameter should be const reference
  Fix: Change to `const std::vector<int>& data` for better performance

● MEDIUM | STYLE | ProcessingUnit.cpp:4  
  Use container.empty() instead of size() comparison
  Fix: Replace `data.size() > 0` with `!data.empty()`

● CRITICAL | SECURITY | ProcessingUnit.cpp:8
  Hardcoded secret detected in source code
  Fix: Move sensitive data to environment variables or config files
```

### Example 2: JavaScript Security Analysis

```javascript
// server.js
app.get('/user/:id', (req, res) => {
    const query = `SELECT * FROM users WHERE id = ${req.params.id}`;  // ❌ SQL injection
    db.query(query, (err, results) => {
        res.json(results);  // ❌ No error handling
    });
});
```

**SieveAi Analysis:**
```
● CRITICAL | SECURITY | server.js:2
  SQL injection vulnerability detected
  Fix: Use parameterized queries: `SELECT * FROM users WHERE id = ?`

● HIGH | BUG | server.js:3
  Unhandled database error could crash application  
  Fix: Add proper error handling for database operations
```

## Advanced Features

### Custom Analysis Depth

```bash
# High confidence only (fewer, higher-quality findings)
sieveai check --min-confidence 90

# Lower confidence (more findings, some potential false positives)  
sieveai check --min-confidence 50

# Performance-focused analysis
sieveai check --model ollama:deepseek-coder:latest --temperature 0.3
```

### Git Integration

```bash
# Review specific commit range
sieveai check --base main --target feature-branch

# Review staged changes only
git add . && sieveai check --staged

# Review specific files
git diff path/to/file.cpp | sieveai check
```

### Output Formats

```bash
# Beautiful TUI output (default)
sieveai check --format tui

# JSON for automation
sieveai check --format json | jq '.findings[] | select(.severity == "critical")'

# Plain text for logging
sieveai check --format text >> code-review.log
```

## Development

### Building from Source

```bash
# Development setup
git clone https://github.com/Jayesh-Dev21/SieveAi.git
cd SieveAi
npm install

# Development build with watch
npm run dev

# Production build
npm run build

# Run tests
npm test
```

### Available Scripts

```bash
# Core scripts
npm run build          # Build TypeScript to dist/
npm run dev           # Watch mode for development
npm test             # Run test suite
npm run lint         # Lint code with ESLint
npm run format       # Format code with Prettier

# Quick usage
npm run check         # Run code review
npm run check:verbose # Run with verbose output
npm run check:json    # Get JSON output
npm run setup         # One-command setup
```

### Project Structure

```
src/
├── agents/          # AI analysis agents (bug, security, style)
├── cache/           # Result caching system
├── cli/             # Command-line interface
├── config/          # Configuration management
├── git/             # Git integration and diff parsing
├── llm/             # LLM client and prompts
├── orchestrator/    # Main review coordination
├── reporters/       # Output formatting (TUI, JSON, text)
├── static/          # Static analyzers (syntax, secrets, whitespace)
├── types/           # TypeScript type definitions
└── utils/           # Shared utilities

docs/               # Documentation
examples/           # Usage examples
web/                # Web interface (Vite + React)
dist/               # Compiled output
```

## Troubleshooting

### Common Issues

**LLM Not Available**
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
systemctl restart ollama  # Linux
brew services restart ollama  # macOS
```

**Model Not Found**
```bash
# Pull the model explicitly
ollama pull gemma3:latest

# Check available models
ollama list
```

**Slow Analysis**
```bash
# Reduce model size
sieveai check --model ollama:gemma3:2b  

# Disable caching temporarily
sieveai check --no-cache

# Reduce concurrency
sieveai check --max-concurrency 1
```

**High Memory Usage**
```bash
# Use smaller model
ollama pull gemma3:2b

# Reduce token limit
echo '{"maxTokens": 1024}' > .sieveai.config.json
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- **New Language Support**: Add syntax checkers for additional languages
- **AI Agents**: Enhance existing agents or create specialized ones
- **LLM Providers**: Add support for OpenAI, Anthropic, etc.
- **Static Analyzers**: Improve existing or add new static analysis tools
- **Documentation**: Help improve documentation and examples

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) for local LLM inference
- [Google Gemma](https://ai.google.dev/gemma) for the base AI model
- All contributors and the open source community

---

**Made with ❤️ for better code quality**
