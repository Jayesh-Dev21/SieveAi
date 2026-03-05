#!/usr/bin/env node

/**
 * SieveAi CLI - Main entry point
 */

import { Command } from 'commander';
import { checkCommand } from './commands/check.js';

const program = new Command();

program
  .name('sieveai')
  .description('Local-first AI code review CLI with hybrid static+AI analysis')
  .version('0.1.0');

// Check command
program
  .command('check')
  .description('Run code review on git diff')
  .option('--model <model>', 'LLM model to use (format: provider:model)', 'ollama:glm-4.7')
  .option('--min-confidence <number>', 'Minimum confidence threshold (0-100)', '78')
  .option('--format <format>', 'Output format (text, json, tui)', 'text')
  .option('--no-cache', 'Disable caching')
  .option('--no-parallel', 'Disable parallel agent execution')
  .option('--verbose', 'Enable verbose logging')
  .option('--base <ref>', 'Base git ref to compare against')
  .option('--target <ref>', 'Target git ref to compare')
  .option('--config <path>', 'Path to config file')
  .action(checkCommand);

// Parse command line
program.parse();
