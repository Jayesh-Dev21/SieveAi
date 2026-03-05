# Security Model (Local-First Priority)

## 1. Threat Model
- Local code leakage (no cloud default)
- Prompt injection (via malicious diffs)
- Secret scanning false negatives
- Cache poisoning (tampered SQLite)
- Supply-chain (npm deps)

## 2. Protections
- **Local Default**: Code never leaves machine (Ollama runs offline)
- **Input Sanitization**: Diff parser strips shell/meta chars
- **Secret Vault**: Scan + warn on keys; never log
- **Signed Releases**: NPM publish with GPG
- **Model Isolation**: Ollama in sandbox (Docker if flagged)

## 3. Compliance
- GDPR-friendly (no data exfil)
- SOC2-lite (audit logs in cache/)
- Open-source audit (pre-release scans via Semgrep)

## 4. Incident Response
1. Detect (static scans + runtime assertions)
2. Isolate (fail-safe to text output)
3. Revoke (cache wipe via CLI)
4. Audit (logs in cache/)
5. Patch (hotfix via NPM)

Cloud fallback: Opt-in only; keys via .env (ignored).
