/**
 * Multi-language spell checker
 * Checks for spelling mistakes in comments, strings, and documentation
 */

import type { ReviewFinding, FileDiff } from '../types/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('static:spell');

// Common English dictionary words (basic set for demonstration)
const DICTIONARY = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
  'because', 'any', 'these', 'give', 'day', 'most', 'us',
  // Programming terms
  'function', 'variable', 'parameter', 'argument', 'return', 'class', 'method', 'property', 'object', 'array', 'string', 'number', 'boolean',
  'null', 'undefined', 'true', 'false', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
  'import', 'export', 'module', 'package', 'library', 'framework', 'api', 'http', 'https', 'json', 'xml', 'html', 'css', 'javascript',
  'typescript', 'python', 'java', 'cpp', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'database', 'query', 'server', 'client',
  'config', 'configuration', 'initialize', 'implement', 'execute', 'compile', 'debug', 'test', 'unit', 'integration', 'deployment',
  'version', 'release', 'build', 'bundle', 'webpack', 'babel', 'eslint', 'prettier', 'git', 'commit', 'branch', 'merge', 'pull', 'push',
  'repository', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'microservice', 'container',
  'async', 'await', 'promise', 'callback', 'event', 'listener', 'handler', 'middleware', 'router', 'endpoint', 'authentication',
  'authorization', 'token', 'session', 'cookie', 'header', 'request', 'response', 'status', 'error', 'exception', 'try', 'catch',
  'finally', 'throw', 'interface', 'type', 'generic', 'template', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction'
]);

// Common programming misspellings
const COMMON_TYPOS = new Map([
  ['lenght', 'length'],
  ['wdith', 'width'],
  ['heigth', 'height'],
  ['recieve', 'receive'],
  ['seperate', 'separate'],
  ['occured', 'occurred'],
  ['neccessary', 'necessary'],
  ['begining', 'beginning'],
  ['existance', 'existence'],
  ['definately', 'definitely'],
  ['independant', 'independent'],
  ['occassion', 'occasion'],
  ['refered', 'referred'],
  ['sucess', 'success'],
  ['occurence', 'occurrence'],
  ['accomodate', 'accommodate'],
  ['arguement', 'argument'],
  ['catagory', 'category'],
  ['cemetary', 'cemetery'],
  ['changeable', 'changeable'],
  ['concious', 'conscious'],
  ['definate', 'definite'],
  ['enviroment', 'environment'],
  ['goverment', 'government'],
  ['independance', 'independence'],
  ['maintainance', 'maintenance'],
  ['occassionally', 'occasionally'],
  ['priviledge', 'privilege'],
  ['publically', 'publicly'],
  ['recomend', 'recommend'],
  ['writting', 'writing']
]);

/**
 * Check for spelling mistakes in code files
 */
export function checkSpelling(files: FileDiff[]): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  for (const file of files) {
    logger.debug(`Checking spelling for ${file.path}`);

    try {
      // Get the new content from hunks
      const newContent = getNewFileContent(file);
      
      if (!newContent) {
        continue; // File was deleted or no content
      }

      // Check spelling based on file type
      const errors = checkFileSpelling(newContent, file.path);
      findings.push(...errors);
      
    } catch (error) {
      logger.warn(`Failed to check spelling for ${file.path}:`, error);
    }
  }

  return findings;
}

/**
 * Extract new file content from diff hunks
 */
function getNewFileContent(file: FileDiff): string | null {
  if (file.type === 'delete') {
    return null;
  }

  const lines: string[] = [];
  
  for (const hunk of file.hunks) {
    const hunkLines = hunk.content.split('\n');
    for (const line of hunkLines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        // Add line (remove + prefix)
        lines.push(line.substring(1));
      } else if (line.startsWith(' ')) {
        // Context line (remove space prefix)
        lines.push(line.substring(1));
      }
      // Skip deleted lines (-)
    }
  }

  return lines.join('\n');
}

/**
 * Check spelling in file based on file type
 */
function checkFileSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const ext = filePath.toLowerCase();

  if (ext.endsWith('.js') || ext.endsWith('.jsx') || ext.endsWith('.ts') || ext.endsWith('.tsx')) {
    findings.push(...checkJavaScriptSpelling(content, filePath));
  } else if (ext.endsWith('.py')) {
    findings.push(...checkPythonSpelling(content, filePath));
  } else if (ext.endsWith('.java')) {
    findings.push(...checkJavaSpelling(content, filePath));
  } else if (ext.endsWith('.cpp') || ext.endsWith('.c') || ext.endsWith('.h') || ext.endsWith('.hpp')) {
    findings.push(...checkCppSpelling(content, filePath));
  } else if (ext.endsWith('.go')) {
    findings.push(...checkGoSpelling(content, filePath));
  } else if (ext.endsWith('.rs')) {
    findings.push(...checkRustSpelling(content, filePath));
  } else if (ext.endsWith('.php')) {
    findings.push(...checkPhpSpelling(content, filePath));
  } else if (ext.endsWith('.rb')) {
    findings.push(...checkRubySpelling(content, filePath));
  } else if (ext.endsWith('.md') || ext.endsWith('.markdown')) {
    findings.push(...checkMarkdownSpelling(content, filePath));
  } else if (ext.endsWith('.html') || ext.endsWith('.htm')) {
    findings.push(...checkHtmlSpelling(content, filePath));
  }

  return findings;
}

/**
 * Check spelling in JavaScript/TypeScript comments and strings
 */
function checkJavaScriptSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Check single-line comments
    const singleComment = line.match(/\/\/\s*(.+)$/);
    if (singleComment) {
      const commentText = singleComment[1] || '';
      findings.push(...checkTextSpelling(commentText, filePath, lineNumber));
    }

    // Check multi-line comments (simple check for /** */ on same line)
    const multiComment = line.match(/\/\*\*?\s*(.+?)\s*\*\//);
    if (multiComment) {
      const commentText = multiComment[1] || '';
      findings.push(...checkTextSpelling(commentText, filePath, lineNumber));
    }

    // Check string literals
    const strings = line.match(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"/g) || [];
    for (const str of strings) {
      const stringContent = str.slice(1, -1); // Remove quotes
      if (stringContent.length > 3 && !stringContent.match(/^[A-Z_][A-Z0-9_]*$/)) { // Skip constants
        findings.push(...checkTextSpelling(stringContent, filePath, lineNumber));
      }
    }
  }

  return findings;
}

/**
 * Check spelling in Python comments and strings
 */
function checkPythonSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Check comments
    const comment = line.match(/#\s*(.+)$/);
    if (comment) {
      const commentText = comment[1] || '';
      findings.push(...checkTextSpelling(commentText, filePath, lineNumber));
    }

    // Check string literals
    const strings = line.match(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"|'([^'\\\\]*(\\\\.[^'\\\\]*)*)'/g) || [];
    for (const str of strings) {
      const stringContent = str.slice(1, -1); // Remove quotes
      if (stringContent.length > 3) {
        findings.push(...checkTextSpelling(stringContent, filePath, lineNumber));
      }
    }
  }

  return findings;
}

/**
 * Check spelling in Java comments and strings
 */
function checkJavaSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Check single-line comments
    const singleComment = line.match(/\/\/\s*(.+)$/);
    if (singleComment) {
      const commentText = singleComment[1] || '';
      findings.push(...checkTextSpelling(commentText, filePath, lineNumber));
    }

    // Check string literals
    const strings = line.match(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"/g) || [];
    for (const str of strings) {
      const stringContent = str.slice(1, -1); // Remove quotes
      if (stringContent.length > 3) {
        findings.push(...checkTextSpelling(stringContent, filePath, lineNumber));
      }
    }
  }

  return findings;
}

/**
 * Check spelling in C++ comments and strings
 */
function checkCppSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Check single-line comments
    const singleComment = line.match(/\/\/\s*(.+)$/);
    if (singleComment) {
      const commentText = singleComment[1] || '';
      findings.push(...checkTextSpelling(commentText, filePath, lineNumber));
    }

    // Check string literals
    const strings = line.match(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"/g) || [];
    for (const str of strings) {
      const stringContent = str.slice(1, -1); // Remove quotes
      if (stringContent.length > 3) {
        findings.push(...checkTextSpelling(stringContent, filePath, lineNumber));
      }
    }
  }

  return findings;
}

/**
 * Basic spell checking implementations for other languages
 */
function checkGoSpelling(content: string, filePath: string): ReviewFinding[] {
  return checkCommentAndStringSpelling(content, filePath, /\/\/\s*(.+)$/);
}

function checkRustSpelling(content: string, filePath: string): ReviewFinding[] {
  return checkCommentAndStringSpelling(content, filePath, /\/\/\s*(.+)$/);
}

function checkPhpSpelling(content: string, filePath: string): ReviewFinding[] {
  return checkCommentAndStringSpelling(content, filePath, /\/\/\s*(.+)$|#\s*(.+)$/);
}

function checkRubySpelling(content: string, filePath: string): ReviewFinding[] {
  return checkCommentAndStringSpelling(content, filePath, /#\s*(.+)$/);
}

function checkMarkdownSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Skip code blocks and headers
    if (line.startsWith('```') || line.startsWith('#') || line.startsWith('    ')) {
      continue;
    }

    // Check regular text content
    findings.push(...checkTextSpelling(line, filePath, lineNumber));
  }

  return findings;
}

function checkHtmlSpelling(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Extract text content between HTML tags
    const textContent = line.replace(/<[^>]*>/g, '').trim();
    if (textContent) {
      findings.push(...checkTextSpelling(textContent, filePath, lineNumber));
    }
  }

  return findings;
}

/**
 * Generic comment and string spelling checker
 */
function checkCommentAndStringSpelling(content: string, filePath: string, commentRegex: RegExp): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Check comments
    const comment = line.match(commentRegex);
    if (comment) {
      const commentText = comment[1] || comment[2] || '';
      findings.push(...checkTextSpelling(commentText, filePath, lineNumber));
    }

    // Check string literals
    const strings = line.match(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"|'([^'\\\\]*(\\\\.[^'\\\\]*)*)'/g) || [];
    for (const str of strings) {
      const stringContent = str.slice(1, -1);
      if (stringContent.length > 3) {
        findings.push(...checkTextSpelling(stringContent, filePath, lineNumber));
      }
    }
  }

  return findings;
}

/**
 * Check spelling in a text string
 */
function checkTextSpelling(text: string, filePath: string, lineNumber: number): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  
  // Clean the text and extract words
  const cleanText = text
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .toLowerCase()
    .trim();

  if (!cleanText) return findings;

  const words = cleanText.split(/\s+/).filter(word => word.length > 2);

  for (const word of words) {
    // Skip if it's a number, variable name pattern, or known programming term
    if (word.match(/^\d+$/) || 
        word.match(/^[a-z]+[A-Z]/) || // camelCase
        word.match(/^[a-z]+_[a-z]+/) || // snake_case
        word.match(/^[A-Z_][A-Z0-9_]*$/)) { // CONSTANTS
      continue;
    }

    // Check for common typos first
    if (COMMON_TYPOS.has(word)) {
      const correction = COMMON_TYPOS.get(word)!;
      findings.push({
        id: `spell-typo-${filePath}-${lineNumber}-${word}`,
        message: `Spelling: "${word}" should be "${correction}"`,
        location: { file: filePath, line: lineNumber },
        severity: 'low',
        category: 'style',
        confidence: 95,
        rationale: `"${word}" is a common misspelling of "${correction}".`,
        suggestion: `Replace "${word}" with "${correction}".`,
        source: 'static',
        agentName: 'SpellChecker',
      });
      continue;
    }

    // Check against dictionary
    if (!DICTIONARY.has(word)) {
      findings.push({
        id: `spell-unknown-${filePath}-${lineNumber}-${word}`,
        message: `Possible spelling mistake: "${word}"`,
        location: { file: filePath, line: lineNumber },
        severity: 'info',
        category: 'style',
        confidence: 60,
        rationale: `"${word}" is not recognized as a common English word.`,
        suggestion: 'Check if this word is spelled correctly.',
        source: 'static',
        agentName: 'SpellChecker',
      });
    }
  }

  return findings;
}