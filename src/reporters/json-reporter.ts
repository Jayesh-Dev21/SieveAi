/**
 * JSON reporter - format findings as JSON
 */

import type { ReviewReport } from '../types/index.js';

/**
 * Format report as JSON
 */
export function formatJsonReport(
  report: ReviewReport,
  pretty = true,
): string {
  return JSON.stringify(report, null, pretty ? 2 : undefined);
}
