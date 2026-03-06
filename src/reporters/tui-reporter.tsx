/**
 * TUI (Terminal User Interface) reporter using Ink
 * Provides a clean, professional terminal interface for review results
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

  const getSeveritySymbol = (severity: string) => {
    switch (severity) {
      case 'critical': return '●';
      case 'high': return '●';
      case 'medium': return '●';
      case 'low': return '●';
      case 'info': return '●';
      default: return '●';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'bug': return 'BUG';
      case 'security': return 'SEC';
      case 'performance': return 'PERF';
      case 'style': return 'STYLE';
      case 'maintainability': return 'MAINT';
      case 'testing': return 'TEST';
      case 'documentation': return 'DOCS';
      default: return 'OTHER';
    }
  };

  return (
    <Box flexDirection="column" paddingX={0}>
      {/* Header */}
      <Box borderStyle="double" borderColor="cyan" paddingX={3} paddingY={1} marginBottom={1}>
        <Text bold color="cyan">
          SieveAi Code Review Report
        </Text>
      </Box>

      {/* Summary */}
      <Box flexDirection="column" marginBottom={2}>
        <Text bold color="white">SUMMARY</Text>
        <Box paddingLeft={2} marginTop={1}>
          <Box flexDirection="column">
            <Text>
              <Text color="gray">Total findings:</Text>
              <Text color="cyan"> {summary.totalFindings}</Text>
            </Text>
            <Text>
              <Text color="gray">Files reviewed:</Text>
              <Text color="cyan"> {report.metadata.reviewedFiles}</Text>
            </Text>
            <Text>
              <Text color="gray">Duration:</Text>
              <Text color="cyan"> {formatDuration(report.metadata.duration)}</Text>
            </Text>
          </Box>
        </Box>

        {summary.totalFindings > 0 && (
          <Box flexDirection="column" marginTop={1} paddingLeft={2}>
            <Text bold color="white">BY SEVERITY</Text>
            <Box paddingLeft={2} marginTop={1} flexDirection="column">
              {summary.bySeverity.critical > 0 && (
                <Text>
                  <Text color="redBright">● CRITICAL:</Text>
                  <Text color="white"> {summary.bySeverity.critical}</Text>
                </Text>
              )}
              {summary.bySeverity.high > 0 && (
                <Text>
                  <Text color="red">● HIGH:</Text>
                  <Text color="white"> {summary.bySeverity.high}</Text>
                </Text>
              )}
              {summary.bySeverity.medium > 0 && (
                <Text>
                  <Text color="yellow">● MEDIUM:</Text>
                  <Text color="white"> {summary.bySeverity.medium}</Text>
                </Text>
              )}
              {summary.bySeverity.low > 0 && (
                <Text>
                  <Text color="blue">● LOW:</Text>
                  <Text color="white"> {summary.bySeverity.low}</Text>
                </Text>
              )}
              {summary.bySeverity.info > 0 && (
                <Text>
                  <Text color="gray">● INFO:</Text>
                  <Text color="white"> {summary.bySeverity.info}</Text>
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Findings */}
      {findings.length === 0 ? (
        <Box borderStyle="round" borderColor="green" paddingX={3} paddingY={1}>
          <Text color="green" bold>✓ No issues found!</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          <Text bold color="white">FINDINGS</Text>
          {findings.map((finding, index) => (
            <Box key={index} flexDirection="column" marginTop={1} paddingLeft={0}>
              <Box borderStyle="round" borderColor={getSeverityColor(finding.severity)} paddingX={2} paddingY={1}>
                <Box flexDirection="column">
                  {/* Header line */}
                  <Box>
                    <Text color={getSeverityColor(finding.severity)}>
                      {getSeveritySymbol(finding.severity)} {finding.severity.toUpperCase()}
                    </Text>
                    <Text color="gray"> | </Text>
                    <Text color="white">{getCategoryLabel(finding.category)}</Text>
                    <Text color="gray"> | </Text>
                    <Text color="cyan">{finding.location.file}:{finding.location.line}</Text>
                  </Box>
                  
                  {/* Message */}
                  <Box marginTop={1}>
                    <Text bold color="white">{finding.message}</Text>
                  </Box>

                  {/* Rationale */}
                  {showRationale && finding.rationale && (
                    <Box marginTop={1} paddingLeft={2}>
                      <Text color="gray">
                        <Text color="gray">Reason: </Text>
                        <Text italic>{finding.rationale}</Text>
                      </Text>
                    </Box>
                  )}

                  {/* Suggestion */}
                  {finding.suggestion && (
                    <Box marginTop={1} paddingLeft={2}>
                      <Text color="green">
                        <Text color="green">Fix: </Text>
                        <Text>{finding.suggestion}</Text>
                      </Text>
                    </Box>
                  )}

                  {/* Verbose info */}
                  {verbose && (
                    <Box marginTop={1} paddingLeft={2}>
                      <Text color="gray">
                        <Text>Confidence: {finding.confidence}%</Text>
                        <Text> | Source: {finding.source}</Text>
                        {finding.agentName && <Text> | Agent: {finding.agentName}</Text>}
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