/**
 * Configuration loader
 * Loads config from file, environment, and CLI args
 */

import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { ConfigError } from '../types/index.js';
import { ReviewConfigSchema, type ReviewConfig } from './schema.js';
import { DEFAULT_CONFIG } from './defaults.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('config');

export interface ConfigLoaderOptions {
  workingDir?: string;
  configPath?: string;
  overrides?: Partial<ReviewConfig>;
}

/**
 * Load configuration from multiple sources
 */
export async function loadConfig(
  options: ConfigLoaderOptions = {},
): Promise<ReviewConfig> {
  const workingDir = options.workingDir ?? process.cwd();

  // Start with defaults
  let config: Partial<ReviewConfig> = { ...DEFAULT_CONFIG };

  // Try to load from config file
  const configPath =
    options.configPath ?? (await findConfigFile(workingDir));

  if (configPath) {
    try {
      const fileConfig = await loadConfigFile(configPath);
      config = { ...config, ...fileConfig };
      logger.debug('Loaded config from:', configPath);
    } catch (error) {
      logger.warn('Failed to load config file:', configPath, error);
    }
  }

  // Apply overrides (from CLI args)
  if (options.overrides) {
    config = { ...config, ...options.overrides };
  }

  // Validate final config
  try {
    const validated = ReviewConfigSchema.parse(config);
    logger.debug('Config validated successfully');
    return validated;
  } catch (error) {
    throw new ConfigError('Invalid configuration', { error });
  }
}

/**
 * Find config file in directory tree
 */
async function findConfigFile(startDir: string): Promise<string | null> {
  const configNames = [
    '.sieveai.config.json',
    '.sieveai.json',
    'sieveai.config.json',
  ];

  let currentDir = resolve(startDir);
  const root = '/';

  while (currentDir !== root) {
    for (const name of configNames) {
      const configPath = join(currentDir, name);
      try {
        await readFile(configPath, 'utf-8');
        return configPath;
      } catch {
        // File doesn't exist, continue
      }
    }

    // Move up one directory
    const parentDir = resolve(currentDir, '..');
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return null;
}

/**
 * Load config from JSON file
 */
async function loadConfigFile(
  path: string,
): Promise<Partial<ReviewConfig>> {
  try {
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content) as Partial<ReviewConfig>;
  } catch (error) {
    throw new ConfigError(`Failed to parse config file: ${path}`, { error });
  }
}

/**
 * Get cache directory path
 */
export function getCacheDir(config: ReviewConfig): string {
  return resolve(config.workingDir, '.sieveai');
}

/**
 * Get cache database path
 */
export function getCachePath(config: ReviewConfig): string {
  return resolve(config.workingDir, config.cachePath);
}

/**
 * Get memory database path
 */
export function getMemoryPath(config: ReviewConfig): string {
  return config.memoryPath ?? resolve(config.workingDir, '.sieveai/memory.json');
}
