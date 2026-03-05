# AI Review Agent – Skills Framework (TS + Ink + Local-First)

This maps the system's "skills" – what each component excels at. Focus: local efficiency, low noise, TypeScript reasoning.

## 1. Core Review Skills

### 1.1 Bug Intelligence
- Null/undefined handling in TS/JS
- Async race conditions (Promise misuse)
- State desync (e.g., React hooks)
- Memory leaks (event listeners)
- Type inference gaps

### 1.2 Security Analysis
- Injection vectors (SQL, XSS, command)
- Secret leakage (API keys, env vars)
- Dependency CVEs (via static scan)
- Auth flaws (JWT, session handling)
- Supply-chain risks (npm audit integration)

### 1.3 Performance
- Event loop blocking (sync I/O)
- Inefficient caching (memoization misses)
- Algorithmic waste (O(n^2) loops)
- Resource leaks (timers, streams)

### 1.4 Maintainability
- Circular dependencies
- God modules/functions
- Dead exports/code
- Tight coupling (SOLID violations)

## 2. TypeScript Reasoning Skills
- Static type analysis (generics, unions)
- API contract validation (inferred vs. declared)
- Schema inference (JSON/TS interfaces)
- Runtime-type gap detection (e.g., any[] abuses)

## 3. AI Reasoning Skills
Powered by local models (default: GLM-4.7 quantized via Ollama):
- Structural reasoning (code flow tracing)
- Root cause analysis (why a bug occurs)
- Cross-file inference (refactoring impacts)
- Confidence scoring (0–100 per finding + rationale)

Cloud fallback: Groq (Llama 4 variants) for speed.

## 4. Terminal UX Skills (Ink TUI)
- Stateful rendering (useState for issues)
- Keyboard navigation (Vim-like: j/k/Enter)
- Progressive updates (streaming agent results)
- Responsive layouts (flexbox for panels)
- Theme support (dark/light, semantic colors)

Fallback: Plain text for CI/low-power.

## 5. Policy Enforcement Skills
- Style guides (ESLint/oxc rules)
- Test coverage thresholds
- Naming/compliance checks
- Dependency limits (no lodash if native OK)

## 6. Learning & Memory Skills
- Mistake clustering (group similar false pos)
- Pattern mining (from feedback JSON)
- Adaptive prompts (inject repo-specific examples)
- Feedback loop (👍/👎 → update memory.ts)

## 7. DevOps & Incremental Skills
- CI orchestration (GitHub Actions trigger)
- Commit delta review (only changed hunks)
- Cache invalidation (file hash + SHA)
- Rollback analysis (diff vs. prior review)

## 8. Meta-Skills
- Self-evaluation (agent cross-checks)
- Bias detection (prompt guards)
- Confidence calibration (threshold tuning)
- Trust signals (rationale visibility in output)
