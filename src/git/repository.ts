/**
 * Git repository operations using simple-git
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import type { FileDiff } from '../types/index.js';
import { GitError } from '../types/index.js';
import { createLogger } from '../utils/logger.js';
import { parseDiff } from './diff-parser.js';

const logger = createLogger('git');

export interface GitRepositoryOptions {
  workingDir: string;
}

/**
 * Git repository wrapper
 */
export class GitRepository {
  private git: SimpleGit;

  constructor(options: GitRepositoryOptions) {
    this.git = simpleGit(options.workingDir);

    logger.debug('Initialized git repository:', options.workingDir);
  }

  /**
   * Check if directory is a git repository
   */
  async isRepository(): Promise<boolean> {
    try {
      await this.git.revparse(['--git-dir']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    try {
      const branch = await this.git.revparse(['--abbrev-ref', 'HEAD']);
      return branch.trim();
    } catch (error) {
      throw new GitError('Failed to get current branch', { error });
    }
  }

  /**
   * Get current commit SHA
   */
  async getCurrentCommit(): Promise<string> {
    try {
      const sha = await this.git.revparse(['HEAD']);
      return sha.trim();
    } catch (error) {
      throw new GitError('Failed to get current commit', { error });
    }
  }

  /**
   * Get repository root directory
   */
  async getRoot(): Promise<string> {
    try {
      const root = await this.git.revparse(['--show-toplevel']);
      return root.trim();
    } catch (error) {
      throw new GitError('Failed to get repository root', { error });
    }
  }

  /**
   * Get diff between commits/branches
   */
  async getDiff(options: {
    base?: string; // Base commit/branch (default: HEAD)
    target?: string; // Target commit/branch (default: working tree)
    files?: string[]; // Specific files to diff
  } = {}): Promise<FileDiff[]> {
    try {
      const args: string[] = ['--unified=3']; // 3 lines of context

      if (options.base && options.target) {
        args.push(options.base, options.target);
      } else if (options.base) {
        args.push(options.base);
      } else {
        // Default: staged + unstaged changes
        args.push('HEAD');
      }

      if (options.files && options.files.length > 0) {
        args.push('--', ...options.files);
      }

      logger.debug('Getting diff:', args);

      const diffText = await this.git.diff(args);

      if (!diffText) {
        logger.debug('No changes detected');
        return [];
      }

      logger.debug('Diff size:', diffText.length, 'bytes');

      // Parse the diff output
      return parseDiff(diffText);
    } catch (error) {
      throw new GitError('Failed to get diff', { error });
    }
  }

  /**
   * Get diff for staged changes only
   */
  async getStagedDiff(): Promise<FileDiff[]> {
    try {
      const diffText = await this.git.diff(['--cached', '--unified=3']);

      if (!diffText) {
        return [];
      }

      return parseDiff(diffText);
    } catch (error) {
      throw new GitError('Failed to get staged diff', { error });
    }
  }

  /**
   * Get diff for unstaged changes
   */
  async getUnstagedDiff(): Promise<FileDiff[]> {
    try {
      const diffText = await this.git.diff(['--unified=3']);

      if (!diffText) {
        return [];
      }

      return parseDiff(diffText);
    } catch (error) {
      throw new GitError('Failed to get unstaged diff', { error });
    }
  }

  /**
   * Get list of changed files
   */
  async getChangedFiles(options: {
    base?: string;
    target?: string;
  } = {}): Promise<string[]> {
    try {
      const args: string[] = ['--name-only'];

      if (options.base && options.target) {
        args.push(options.base, options.target);
      } else if (options.base) {
        args.push(options.base);
      } else {
        args.push('HEAD');
      }

      const diffResult = await this.git.diff(args);
      const output = typeof diffResult === 'string' ? diffResult : '';

      return output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    } catch (error) {
      throw new GitError('Failed to get changed files', { error });
    }
  }

  /**
   * Get file content at specific commit
   */
  async getFileContent(filePath: string, commit = 'HEAD'): Promise<string> {
    try {
      return await this.git.show([`${commit}:${filePath}`]);
    } catch (error) {
      throw new GitError(`Failed to get file content: ${filePath}`, { error });
    }
  }

  /**
   * Check if there are uncommitted changes
   */
  async hasUncommittedChanges(): Promise<boolean> {
    try {
      const status = await this.git.status();
      return status.files.length > 0;
    } catch (error) {
      throw new GitError('Failed to check git status', { error });
    }
  }

  /**
   * Get remote URL
   */
  async getRemoteUrl(remote = 'origin'): Promise<string | null> {
    try {
      const remotes = await this.git.getRemotes(true);
      const origin = remotes.find((r) => r.name === remote);
      return origin?.refs.fetch ?? null;
    } catch (error) {
      logger.debug('Failed to get remote URL:', error);
      return null;
    }
  }
}

/**
 * Create a git repository instance
 */
export function createGitRepository(workingDir: string): GitRepository {
  return new GitRepository({ workingDir });
}
