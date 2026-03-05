/**
 * Text reporter - format findings for terminal output
 */

import type { ReviewReport, ReviewFinding } from '../types/index.js';
import chalk from 'chalk';
import { formatDuration } from '../utils/index.js';

/**
 * Format report as human-readable text
 */
export function formatTextReport(
  report: ReviewReport,
  options: { verbose?: boolean; showRationale?: boolean } = {},
): string {
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push(chalk.bold('='.repeat(80)));
  lines.push(chalk.bold.cyan('  SieveAi Code Review Report'));
  lines.push(chalk.bold('='.repeat(80)));
  lines.push('');

  // Summary
  lines.push(chalk.bold('Summary:'));
  lines.push(`  Total findings: ${chalk.yellow(report.summary.totalFindings)}`);
  lines.push(`  Files reviewed: ${report.metadata.reviewedFiles}`);
  lines.push(`  Duration: ${formatDuration(report.metadata.duration)}`);
  lines.push('');

  // Findings by severity
  if (report.summary.totalFindings > 0) {
    lines.push(chalk.bold('By Severity:'));
    const { bySeverity } = report.summary;
    if (bySeverity.critical > 0) {
      lines.push(`  ${chalk.red('●')} Critical: ${bySeverity.critical}`);
    }
    if (bySeverity.high > 0) {
      lines.push(`  ${chalk.red('●')} High: ${bySeverity.high}`);
    }
    if (bySeverity.medium > 0) {
      lines.push(`  ${chalk.yellow('●')} Medium: ${bySeverity.medium}`);
    }
    if (bySeverity.low > 0) {
      lines.push(`  ${chalk.blue('●')} Low: ${bySeverity.low}`);
    }
    if (bySeverity.info > 0) {
      lines.push(`  ${chalk.gray('●')} Info: ${bySeverity.info}`);
    }
    lines.push('');

    // Source breakdown
    lines.push(chalk.bold('By Source:'));
    lines.push(`  Static analysis: ${report.summary.bySource.static}`);
    lines.push(`  AI analysis: ${report.summary.bySource.ai}`);
    lines.push('');
  }

  // Detailed findings
  if (report.findings.length === 0) {
    lines.push(chalk.green.bold('✓ No issues found!'));
    lines.push('');
  } else {
    lines.push(chalk.bold('Findings:'));
    lines.push('');

    // Group by file
    const byFile = groupBy(report.findings, (f) => f.location.file);

    for (const [file, findings] of Object.entries(byFile)) {
      lines.push(chalk.bold.underline(file));
      lines.push('');

      // Sort by line number
      const sorted = findings.sort((a, b) => a.location.line - b.location.line);

      for (const finding of sorted) {
        lines.push(formatFinding(finding, options));
        lines.push('');
      }
    }
  }

  lines.push(chalk.bold('='.repeat(80)));
  lines.push('');

  return lines.join('\n');
}

/**
 * Format a single finding
 */
function formatFinding(
  finding: ReviewFinding,
  options: { verbose?: boolean; showRationale?: boolean } = {},
): string {
  const lines: string[] = [];

  // Severity icon and message
  const icon = getSeverityIcon(finding.severity);
  const severityColor = getSeverityColor(finding.severity);
  const location = `${finding.location.file}:${finding.location.line}`;

  lines.push(
    `${icon} ${severityColor(finding.severity.toUpperCase())} at ${chalk.cyan(location)}`,
  );
  lines.push(`  ${chalk.bold(finding.message)}`);

  // Confidence and category
  const meta = [
    `confidence: ${finding.confidence}%`,
    `category: ${finding.category}`,
    `source: ${finding.source}`,
  ];
  if (finding.agentName) {
    meta.push(`agent: ${finding.agentName}`);
  }
  lines.push(`  ${chalk.gray(meta.join(' | '))}`);

  // Rationale
  if (options.showRationale && finding.rationale) {
    lines.push('');
    lines.push(chalk.gray(`  Rationale: ${finding.rationale}`));
  }

  // Suggestion
  if (finding.suggestion) {
    lines.push('');
    lines.push(chalk.green(`  Suggestion: ${finding.suggestion}`));
  }

  return lines.join('\n');
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical':
      return chalk.red('✖');
    case 'high':
      return chalk.red('●');
    case 'medium':
      return chalk.yellow('●');
    case 'low':
      return chalk.blue('●');
    case 'info':
      return chalk.gray('○');
    default:
      return '●';
  }
}

/**
 * Get severity color function
 */
function getSeverityColor(severity: string): (text: string) => string {
  switch (severity) {
    case 'critical':
    case 'high':
      return chalk.red;
    case 'medium':
      return chalk.yellow;
    case 'low':
      return chalk.blue;
    case 'info':
      return chalk.gray;
    default:
      return (text: string) => text;
  }
}

/**
 * Group array by key
 */
function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of array) {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key]?.push(item);
  }
  return result;
}
