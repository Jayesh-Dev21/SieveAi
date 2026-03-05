/**
 * Secret scanner - detect hardcoded secrets in code
 */

import type { ReviewFinding, FileDiff } from '../types/index.js';
import { createLogger } from '../utils/logger.js';
import { hashFinding } from '../utils/hash.js';
import { getAddedLines } from '../git/diff-parser.js';

const logger = createLogger('static:secrets');

// Common secret patterns
const SECRET_PATTERNS = [
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical' as const,
  },
  {
    name: 'Generic API Key',
    pattern: /['"]?api[_-]?key['"]?\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/ ,
    severity: 'high' as const,
    flags: 'gi',
  },
  {
    name: 'Generic Secret',
    pattern: /['"]?secret['"]?\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/ ,
    severity: 'high' as const,
    flags: 'gi',
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/g,
    severity: 'critical' as const,
  },
  {
    name: 'Generic Password',
    pattern: /['"]?password['"]?\s*[:=]\s*['"]([^'"]{8,})['"]/ ,
    severity: 'high' as const,
    flags: 'gi',
  },
  {
    name: 'JWT Token',
    pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    severity: 'high' as const,
  },
  {
    name: 'GitHub Token',
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    severity: 'critical' as const,
  },
  {
    name: 'Generic Token',
    pattern: /['"]?token['"]?\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/ ,
    severity: 'high' as const,
    flags: 'gi',
  },
];

// Files to skip (test files, examples, etc.)
const SKIP_FILES = [
  /\.test\.(ts|js|tsx|jsx)$/,
  /\.spec\.(ts|js|tsx|jsx)$/,
  /\.example\./,
  /\/test\//,
  /\/tests\//,
  /\/examples\//,
  /\/fixtures\//,
  /\/mocks\//,
];

/**
 * Scan files for hardcoded secrets
 */
export function scanSecrets(files: FileDiff[]): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  for (const file of files) {
    // Skip test files and examples
    if (SKIP_FILES.some((pattern) => pattern.test(file.path))) {
      continue;
    }

    // Only scan added lines
    const addedLines = getAddedLines(file);

    for (const { line, content } of addedLines) {
      for (const patternDef of SECRET_PATTERNS) {
        const { name, pattern, severity } = patternDef;
        const flags = 'flags' in patternDef ? patternDef.flags : undefined;
        
        // Create regex with flags if needed
        const regex = flags ? new RegExp(pattern.source, flags) : pattern;
        const matches = content.matchAll(regex);

        for (const match of matches) {
          const id = hashFinding(file.path, line, `Secret: ${name}`);

          findings.push({
            id,
            message: `Potential ${name} detected`,
            location: {
              file: file.path,
              line,
            },
            severity,
            category: 'security',
            confidence: 85,
            rationale: `Found pattern matching ${name}. Never commit secrets to version control.`,
            suggestion: 'Move this secret to environment variables or a secure vault.',
            source: 'static',
            metadata: {
              pattern: name,
              match: match[0]?.slice(0, 20) + '...', // Truncate for safety
            },
          });
        }
      }
    }
  }

  if (findings.length > 0) {
    logger.warn(`Found ${findings.length} potential secrets`);
  } else {
    logger.debug('No secrets detected');
  }

  return findings;
}
