# Contributing Guide

## Workflow
1. Fork + clone
2. `npm i` (install deps)
3. Branch: `feat/your-feature`
4. Code: Follow TS strict + ESLint
5. Test: `npm test` (90% coverage)
6. Lint: `npm run lint`
7. PR: Describe changes + link issue

## Standards
- TypeScript: Strict mode, no `any`
- Tests: Jest/Vitest; mock LLMs
- Docs: Update if changing PLAN.md refs
- Commits: Conventional (feat:, fix:, docs:)

## Development Setup
- Run Ollama: `ollama run glm-4.7` (or equiv)
- Local: `npm run dev` (watch mode)
- CI: Triggers on PR (lint/test/review self)

Questions? Open an issue.
