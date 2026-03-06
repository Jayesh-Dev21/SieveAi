/**
 * Check command - main code review command
 */

import { loadConfig } from '../../config/loader.js';
import { createGitRepository } from '../../git/repository.js';
import { ReviewOrchestrator } from '../../orchestrator/orchestrator.js';
import { formatTextReport } from '../../reporters/text-reporter.js';
import { formatJsonReport } from '../../reporters/json-reporter.js';
import { renderTUIReport } from '../../reporters/tui-reporter.js';
import ora from 'ora';

interface CheckOptions {
  model?: string;
  minConfidence?: string;
  format?: string;
  cache?: boolean;
  parallel?: boolean;
  verbose?: boolean;
  base?: string;
  target?: string;
  config?: string;
}

/**
 * Check command handler
 */
export async function checkCommand(options: CheckOptions): Promise<void> {
  const spinner = ora('Initializing...').start();

  try {
    // Load configuration
    const config = await loadConfig({
      configPath: options.config,
      overrides: {
        model: options.model,
        minConfidence: options.minConfidence ? Number.parseInt(options.minConfidence, 10) : undefined,
        format: options.format as 'text' | 'json' | 'tui' | undefined,
        enableCache: options.cache,
        parallel: options.parallel,
        verbose: options.verbose,
      },
    });

    spinner.text = 'Checking git repository...';

    // Initialize git repository
    const git = createGitRepository(config.workingDir);

    const isRepo = await git.isRepository();
    if (!isRepo) {
      spinner.fail('Not a git repository');
      process.exit(1);
    }

    // Get current commit and branch
    const commitSha = await git.getCurrentCommit();
    const branch = await git.getCurrentBranch();

    spinner.text = 'Getting diff...';

    // Get diff
    const diff = await git.getDiff({
      base: options.base,
      target: options.target,
    });

    if (diff.length === 0) {
      spinner.succeed('No changes to review');
      return;
    }

    spinner.succeed(`Found changes in ${diff.length} files`);

    // Run review
    spinner.start('Running code review...');

    const orchestrator = new ReviewOrchestrator({
      config,
      commitSha,
      branch,
    });

    const report = await orchestrator.review(diff);

    orchestrator.close();

    spinner.succeed('Review complete');

    // Output report
    console.log('');

    if (config.format === 'json') {
      console.log(formatJsonReport(report));
    } else if (config.format === 'tui') {
      renderTUIReport(report, {
        verbose: config.verbose,
        showRationale: config.showRationale,
      });
    } else {
      console.log(
        formatTextReport(report, {
          verbose: config.verbose,
          showRationale: config.showRationale,
        }),
      );
    }

    // Exit with error code if critical/high issues found
    const hasHighSeverity =
      report.summary.bySeverity.critical > 0 ||
      report.summary.bySeverity.high > 0;

    if (hasHighSeverity) {
      process.exit(1);
    }
  } catch (error) {
    spinner.fail('Review failed');
    console.error('✖ Error:');
    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
