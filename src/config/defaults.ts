/**
 * Default configuration values
 */

import type { ReviewConfig } from './schema.js';

export const DEFAULT_CONFIG: Partial<ReviewConfig> = {
  model: 'ollama:glm-4.7',
  temperature: 0.7,
  maxTokens: 2048,
  minConfidence: 78,
  enableCache: true,
  parallel: true,
  maxConcurrency: 3,
  enableSecretScanning: true,
  enableSemgrep: false,
  format: 'text',
  verbose: false,
  showRationale: true,
  enableMemory: true,
  cachePath: '.sieveai/cache.db',
  workingDir: process.cwd(),
};
