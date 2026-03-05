# Project Folder Structure (sieveAi)

This structure emphasizes modularity, type-safety, and lazy-loading (e.g., Ink TUI only when flagged). Total ~15–20 core files for MVP; scales to 50+ for v1.0.
sieveAi/
├── docs/                      # This folder: all .md files here
│   ├── PLAN.md
│   ├── STRUCTURE.md
│   ├── SKILLS.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── GOVERNANCE.md
│   ├── ROADMAP.md
│   └── CONTRIBUTING.md
│
├── src/
│   ├── cli/                  # CLI entrypoint (commander.js or oclif)
│   │   ├── index.ts          # Main binary
│   │   └── commands/
│   │       ├── check.ts      # Core review command
│   │       └── config.ts     # Model/rules setup
│   │
│   ├── tui/                  # Ink TUI (lazy-loaded via dynamic import)
│   │   ├── App.tsx           # Root Ink component
│   │   ├── screens/
│   │   │   ├── ReviewScreen.tsx  # Main interactive review
│   │   │   └── ConfigScreen.tsx  # Settings wizard
│   │   ├── components/
│   │   │   ├── DiffViewer.tsx    # Syntax-highlighted diff
│   │   │   ├── IssueList.tsx     # Expandable findings
│   │   │   ├── ProgressBar.tsx   # Streaming updates
│   │   │   └── AgentPanel.tsx    # Per-agent results
│   │   └── theme.ts           # Dark/light terminal themes
│   │
│   ├── core/
│   │   ├── diff.ts            # Git diff parsing (simple-git)
│   │   ├── cache.ts           # SQLite + commit/hash invalidation
│   │   ├── memory.ts          # JSON/SQLite for past issues/feedback
│   │   └── orchestrator.ts    # Parallel agent runner
│   │
│   ├── agents/
│   │   ├── types.ts           # Shared ReviewIssue / Confidence types
│   │   ├── baseAgent.ts       # Abstract agent class
│   │   ├── bug.ts             # Bug detection agent
│   │   ├── security.ts        # Security/vuln agent
│   │   └── style.ts           # Style/maintainability agent
│   │                          # (Add perf.ts, arch.ts in Phase 4)
│   │
│   ├── llm/
│   │   ├── client.ts          # Unified OpenAI-compatible interface
│   │   └── providers/         # Swappable backends
│   │       ├── ollama.ts      # Local default (GLM-4.7 auto-detect)
│   │       ├── localai.ts     # LM Studio / LocalAI support
│   │       ├── groq.ts        # Cheap cloud fallback
│   │       └── openai.ts      # Premium cloud (opt-in)
│   │
│   ├── static/
│   │   ├── semgrep.ts         # Rules-based static analysis
│   │   └── secrets.ts         # TruffleHog-style secret scan
│   │
│   └── integrations/
│       └── github.ts          # Octokit for PR comments / inline annotations
│
├── rules/                     # User-editable
│   └── default.yaml           # Base policies (e.g., max complexity: 10)
│
├── tests/                     # Jest / Vitest
│   ├── unit/                  # Agent / LLM mocks
│   ├── integration/           # End-to-end flows
│   └── e2e/                   # CLI command tests
│
├── cache/                     # Runtime (gitignored)
│   └── .gitkeep               # SQLite DB here
│
├── .github/
│   └── workflows/
│       └── ci.yml             # Build/test + auto-review on PRs
│
├── scripts/                   # Utilities
│   ├── setup.ts               # NPM post-install
│   ├── benchmark.ts           # Perf tests
│   └── migrate.ts             # Cache schema updates
│
├── package.json               # Name: "sieveai", bin: "sieveai"
├── tsconfig.json              # Strict TS config
├── README.md                  # Quickstart + badges
└── LICENSE                    # MIT
text**Notes**:
- Total lines of code target: <5k for MVP (focus on composability).
- Gitignore: `cache/`, `node_modules/`, `.env` (for API keys).
- See [ARCHITECTURE.md](ARCHITECTURE.md) for data flows.

---

## Actual Implementation (As Built - 2026-03-05)

The MVP has been implemented with the following actual structure:

```
SieveAi/
├── docs/                          # Documentation (8 files)
├── src/                           # TypeScript source
│   ├── agents/                    # AI review agents (4 files)
│   │   ├── base-agent.ts          # Abstract agent with LLM integration
│   │   ├── bug-agent.ts           # Bug detection
│   │   ├── security-agent.ts      # Security analysis
│   │   └── style-agent.ts         # Maintainability
│   │
│   ├── cache/                     # SQLite caching (2 files)
│   │   ├── database.ts            # Better-sqlite3 wrapper
│   │   └── manager.ts             # High-level cache interface
│   │
│   ├── cli/                       # Command-line interface (2 files)
│   │   ├── index.ts               # Commander.js setup
│   │   └── commands/check.ts      # Main check command
│   │
│   ├── config/                    # Configuration (3 files)
│   │   ├── schema.ts              # Zod schemas
│   │   ├── defaults.ts            # Default values
│   │   └── loader.ts              # Config discovery
│   │
│   ├── git/                       # Git operations (2 files)
│   │   ├── repository.ts          # simple-git wrapper
│   │   └── diff-parser.ts         # Unified diff parser
│   │
│   ├── llm/                       # LLM client (3 files)
│   │   ├── client.ts              # Unified interface
│   │   ├── prompts.ts             # System/user prompts
│   │   └── providers/ollama.ts    # Ollama HTTP client
│   │
│   ├── orchestrator/              # Agent coordination (1 file)
│   │   └── orchestrator.ts        # Parallel execution & filtering
│   │
│   ├── reporters/                 # Output formatters (2 files)
│   │   ├── text-reporter.ts       # Chalk-based terminal output
│   │   └── json-reporter.ts       # JSON output
│   │
│   ├── static/                    # Static analysis (1 file)
│   │   └── secrets.ts             # Regex secret scanner
│   │
│   ├── types/                     # Type definitions (1 file)
│   │   └── index.ts               # All shared types
│   │
│   └── utils/                     # Utilities (4 files)
│       ├── logger.ts              # debug + chalk logger
│       ├── hash.ts                # SHA-256 utilities
│       ├── errors.ts              # Error handling
│       └── index.ts               # Common utilities
│
├── dist/                          # Compiled output (gitignored in dev)
├── node_modules/                  # Dependencies
├── .sieveai/                      # Runtime cache (gitignored)
│   └── cache.db                   # SQLite database
│
├── .gitignore
├── .sieveai.config.example.json   # Example config
├── biome.json                     # Linter/formatter config
├── LICENSE                        # MIT
├── package.json
├── README.md
├── tsconfig.json
├── vitest.config.ts
└── test-sample.js                 # Demo file for testing
```

**Total files created:** 39 files  
**Lines of code:** ~3,700 (excluding node_modules, tests)  
**Build size:** ~150KB compiled JavaScript (dist/)

### Key Implementation Choices

1. **Native ESM** - All imports use `.js` extensions (Node16 modules)
2. **Strict TypeScript** - All strict flags enabled except `exactOptionalPropertyTypes`
3. **Zero external API deps** - No axios, no external LLM APIs by default
4. **Synchronous SQLite** - better-sqlite3 for fast caching
5. **Graceful degradation** - Works without LLM (static analysis only)

