/**
 * Multi-language syntax checker
 * Supports JavaScript, TypeScript, C++, C, Python, and more
 */

import type { ReviewFinding, FileDiff } from '../types/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('static:syntax');

/**
 * Check source files for syntax errors
 */
export function checkSyntax(files: FileDiff[]): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  for (const file of files) {
    // Check if file is a supported language
    if (!isSupportedFile(file.path)) {
      continue;
    }

    logger.debug(`Checking syntax for ${file.path}`);

    try {
      // Get the new content from hunks
      const newContent = getNewFileContent(file);
      
      if (!newContent) {
        continue; // File was deleted or no content
      }

      // Check syntax based on file type
      const errors = checkFileSyntax(newContent, file.path);
      findings.push(...errors);
      
    } catch (error) {
      logger.warn(`Failed to check syntax for ${file.path}:`, error);
    }
  }

  return findings;
}

/**
 * Check if file is supported for syntax checking
 */
function isSupportedFile(filePath: string): boolean {
  return isJavaScriptFile(filePath) || 
         isCppFile(filePath) || 
         isPythonFile(filePath) ||
         isJavaFile(filePath) ||
         isGoFile(filePath) ||
         isRustFile(filePath) ||
         isPHPFile(filePath) ||
         isRubyFile(filePath) ||
         isSwiftFile(filePath) ||
         isKotlinFile(filePath) ||
         isShellFile(filePath) ||
         isHTMLFile(filePath) ||
         isCSSFile(filePath) ||
         isJSONFile(filePath) ||
         isYAMLFile(filePath) ||
         isMarkdownFile(filePath);
}

/**
 * Check if file is a JavaScript/TypeScript file
 */
function isJavaScriptFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return (
    ext.endsWith('.js') ||
    ext.endsWith('.jsx') ||
    ext.endsWith('.ts') ||
    ext.endsWith('.tsx') ||
    ext.endsWith('.mjs') ||
    ext.endsWith('.cjs')
  );
}

/**
 * Check if file is a C/C++ file
 */
function isCppFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return (
    ext.endsWith('.cpp') ||
    ext.endsWith('.cxx') ||
    ext.endsWith('.cc') ||
    ext.endsWith('.c') ||
    ext.endsWith('.h') ||
    ext.endsWith('.hpp') ||
    ext.endsWith('.hxx')
  );
}

/**
 * Check if file is a Python file
 */
function isPythonFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.py') || ext.endsWith('.pyw');
}

/**
 * Check if file is a Java file
 */
function isJavaFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.java');
}

/**
 * Check if file is a Go file
 */
function isGoFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.go');
}

/**
 * Check if file is a Rust file
 */
function isRustFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.rs');
}

/**
 * Check if file is a PHP file
 */
function isPHPFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.php') || ext.endsWith('.phtml');
}

/**
 * Check if file is a Ruby file
 */
function isRubyFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.rb') || ext.endsWith('.rbw');
}

/**
 * Check if file is a Swift file
 */
function isSwiftFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.swift');
}

/**
 * Check if file is a Kotlin file
 */
function isKotlinFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.kt') || ext.endsWith('.kts');
}

/**
 * Check if file is a Shell script file
 */
function isShellFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.sh') || ext.endsWith('.bash') || ext.endsWith('.zsh') || ext.endsWith('.fish');
}

/**
 * Check if file is an HTML file
 */
function isHTMLFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.html') || ext.endsWith('.htm') || ext.endsWith('.xhtml');
}

/**
 * Check if file is a CSS file
 */
function isCSSFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.css') || ext.endsWith('.scss') || ext.endsWith('.sass') || ext.endsWith('.less');
}

/**
 * Check if file is a JSON file
 */
function isJSONFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.json') || ext.endsWith('.jsonc');
}

/**
 * Check if file is a YAML file
 */
function isYAMLFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.yaml') || ext.endsWith('.yml');
}

/**
 * Check if file is a Markdown file
 */
function isMarkdownFile(filePath: string): boolean {
  const ext = filePath.toLowerCase();
  return ext.endsWith('.md') || ext.endsWith('.markdown') || ext.endsWith('.mdown');
}

/**
 * Extract new file content from diff hunks
 */
function getNewFileContent(file: FileDiff): string | null {
  if (file.type === 'delete') {
    return null;
  }

  // For new files, extract all + lines
  // For modified files, apply the diff to reconstruct content
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
 * Check file syntax based on file type
 */
function checkFileSyntax(content: string, filePath: string): ReviewFinding[] {
  if (isJavaScriptFile(filePath)) {
    return checkJavaScriptSyntax(content, filePath);
  } else if (isCppFile(filePath)) {
    return checkCppSyntax(content, filePath);
  } else if (isPythonFile(filePath)) {
    return checkPythonSyntax(content, filePath);
  } else if (isJavaFile(filePath)) {
    return checkJavaSyntax(content, filePath);
  }
  // For now, other languages use basic syntax checking
  return checkBasicSyntax(content, filePath);
}

/**
 * Check C++ syntax for common errors
 */
function checkCppSyntax(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  // Check for overall brace balance across the entire file
  let braceCount = 0;
  let inSingleComment = false;
  let inMultiComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Track comment state
    if (line.includes('/*') && !inSingleComment) inMultiComment = true;
    if (line.includes('*/') && inMultiComment) inMultiComment = false;
    if (line.trimStart().startsWith('//')) inSingleComment = true;
    else inSingleComment = false;

    // Skip comment lines for syntax checks
    if (inSingleComment || inMultiComment) continue;

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Count braces for overall balance
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }

    // Check for missing semicolons after statements (but not function/control structures)
    if (trimmed.match(/^\s*(int|float|double|char|bool|string|auto|const|static)\s+\w+.*[^;{}\s]$/) &&
        !trimmed.includes('for') && !trimmed.includes('if') && !trimmed.includes('while') &&
        !trimmed.includes('(') && !trimmed.includes(')')) {
      findings.push({
        id: `cpp-missing-semicolon-${filePath}-${lineNumber}`,
        message: 'Missing semicolon at end of statement',
        location: { file: filePath, line: lineNumber },
        severity: 'critical',
        category: 'bug',
        confidence: 85,
        rationale: 'C++ statements must end with a semicolon.',
        suggestion: 'Add a semicolon (;) at the end of the line.',
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }

    // Check for potential incomplete variable declarations
    if (trimmed.match(/^\s*(int|float|double|char|bool|string|auto)\s+$/) ||
        trimmed.match(/^\s*(int|float|double|char|bool|string|auto)\s+\w+\s*$/)) {
      findings.push({
        id: `cpp-incomplete-declaration-${filePath}-${lineNumber}`,
        message: 'Incomplete variable declaration',
        location: { file: filePath, line: lineNumber },
        severity: 'critical',
        category: 'bug',
        confidence: 90,
        rationale: 'Variable declarations must be complete and end with a semicolon.',
        suggestion: 'Complete the variable declaration and add a semicolon.',
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }
  }

  // Check overall brace balance at the end
  if (braceCount !== 0) {
    findings.push({
      id: `cpp-unmatched-braces-${filePath}-file`,
      message: 'Unmatched braces in file - overall brace count is unbalanced',
      location: { file: filePath, line: 1 },
      severity: 'critical',
      category: 'bug',
      confidence: 95,
      rationale: 'All opening braces must have corresponding closing braces.',
      suggestion: braceCount > 0 ? 'Add missing closing braces.' : 'Remove extra closing braces.',
      source: 'static',
      agentName: 'SyntaxChecker',
    });
  }

  return findings;
}

/**
 * Check Python syntax for common errors
 */
function checkPythonSyntax(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    if (!line.trim() || line.trim().startsWith('#')) continue;
    
    const lineNumber = i + 1;

    // Check for improper indentation
    if (line.match(/^\s*(def|class|if|for|while|try|except|with)\s+.*:\s*$/) && 
        i + 1 < lines.length) {
      const nextLine = lines[i + 1] || '';
      if (nextLine.trim() && !nextLine.startsWith('    ') && !nextLine.startsWith('\t')) {
        findings.push({
          id: `python-indentation-${filePath}-${lineNumber + 1}`,
          message: 'Incorrect indentation - expected indented block',
          location: { file: filePath, line: lineNumber + 1 },
          severity: 'critical',
          category: 'bug',
          confidence: 95,
          rationale: 'Python requires proper indentation for code blocks.',
          suggestion: 'Indent the code block with 4 spaces or a tab.',
          source: 'static',
          agentName: 'SyntaxChecker',
        });
      }
    }

    // Check for unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      findings.push({
        id: `python-unmatched-parens-${filePath}-${lineNumber}`,
        message: 'Unmatched parentheses',
        location: { file: filePath, line: lineNumber },
        severity: 'critical',
        category: 'bug',
        confidence: 90,
        rationale: 'All opening parentheses must have corresponding closing parentheses.',
        suggestion: 'Balance the parentheses.',
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }
  }

  return findings;
}

/**
 * Check Java syntax for common errors
 */
function checkJavaSyntax(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  // Check for overall brace balance across the entire file
  let braceCount = 0;
  let inSingleComment = false;
  let inMultiComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || '';
    const lineNumber = i + 1;

    // Track comment state
    if (line.includes('/*') && !inSingleComment) inMultiComment = true;
    if (line.includes('*/') && inMultiComment) inMultiComment = false;
    if (line.trimStart().startsWith('//')) inSingleComment = true;
    else inSingleComment = false;

    // Skip comment lines for syntax checks
    if (inSingleComment || inMultiComment) continue;

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Count braces for overall balance
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }

    // Check for missing semicolons
    if (trimmed.match(/^\s*(int|float|double|boolean|char|String|var|final)\s+\w+.*[^;{}\s]$/) &&
        !trimmed.includes('for') && !trimmed.includes('if') && !trimmed.includes('while') &&
        !trimmed.includes('(') && !trimmed.includes(')')) {
      findings.push({
        id: `java-missing-semicolon-${filePath}-${lineNumber}`,
        message: 'Missing semicolon at end of statement',
        location: { file: filePath, line: lineNumber },
        severity: 'critical',
        category: 'bug',
        confidence: 85,
        rationale: 'Java statements must end with a semicolon.',
        suggestion: 'Add a semicolon (;) at the end of the line.',
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }
  }

  // Check overall brace balance at the end
  if (braceCount !== 0) {
    findings.push({
      id: `java-unmatched-braces-${filePath}-file`,
      message: 'Unmatched braces in file - overall brace count is unbalanced',
      location: { file: filePath, line: 1 },
      severity: 'critical',
      category: 'bug',
      confidence: 95,
      rationale: 'All opening braces must have corresponding closing braces.',
      suggestion: braceCount > 0 ? 'Add missing closing braces.' : 'Remove extra closing braces.',
      source: 'static',
      agentName: 'SyntaxChecker',
    });
  }

  return findings;
}

/**
 * Basic syntax checking for unsupported languages
 */
function checkBasicSyntax(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  // Only check brace balance across the entire file for basic syntax
  let braceCount = 0;
  let parenCount = 0;

  for (const line of lines) {
    // Count braces and parentheses for overall balance
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
    }
  }

  // Check overall brace balance at the end
  if (braceCount !== 0) {
    findings.push({
      id: `basic-unmatched-braces-${filePath}-file`,
      message: 'Unmatched braces in file - overall brace count is unbalanced',
      location: { file: filePath, line: 1 },
      severity: 'medium',
      category: 'bug',
      confidence: 70,
      rationale: 'All opening braces should have corresponding closing braces.',
      suggestion: braceCount > 0 ? 'Add missing closing braces.' : 'Remove extra closing braces.',
      source: 'static',
      agentName: 'SyntaxChecker',
    });
  }

  // Check overall parentheses balance at the end
  if (parenCount !== 0) {
    findings.push({
      id: `basic-unmatched-parens-${filePath}-file`,
      message: 'Unmatched parentheses in file - overall parentheses count is unbalanced',
      location: { file: filePath, line: 1 },
      severity: 'medium',
      category: 'bug',
      confidence: 70,
      rationale: 'All opening parentheses should have corresponding closing parentheses.',
      suggestion: parenCount > 0 ? 'Add missing closing parentheses.' : 'Remove extra closing parentheses.',
      source: 'static',
      agentName: 'SyntaxChecker',
    });
  }

  return findings;
}

/**
 * Check JavaScript syntax for common errors
 */
function checkJavaScriptSyntax(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  // For JSX/TSX files, use custom JSX checker
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    findings.push(...checkJSXSyntax(content, filePath));
  } else if (filePath.endsWith('.ts')) {
    // For TypeScript files, skip syntax checking since we'd need a full TS parser
    // The TypeScript compiler would catch these errors anyway
    return findings;
  } else {
    // For regular JS files, try parsing but skip if it has ES6 imports
    if (content.includes('import ') || content.includes('export ')) {
      // ES6 modules - skip Function constructor check as it doesn't support imports
      return findings;
    }
    
    try {
      // For regular JS files without modules, try parsing
      new Function(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Extract line number from error message
        const lineMatch = error.message.match(/line (\d+)/);
        const line = lineMatch ? parseInt(lineMatch[1]!, 10) : 1;

        findings.push({
          id: `syntax-error-${filePath}-${line}`,
          message: `Syntax Error: ${error.message}`,
          location: {
            file: filePath,
            line: line,
          },
          severity: 'critical',
          category: 'bug',
          confidence: 100,
          rationale: 'This is a JavaScript syntax error that will prevent the code from running.',
          suggestion: 'Fix the syntax error based on the error message.',
          source: 'static',
          agentName: 'SyntaxChecker',
        });
      }
    }
  }

  return findings;
}

/**
 * Basic JSX syntax checking
 */
function checkJSXSyntax(content: string, filePath: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const lineNumber = i + 1;

    // Check for common JSX syntax errors
    
    // 1. Unclosed function parameters - more specific check
    const functionMatch = line.match(/function\s+(\w+)\s*\(\s*([^)]*?)$/);
    if (functionMatch) {
      // Found a function declaration that ends with an open paren and no close paren
      findings.push({
        id: `jsx-function-syntax-error-${filePath}-${lineNumber}`,
        message: 'Function parameter list is not properly closed - missing closing parenthesis ")"',
        location: {
          file: filePath,
          line: lineNumber,
        },
        severity: 'critical',
        category: 'bug',
        confidence: 98,
        rationale: 'Function declarations must have properly matched parentheses around the parameter list.',
        suggestion: `Add a closing parenthesis ")" after the function parameters. The line should likely be: "function ${functionMatch[1]}() {"`,
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }

    // Also check for general mismatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens > closeParens && line.includes('function')) {
      findings.push({
        id: `jsx-paren-mismatch-${filePath}-${lineNumber}`,
        message: 'Unmatched opening parenthesis in function declaration',
        location: {
          file: filePath,
          line: lineNumber,
        },
        severity: 'critical',
        category: 'bug',
        confidence: 90,
        rationale: 'All opening parentheses must have corresponding closing parentheses.',
        suggestion: 'Add the missing closing parenthesis ")" to balance the parentheses.',
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }

    // 2. Mismatched JSX tags (basic check)
    const openTags = (line.match(/<[a-zA-Z][^>]*[^/]>/g) || []).length;
    const closeTags = (line.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
    const selfClosingTags = (line.match(/<[a-zA-Z][^>]*\/>/g) || []).length;
    
    if (openTags > 0 && closeTags === 0 && selfClosingTags === 0) {
      // This is a simple heuristic - in real JSX, tags can span multiple lines
      // But it can catch some basic issues
    }

    // 3. Check for incomplete JSX expressions
    if (line.includes('{') && !line.includes('}')) {
      findings.push({
        id: `jsx-expression-error-${filePath}-${lineNumber}`,
        message: 'Incomplete JSX expression - missing closing brace',
        location: {
          file: filePath,
          line: lineNumber,
        },
        severity: 'high',
        category: 'bug',
        confidence: 80,
        rationale: 'JSX expressions must be properly closed with a closing brace.',
        suggestion: 'Add the missing closing brace "}" to complete the JSX expression.',
        source: 'static',
        agentName: 'SyntaxChecker',
      });
    }
  }

  return findings;
}