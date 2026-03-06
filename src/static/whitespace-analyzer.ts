/**
 * Whitespace and formatting analyzer
 * Detects unnecessary changes in indentation, newlines, and formatting
 * Helps keep git diffs clean and focused on meaningful changes
 */

import type { ReviewFinding, FileDiff } from '../types/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('static:whitespace');

export interface WhitespaceOptions {
  detectIndentationChanges: boolean;
  detectUnnecessaryNewlines: boolean;
  detectTrailingWhitespace: boolean;
  detectMixedIndentation: boolean;
  maxConsecutiveBlankLines: number;
  indentationStyle: 'spaces' | 'tabs' | 'mixed' | 'auto';
  indentationSize: number;
}

const DEFAULT_OPTIONS: WhitespaceOptions = {
  detectIndentationChanges: true,
  detectUnnecessaryNewlines: true,
  detectTrailingWhitespace: true,
  detectMixedIndentation: true,
  maxConsecutiveBlankLines: 2,
  indentationStyle: 'auto',
  indentationSize: 2,
};

/**
 * Analyze whitespace and formatting issues in changed files
 */
export function analyzeWhitespace(files: FileDiff[], options: Partial<WhitespaceOptions> = {}): ReviewFinding[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const findings: ReviewFinding[] = [];

  for (const file of files) {
    if (file.type === 'delete') continue;

    logger.debug(`Analyzing whitespace for ${file.path}`);

    try {
      const analysis = analyzeFileWhitespace(file, opts);
      findings.push(...analysis);
    } catch (error) {
      logger.warn(`Failed to analyze whitespace for ${file.path}:`, error);
    }
  }

  return findings;
}

/**
 * Analyze whitespace issues in a single file
 */
function analyzeFileWhitespace(file: FileDiff, options: WhitespaceOptions): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  
  // Skip binary files and certain file types
  if (isBinaryFile(file.path)) {
    return findings;
  }

  for (const hunk of file.hunks) {
    const hunkFindings = analyzeHunkWhitespace(file, hunk, options);
    findings.push(...hunkFindings);
  }

  return findings;
}

/**
 * Analyze whitespace issues in a diff hunk
 */
function analyzeHunkWhitespace(file: FileDiff, hunk: any, options: WhitespaceOptions): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = hunk.content.split('\n');
  
  let currentLine = hunk.oldStart || 1;
  let consecutiveBlankLines = 0;
  let addedLines: string[] = [];
  let removedLines: string[] = [];
  let addedLineNumbers: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineType = line.charAt(0);
    const content = line.substring(1);

    // Track line numbers
    if (lineType === '+') {
      addedLines.push(content);
      addedLineNumbers.push(currentLine);
    } else if (lineType === '-') {
      removedLines.push(content);
    } else if (lineType === ' ') {
      currentLine++;
    }

    // Detect trailing whitespace in added lines
    if (lineType === '+' && options.detectTrailingWhitespace) {
      if (content.match(/\s+$/)) {
        findings.push({
          id: `whitespace-trailing-${file.path}-${currentLine}`,
          message: 'Trailing whitespace detected',
          location: { file: file.path, line: currentLine },
          severity: 'low',
          category: 'style',
          confidence: 95,
          rationale: 'Trailing whitespace can cause unnecessary diff noise and should be avoided.',
          suggestion: 'Remove trailing whitespace from the end of the line.',
          source: 'static',
          agentName: 'WhitespaceAnalyzer',
        });
      }
    }

    // Count consecutive blank lines in added content
    if (lineType === '+') {
      if (content.trim() === '') {
        consecutiveBlankLines++;
      } else {
        // Check if we exceeded the limit
        if (options.detectUnnecessaryNewlines && consecutiveBlankLines > options.maxConsecutiveBlankLines) {
          findings.push({
            id: `whitespace-blank-lines-${file.path}-${currentLine}`,
            message: `Excessive blank lines (${consecutiveBlankLines} lines)`,
            location: { file: file.path, line: currentLine - consecutiveBlankLines },
            severity: 'info',
            category: 'style',
            confidence: 85,
            rationale: `More than ${options.maxConsecutiveBlankLines} consecutive blank lines can make code harder to read and create unnecessary diff noise.`,
            suggestion: `Reduce to ${options.maxConsecutiveBlankLines} or fewer blank lines.`,
            source: 'static',
            agentName: 'WhitespaceAnalyzer',
          });
        }
        consecutiveBlankLines = 0;
      }
      currentLine++;
    }

    // Detect mixed indentation in added lines
    if (lineType === '+' && options.detectMixedIndentation) {
      const indentMatch = content.match(/^(\s+)/);
      if (indentMatch) {
        const indent = indentMatch[1];
        const hasSpaces = indent.includes(' ');
        const hasTabs = indent.includes('\t');
        
        if (hasSpaces && hasTabs) {
          findings.push({
            id: `whitespace-mixed-indent-${file.path}-${currentLine}`,
            message: 'Mixed spaces and tabs for indentation',
            location: { file: file.path, line: currentLine },
            severity: 'medium',
            category: 'style',
            confidence: 100,
            rationale: 'Mixed spaces and tabs can cause inconsistent display across different editors and tools.',
            suggestion: 'Use either spaces or tabs consistently for indentation.',
            source: 'static',
            agentName: 'WhitespaceAnalyzer',
          });
        }
      }
    }
  }

  // Analyze indentation changes between removed and added lines
  if (options.detectIndentationChanges && addedLines.length > 0 && removedLines.length > 0) {
    const indentChanges = detectIndentationChanges(file.path, removedLines, addedLines, addedLineNumbers, options);
    findings.push(...indentChanges);
  }

  return findings;
}

/**
 * Detect unnecessary indentation changes between old and new lines
 */
function detectIndentationChanges(
  filePath: string,
  removedLines: string[],
  addedLines: string[],
  addedLineNumbers: number[],
  options: WhitespaceOptions
): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  // Simple heuristic: if lines are similar but have different indentation
  for (let i = 0; i < Math.min(removedLines.length, addedLines.length); i++) {
    const oldLine = removedLines[i] || '';
    const newLine = addedLines[i] || '';
    const lineNumber = addedLineNumbers[i] || 1;

    const oldContent = oldLine.trim();
    const newContent = newLine.trim();

    // If content is the same but indentation differs
    if (oldContent === newContent && oldContent.length > 0) {
      const oldIndent = getIndentation(oldLine);
      const newIndent = getIndentation(newLine);

      if (oldIndent.length !== newIndent.length || oldIndent !== newIndent) {
        // Check if this is a meaningful indentation change
        const oldIndentSize = calculateIndentSize(oldIndent, options.indentationSize);
        const newIndentSize = calculateIndentSize(newIndent, options.indentationSize);

        // Only flag if the semantic indentation level seems unnecessary
        if (Math.abs(oldIndentSize - newIndentSize) > 0 && shouldFlagIndentChange(oldContent)) {
          findings.push({
            id: `whitespace-indent-change-${filePath}-${lineNumber}`,
            message: `Indentation changed without semantic reason`,
            location: { file: filePath, line: lineNumber },
            severity: 'low',
            category: 'style',
            confidence: 70,
            rationale: 'Changing indentation without changing code structure creates unnecessary diff noise and makes reviews harder.',
            suggestion: 'Keep original indentation if no structural change occurred.',
            source: 'static',
            agentName: 'WhitespaceAnalyzer',
          });
        }
      }
    }
  }

  return findings;
}

/**
 * Extract indentation from a line
 */
function getIndentation(line: string): string {
  const match = line.match(/^(\s*)/);
  return match?.[1] ?? '';
}

/**
 * Calculate semantic indentation size (convert tabs to spaces equivalent)
 */
function calculateIndentSize(indent: string, tabSize: number): number {
  let size = 0;
  for (const char of indent) {
    if (char === '\t') {
      size += tabSize;
    } else if (char === ' ') {
      size += 1;
    }
  }
  return size;
}

/**
 * Determine if an indentation change should be flagged
 * Skip certain lines where indentation changes might be legitimate
 */
function shouldFlagIndentChange(content: string): boolean {
  // Don't flag comments, empty lines, or certain keywords
  const trimmed = content.trim();
  
  if (trimmed === '' || 
      trimmed.startsWith('//') || 
      trimmed.startsWith('/*') || 
      trimmed.startsWith('*') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('<!--')) {
    return false;
  }

  // Don't flag certain control structures where indentation might legitimately change
  const controlKeywords = /^(if|else|for|while|switch|case|try|catch|finally|function|class|def)\s*[\(\{]/;
  if (controlKeywords.test(trimmed)) {
    return false;
  }

  return true;
}

/**
 * Check if file is binary and should be skipped
 */
function isBinaryFile(filePath: string): boolean {
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
    '.mp3', '.mp4', '.avi', '.mov', '.wav',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.tar', '.gz', '.7z',
    '.exe', '.dll', '.so', '.dylib',
    '.bin', '.dat', '.db', '.sqlite'
  ];

  const ext = filePath.toLowerCase().split('.').pop();
  return ext ? binaryExtensions.includes('.' + ext) : false;
}

/**
 * Detect inconsistent newline changes that might be unnecessary
 */
export function detectUnnecessaryNewlineChanges(file: FileDiff): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  for (const hunk of file.hunks) {
    const lines = hunk.content.split('\n');
    let addedBlankLines = 0;
    let removedBlankLines = 0;
    let currentLine = hunk.oldStart || 1;

    for (const line of lines) {
      const lineType = line.charAt(0);
      const content = line.substring(1);

      if (lineType === '+' && content.trim() === '') {
        addedBlankLines++;
        currentLine++;
      } else if (lineType === '-' && content.trim() === '') {
        removedBlankLines++;
      } else if (lineType === ' ') {
        currentLine++;
      }
    }

    // Flag if blank lines were just shuffled around
    if (addedBlankLines > 0 && removedBlankLines > 0 && 
        Math.abs(addedBlankLines - removedBlankLines) <= 2) {
      findings.push({
        id: `whitespace-newline-shuffle-${file.path}-${currentLine}`,
        message: 'Blank lines appear to be shuffled without clear purpose',
        location: { file: file.path, line: hunk.oldStart || 1 },
        severity: 'info',
        category: 'style',
        confidence: 60,
        rationale: 'Moving blank lines around without clear structural changes creates diff noise.',
        suggestion: 'Consider keeping original blank line placement unless improving code organization.',
        source: 'static',
        agentName: 'WhitespaceAnalyzer',
      });
    }
  }

  return findings;
}