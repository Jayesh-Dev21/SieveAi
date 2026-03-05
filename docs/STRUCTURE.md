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
