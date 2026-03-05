# sieveAi – Master Plan (TypeScript + Ink + Local-First – March 2026)

## 1. Vision

A fast, private, hybrid AI code review tool that runs **locally first**, acts as a strong pre-human/Copilot review layer, and feels like a precision instrument for serious developers.

Core principles (2026 reality):
- Never send code to cloud unless user explicitly opts in
- Default: powerful local models via Ollama / LM Studio / LocalAI
- Hybrid: static tools (Semgrep, oxc, secrets) run always — LLM only for deep reasoning
- False positives <8–10% after repo tuning
- Incremental: only review deltas + cache aggressively
- Text CLI = default → Ink TUI = opt-in rich experience

Targets:
- Local interactive CLI / TUI (binary: `sieveai`)
- GitHub PR comment bot (via --post or CI)
- GitLab / Bitbucket support later

Inspired by: Anthropic's code-review plugin (multi-agent parallelism, confidence filtering) + tools like Semgrep + local LLM patterns from Ollama workflows.

## 2. Core Objectives

### Primary
- Catch bugs, security issues, maintainability problems early
- Provide high-signal, low-noise feedback
- Respect privacy & cost (local default)

### Secondary
- Incremental speed (re-review in seconds, not minutes)
- Learning over time (memory of past false positives / accepted patterns)
- Pleasant power-user TUI (keyboard-first, streaming, panels)

## 3. Development Phases (realistic solo/small-team estimates)

| Phase | Goal | Key Deliverables | Est. Solo Time | Success Criteria |
|-------|------|------------------|----------------|------------------|
| **0 – Setup & Foundations** | Bootstrap | CLI binary, Ink hello-world, local LLM smoke test (Ollama/GLM-4.7), git diff → text output | 1–2 weeks | `sieveai --help` works, model answers "hello world" review |
| **1 – Usable Text CLI MVP** | Core value | Text-only review, 3 agents (bug/security/style), confidence ≥75 filter, GitHub --post-comment, basic rules.yaml, semgrep integration | 4–6 weeks | Reviews real PRs with <12% noise, inline comments useful |
| **2 – Incremental & Memory** | Speed + smarts | File-level cache (embed hash invalidation), simple project memory (common-mistakes.json), incremental commit review | 3–5 weeks | Re-review 5-commit PR in <25s instead of 120s |
| **3 – Rich Ink TUI** | Power-user delight | Interactive screen: diff viewer, issue list (expandable), agent panels, keyboard nav, live progress/streaming, theme support | 4–7 weeks | Feels like a "control panel", not just prettier logs; optional via flag |
| **4 – Polish & Hardening** | Production-grade | Feedback loop (👍/👎 → fine-tune examples), more agents (perf/arch), local model auto-detect (Ollama/LM Studio), --model flag family, extensive tests | 4–6 weeks | >70% install-to-daily-use conversion in dogfood, <8% false pos |

**Total realistic timeline (focused solo dev)**: ~4–6 months to solid v1.0

## 4. Technical Pillars

1. **TypeScript type-safety** – Strict mode, generics for agents/issues
2. **Terminal UX engineering** – Ink for opt-in TUI; text fallback
3. **Hybrid static + AI analysis** – Semgrep/oxc always; LLM for reasoning
4. **Policy governance** – rules.yaml + validator
5. **Observability** – Structured logs, metrics (e.g., review time, noise rate)

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Bug Detection Rate | >45% |
| Review Speed | <60s (full) / <10s (incremental) |
| False Positives | <8% |
| Local Model Uptime | >95% (auto-detect success) |
| Adoption (dogfood) | >75% daily use in test repos |

## 6. Risk Management

| Risk | Mitigation |
|------|------------|
| Model drift / hallucinations | Prompt versioning + confidence scoring + static pre-filter |
| High latency | Parallel agents + caching + local quantized models (e.g., GLM-4.7-Q4) |
| API cost (cloud fallback) | Local default + cheap providers (Groq/Together.ai) + token limits |
| TUI performance | Lazy-load Ink; progressive rendering; text fallback |
| False-positive creep | Human feedback loop + project memory |

## 7. Governance Model

- Prompt registry (versioned in code)
- Agent certification (unit tests per agent)
- Policy audits (quarterly rules review)
- Security reviews (pre-release scans)

See [GOVERNANCE.md](GOVERNANCE.md) for details.

## 8. Deployment Strategy

- NPM package: `npm i -g sieveai`
- Docker image for CI
- Homebrew/Scoop formulas
- Self-hosted runners (no cloud deps)

## 9. Cost Planning (Local-First Bias)

| Area | Cost |
|------|------|
| LLM (local default) | $0 (Ollama/GLM-4.7) |
| Cloud fallback | Low (<$0.50/review via Groq) |
| CI infra | Low (GitHub Actions) |
| Storage (cache) | Negligible (SQLite) |

## 10. Long-Term Vision

- Autonomous refactoring suggestions
- Self-healing via memory (auto-apply common fixes)
- Plugin system for custom agents
- Cross-platform (VS Code extension, IDE integrations)
