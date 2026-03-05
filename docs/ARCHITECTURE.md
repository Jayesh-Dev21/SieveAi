# System Architecture (TypeScript + Local-First)

## 1. Layers
CLI (text/default) → Diff/Context → Static Pre-Filter → Agent Orchestrator → Scoring/Memory → Reporter (TUI or text)

- **Entry**: `ai-review check [--tui] [--post-pr] [--model ollama:glm-4.7]`
- **Flow**: Parse git diff → Run semgrep/secrets → Parallel agents → Filter (confidence ≥78) → Cache results → Output

## 2. Agent Mesh (Parallel, Inspired by Anthropic Plugin)
Agents run concurrently (Promise.all):
- BugAgent: Logic errors
- SecurityAgent: Vulns/secrets
- StyleAgent: Maintainability

Each outputs: `{ message: string; location: {file, line}; confidence: number; rationale: string }`

Orchestrator: `orchestrator.ts` aggregates + cross-checks high-sev.

## 3. Data Flow
```yml
git diff (simple-git)
↓ (hash for cache key)
Cache Check (SQLite: if unchanged → skip)
↓
Static Filter (Semgrep + secrets.ts)
↓ (pre-filter low-hanging fruit)
LLM Parallel Calls (llm/client.ts → Ollama/GLM-4.7)
↓ (parallel: 3 agents)
Memory Inject (memory.ts: past issues as few-shot)
↓
Confidence Filter (≥78, configurable)
↓
Formatter (JSON/text/TUI)
↓
Reporter (github.ts for PR comments or Ink App.tsx)
```


## 4. Storage & Caching
- **SQLite** (better-sqlite3): Per-repo cache (key: commit SHA + file hash)
- **JSON** (memory.ts): Past feedback (e.g., `{issueHash: {isFalsePos: true, examples: [...]}}`)
- Incremental: Only re-run if `sha256(content) !== cachedHash`

## 5. Scaling Model
- Stateless agents (no shared state)
- Async queues (for long reviews)
- Local-only: No external deps beyond Ollama (auto-start if needed)

See [STRUCTURE.md](STRUCTURE.md) for file mappings.
```



```


