# Governance Framework

## 1. Model & Prompt Governance
- Prompts versioned in code (e.g., `prompts/bug-v1.ts`)
- Output audits: Log all findings to cache/ for review
- Bias checks: Few-shot examples diverse; no hard-coded assumptions

## 2. Agent Governance
- Unit tests per agent (mock LLM responses)
- Certification: 90% accuracy on benchmark dataset (e.g., TS bugs corpus)

## 3. Policy Governance
- rules.yaml: YAML schema validated on load
- Quarterly reviews: Update defaults based on memory.ts trends
- Exceptions: `--ignore-rule` flag for one-off

## 4. Community & Open-Source
- RFC process for new agents (GitHub issues)
- Transparency: Publish noise rates in README
- Voting: Core changes via PR labels

Aligns with MIT license; see CONTRIBUTING.md.
