const Terminal = () => {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dot orange"></div>
        <div className="terminal-dot"></div>
        <div className="terminal-dot"></div>
      </div>
      <div className="terminal-body">
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span className="terminal-command">sieveai check</span>
        </div>
        <div className="terminal-output">→ Analyzing git diff...</div>
        <div className="terminal-output">→ Running static analysis...</div>
        <div className="terminal-output">→ Invoking AI agents (Bug, Security, Style)...</div>
        <div className="terminal-output">→ Filtering by confidence ≥78%...</div>
        <div className="terminal-output"></div>
        <div className="terminal-output terminal-success">✓ Found 3 high-confidence issues</div>
        <div className="terminal-output terminal-success">✓ Analysis complete in 2.3s</div>
        <div className="terminal-output"></div>
        <div className="terminal-output">
          src/auth.ts:42 [SECURITY-HIGH] SQL injection risk in query builder
        </div>
        <div className="terminal-output">
          src/utils.ts:18 [BUG-MEDIUM] Potential null pointer dereference
        </div>
        <div className="terminal-output">src/api.ts:91 [STYLE-LOW] Unused import statement</div>
      </div>
    </div>
  );
};

export default Terminal;
