/**
 * TUI (Terminal User Interface) reporter using Ink
 * Provides an interactive terminal interface for review results
 */

import React from 'react';
import { render, Box, Text } from 'ink';
import type { ReviewReport } from '../types/index.js';
import { formatDuration } from '../utils/index.js';

interface TUIReportProps {
  report: ReviewReport;
  verbose?: boolean;
  showRationale?: boolean;
}

const TUIReport: React.FC<TUIReportProps> = ({ report, verbose = false, showRationale = true }) => {
  const { summary, findings } = report;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'redBright';
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      case 'info': return 'gray';
      default: return 'white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return '🐛';
      case 'security': return '🔒';
      case 'performance': return '⚡';
      case 'style': return '🎨';
      case 'maintainability': return '🔧';
      case 'testing': return '🧪';
      case 'documentation': return '📚';
      default: return '📋';
    }
  };

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Header */}
      <Box borderStyle="double" borderColor="cyan" paddingX={2} paddingY={1} marginBottom={1}>
        <Text bold color="cyan">
          SieveAi Code Review Report
        </Text>
      </Box>

      {/* Summary */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="white">Summary:</Text>
        <Box paddingLeft={2}>
          <Box flexDirection="column">
            <Text>Total findings: <Text color="cyan">{summary.totalFindings}</Text></Text>
            <Text>Files reviewed: <Text color="cyan">{report.metadata.reviewedFiles}</Text></Text>
            <Text>Duration: <Text color="cyan">{formatDuration(report.metadata.duration)}</Text></Text>
          </Box>
        </Box>

        {summary.totalFindings > 0 && (
          <Box flexDirection="column" marginTop={1} paddingLeft={2}>
            <Text bold>By Severity:</Text>
            <Box paddingLeft={2}>
              {summary.bySeverity.critical > 0 && (
                <Text color="redBright">Critical: {summary.bySeverity.critical}</Text>
              )}
              {summary.bySeverity.high > 0 && (
                <Text color="red">High: {summary.bySeverity.high}</Text>
              )}
              {summary.bySeverity.medium > 0 && (
                <Text color="yellow">Medium: {summary.bySeverity.medium}</Text>
              )}
              {summary.bySeverity.low > 0 && (
                <Text color="blue">Low: {summary.bySeverity.low}</Text>
              )}
              {summary.bySeverity.info > 0 && (
                <Text color="gray">Info: {summary.bySeverity.info}</Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Findings */}
      {findings.length === 0 ? (
        <Box borderStyle="round" borderColor="green" paddingX={2} paddingY={1}>
          <Text color="green">No issues found!</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          <Text bold color="white">🔍 Findings:</Text>
          {findings.map((finding, index) => (
            <Box key={index} flexDirection="column" marginTop={1} paddingLeft={2}>
              <Box borderStyle="round" borderColor={getSeverityColor(finding.severity)} paddingX={2} paddingY={1}>
                <Box flexDirection="column">
                  <Box>
                    <Text color={getSeverityColor(finding.severity)}>
                      {getCategoryIcon(finding.category)} {finding.severity.toUpperCase()}
                    </Text>
                    <Text color="gray"> | </Text>
                    <Text color="white">{finding.category}</Text>
                    <Text color="gray"> | </Text>
                    <Text color="cyan">{finding.location.file}:{finding.location.line}</Text>
                  </Box>
                  
                  <Box marginTop={1}>
                    <Text bold>{finding.message}</Text>
                  </Box>

                  {showRationale && finding.rationale && (
                    <Box marginTop={1} paddingLeft={2}>
                      <Text color="gray" italic>💭 {finding.rationale}</Text>
                    </Box>
                  )}

                  {finding.suggestion && (
                    <Box marginTop={1} paddingLeft={2}>
                      <Text color="green">💡 Suggestion: {finding.suggestion}</Text>
                    </Box>
                  )}

                  {verbose && (
                    <Box marginTop={1} paddingLeft={2}>
                      <Text color="gray">
                        Confidence: {finding.confidence}% | 
                        Source: {finding.source}
                        {finding.agentName && ` | Agent: ${finding.agentName}`}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export function renderTUIReport(report: ReviewReport, options: { verbose?: boolean; showRationale?: boolean } = {}) {
  return render(
    <TUIReport 
      report={report} 
      verbose={options.verbose} 
      showRationale={options.showRationale} 
    />
  );
}