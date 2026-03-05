import { createHash } from 'node:crypto';

/**
 * Hashing utilities for content integrity and caching
 */

/**
 * Generate SHA-256 hash of content
 */
export function sha256(content: string | Buffer): string {
  return createHash('sha256')
    .update(content)
    .digest('hex');
}

/**
 * Generate a deterministic hash for a code location + message
 * Used for finding IDs and memory indexing
 */
export function hashFinding(
  file: string,
  line: number,
  message: string,
): string {
  const content = `${file}:${line}:${message}`;
  return sha256(content).slice(0, 16); // 16 chars = 64 bits
}

/**
 * Generate a cache key from commit SHA and file info
 */
export function hashCacheKey(
  commitSha: string,
  filePath: string,
  contentHash: string,
): string {
  return sha256(`${commitSha}:${filePath}:${contentHash}`);
}

/**
 * Hash multiple values into a single deterministic string
 */
export function hashValues(...values: (string | number | boolean)[]): string {
  const combined = values.map(String).join(':');
  return sha256(combined);
}
