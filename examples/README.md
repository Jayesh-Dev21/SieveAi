# SieveAi Examples

This directory contains practical examples demonstrating SieveAi's capabilities across different programming languages and scenarios.

## Quick Start Examples

### 1. Basic Usage
```bash
# Run code review on current git changes
npm run check

# Run with verbose output  
npm run check:verbose

# Get JSON output for automation
npm run check:json
```

### 2. Configuration Examples

**Minimal Config** (`.sieveai.config.json`):
```json
{
  "model": "ollama:gemma3:latest",
  "minConfidence": 80
}
```

**Full Config** (`.sieveai.config.json`):
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

## Language-Specific Examples

### C++ Example
See [cpp-example/](cpp-example/) - Demonstrates const correctness, RAII patterns, and performance optimization suggestions.

### JavaScript/TypeScript Example  
See [js-example/](js-example/) - Shows security vulnerability detection, performance improvements, and modern JS patterns.

### Python Example
See [python-example/](python-example/) - Illustrates algorithmic improvements, type safety, and Python best practices.

### Multi-Language Project
See [multi-lang-project/](multi-lang-project/) - Full-stack application with frontend, backend, and configuration files.

## CI/CD Integration Examples

### GitHub Actions
See [github-actions.yml](ci-cd/github-actions.yml) - Complete workflow for automated code review.

### GitLab CI
See [gitlab-ci.yml](ci-cd/gitlab-ci.yml) - GitLab pipeline configuration.

## Advanced Use Cases

### Custom Analysis Scripts
See [scripts/](scripts/) - Shell scripts for specialized analysis workflows.

### Team Configuration
See [team-configs/](team-configs/) - Different configuration presets for various team needs.

## Output Format Examples

### TUI Output
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   SieveAi Code Review Report                                      ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

SUMMARY
  Total findings: 3
  Files reviewed: 2
  Duration: 1.2s

  BY SEVERITY
    ● CRITICAL: 1
    ● HIGH: 1
    ● MEDIUM: 1

FINDINGS
...
```

### JSON Output
See [output-examples/](output-examples/) for complete JSON response examples.

## Getting Started

1. **Choose an example** that matches your use case
2. **Copy the configuration** to your project
3. **Run SieveAi** using the provided commands
4. **Customize** based on your team's needs

Each example includes:
- Sample code with common issues
- Expected SieveAi output
- Recommended fixes
- Configuration explanations