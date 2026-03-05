/**
 * Git diff parser
 * Parses unified diff format into structured data
 */

import type { FileDiff, DiffHunk } from '../types/index.js';
import { sha256 } from '../utils/hash.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('git:parser');

/**
 * Parse unified diff output into structured FileDiff objects
 */
export function parseDiff(diffText: string): FileDiff[] {
  const lines = diffText.split('\n');
  const files: FileDiff[] = [];
  let currentFile: FileDiff | null = null;
  let currentHunk: DiffHunk | null = null;
  let hunkLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';

    // File header: diff --git a/file b/file
    if (line.startsWith('diff --git ')) {
      // Save previous file if exists
      if (currentFile && currentHunk) {
        currentHunk.content = hunkLines.join('\n');
        currentFile.hunks.push(currentHunk);
      }
      if (currentFile) {
        files.push(currentFile);
      }

      // Parse file paths
      const match = line.match(/diff --git a\/(.+?) b\/(.+)/);
      if (match) {
        const oldPath = match[1] ?? '';
        const newPath = match[2] ?? '';

        currentFile = {
          path: newPath,
          oldPath: oldPath !== newPath ? oldPath : undefined,
          type: 'modify',
          hunks: [],
          hash: '', // Will be set later
        };
        currentHunk = null;
        hunkLines = [];
      }
    }
    // New file mode
    else if (line.startsWith('new file mode')) {
      if (currentFile) {
        currentFile.type = 'add';
      }
    }
    // Deleted file mode
    else if (line.startsWith('deleted file mode')) {
      if (currentFile) {
        currentFile.type = 'delete';
      }
    }
    // Rename from/to
    else if (line.startsWith('rename from')) {
      if (currentFile) {
        currentFile.type = 'rename';
      }
    }
    // Hunk header: @@ -10,7 +10,8 @@
    else if (line.startsWith('@@')) {
      // Save previous hunk if exists
      if (currentFile && currentHunk) {
        currentHunk.content = hunkLines.join('\n');
        currentFile.hunks.push(currentHunk);
      }

      const match = line.match(/@@ -(\d+),?(\d+)? \+(\d+),?(\d+)? @@(.*)/);
      if (match) {
        currentHunk = {
          oldStart: Number.parseInt(match[1] ?? '0', 10),
          oldLines: Number.parseInt(match[2] ?? '1', 10),
          newStart: Number.parseInt(match[3] ?? '0', 10),
          newLines: Number.parseInt(match[4] ?? '1', 10),
          header: match[5]?.trim() ?? '',
          content: '',
        };
        hunkLines = [];
      }
    }
    // Hunk content
    else if (currentHunk && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
      hunkLines.push(line);
    }
  }

  // Save last hunk and file
  if (currentFile && currentHunk) {
    currentHunk.content = hunkLines.join('\n');
    currentFile.hunks.push(currentHunk);
  }
  if (currentFile) {
    files.push(currentFile);
  }

  // Calculate hashes
  for (const file of files) {
    file.hash = sha256(JSON.stringify(file.hunks));
  }

  logger.debug(`Parsed ${files.length} files from diff`);

  return files;
}

/**
 * Extract added lines from a file diff
 */
export function getAddedLines(file: FileDiff): Array<{
  line: number;
  content: string;
}> {
  const added: Array<{ line: number; content: string }> = [];

  for (const hunk of file.hunks) {
    const lines = hunk.content.split('\n');
    let lineNumber = hunk.newStart;

    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        added.push({
          line: lineNumber,
          content: line.slice(1), // Remove '+'
        });
        lineNumber++;
      } else if (!line.startsWith('-')) {
        lineNumber++;
      }
    }
  }

  return added;
}

/**
 * Extract removed lines from a file diff
 */
export function getRemovedLines(file: FileDiff): Array<{
  line: number;
  content: string;
}> {
  const removed: Array<{ line: number; content: string }> = [];

  for (const hunk of file.hunks) {
    const lines = hunk.content.split('\n');
    let lineNumber = hunk.oldStart;

    for (const line of lines) {
      if (line.startsWith('-') && !line.startsWith('---')) {
        removed.push({
          line: lineNumber,
          content: line.slice(1), // Remove '-'
        });
        lineNumber++;
      } else if (!line.startsWith('+')) {
        lineNumber++;
      }
    }
  }

  return removed;
}

/**
 * Extract modified lines (both added and removed)
 */
export function getModifiedLines(file: FileDiff): {
  added: Array<{ line: number; content: string }>;
  removed: Array<{ line: number; content: string }>;
} {
  return {
    added: getAddedLines(file),
    removed: getRemovedLines(file),
  };
}

/**
 * Get context around a specific line in a hunk
 */
export function getLineContext(
  hunk: DiffHunk,
  targetLine: number,
  contextLines = 3,
): string[] {
  const lines = hunk.content.split('\n');
  const result: string[] = [];
  let currentLine = hunk.newStart;

  // Find the target line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';

    if (!line.startsWith('-')) {
      if (Math.abs(currentLine - targetLine) <= contextLines) {
        result.push(line);
      }
      currentLine++;
    } else {
      // Include removed lines in context too
      if (Math.abs(currentLine - targetLine) <= contextLines) {
        result.push(line);
      }
    }
  }

  return result;
}
