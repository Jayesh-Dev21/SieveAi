/**
 * Configuration schema using Zod
 */

import { z } from 'zod';

export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);
export const CategorySchema = z.enum([
  'bug',
  'security',
  'performance',
  'style',
  'maintainability',
  'testing',
  'documentation',
]);
export const FormatSchema = z.enum(['text', 'json', 'tui']);

export const ReviewConfigSchema = z.object({
  // Model settings
  model: z.string().default('ollama:glm-4.7'),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),

  // Filtering
  minConfidence: z.number().min(0).max(100).default(78),
  severityFilter: z.array(SeveritySchema).optional(),
  categoryFilter: z.array(CategorySchema).optional(),

  // Performance
  enableCache: z.boolean().default(true),
  parallel: z.boolean().default(true),
  maxConcurrency: z.number().positive().default(3).optional(),

  // Static analysis
  enableSecretScanning: z.boolean().default(true),
  enableSemgrep: z.boolean().default(false),
  semgrepRules: z.array(z.string()).optional(),

  // Output
  format: FormatSchema.default('tui'),
  verbose: z.boolean().default(false),
  showRationale: z.boolean().default(true),

  // Memory/Learning
  enableMemory: z.boolean().default(true),
  memoryPath: z.string().optional(),

  // Paths
  cachePath: z.string().default('.sieveai/cache.db'),
  workingDir: z.string().default(process.cwd()),
});

export type ReviewConfig = z.infer<typeof ReviewConfigSchema>;
