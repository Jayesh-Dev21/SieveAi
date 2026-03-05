import debug from 'debug';
import chalk from 'chalk';

/**
 * Structured logger with debug support
 * Uses 'debug' package for development, chalk for production
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  namespace: string;
  enabled?: boolean;
  verbose?: boolean;
}

export class Logger {
  private debugLogger: debug.Debugger;
  private namespace: string;
  private verbose: boolean;

  constructor(options: LoggerOptions) {
    this.namespace = options.namespace;
    this.verbose = options.verbose ?? false;
    this.debugLogger = debug(`sieveai:${options.namespace}`);

    if (options.enabled) {
      debug.enable(`sieveai:${options.namespace}`);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.debugLogger(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    if (this.verbose) {
      console.log(chalk.blue('ℹ'), message, ...args);
    }
  }

  success(message: string, ...args: unknown[]): void {
    console.log(chalk.green('✓'), message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(chalk.yellow('⚠'), message, ...args);
  }

  error(message: string, error?: unknown): void {
    console.error(chalk.red('✖'), message);
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
      if (this.verbose && error.stack) {
        console.error(chalk.gray(error.stack));
      }
    } else if (error) {
      console.error(chalk.red(String(error)));
    }
  }

  /**
   * Create a child logger with a sub-namespace
   */
  child(subNamespace: string): Logger {
    return new Logger({
      namespace: `${this.namespace}:${subNamespace}`,
      enabled: this.debugLogger.enabled,
      verbose: this.verbose,
    });
  }
}

/**
 * Global logger instance factory
 */
export function createLogger(namespace: string, verbose = false): Logger {
  return new Logger({ namespace, verbose });
}

/**
 * Default logger for CLI usage
 */
export const logger = createLogger('cli');
