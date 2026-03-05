/**
 * Core type definitions for SieveAi
 * Shared across all modules
 */

// ============================================================================
// Location & Code Context
// ============================================================================

export interface CodeLocation {
  file: string;
  line: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  content: string;
  header: string;
}

export interface FileDiff {
  path: string;
  oldPath?: string; // For renames
  type: 'add' | 'delete' | 'modify' | 'rename';
  hunks: DiffHunk[];
  hash: string; // SHA-256 of content
}

// ============================================================================
// Review Findings
// ============================================================================

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type Category =
  | 'bug'
  | 'security'
  | 'performance'
  | 'style'
  | 'maintainability'
  | 'testing'
  | 'documentation';

export interface ReviewFinding {
  id: string; // Unique hash of location + message
  message: string;
  location: CodeLocation;
  severity: Severity;
  category: Category;
  confidence: number; // 0-100
  rationale: string; // Why this is an issue
  suggestion?: string; // How to fix it
  source: 'static' | 'ai'; // Where it came from
  agentName?: string; // e.g., "BugAgent", "SecurityAgent"
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Agent System
// ============================================================================

export interface AgentContext {
  diff: FileDiff[];
  config: ReviewConfig;
  memory?: MemoryEntry[];
}

export interface AgentResult {
  findings: ReviewFinding[];
  metadata: {
    agentName: string;
    duration: number; // milliseconds
    tokensUsed?: number;
    model?: string;
  };
}

// ============================================================================
// LLM Client
// ============================================================================

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'error';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  name: string;
  chat(request: LLMRequest): Promise<LLMResponse>;
  isAvailable(): Promise<boolean>;
}

// ============================================================================
// Configuration
// ============================================================================

export interface ReviewConfig {
  // Model settings
  model: string; // e.g., "ollama:glm-4.7"
  temperature?: number;
  maxTokens?: number;

  // Filtering
  minConfidence: number; // 0-100, default 78
  severityFilter?: Severity[]; // Only report these severities
  categoryFilter?: Category[]; // Only report these categories

  // Performance
  enableCache: boolean;
  parallel: boolean; // Run agents in parallel
  maxConcurrency?: number;

  // Static analysis
  enableSecretScanning: boolean;
  enableSemgrep: boolean;
  semgrepRules?: string[]; // Paths to custom rule files

  // Output
  format: 'text' | 'json' | 'tui';
  verbose: boolean;
  showRationale: boolean;

  // Memory/Learning
  enableMemory: boolean;
  memoryPath?: string;

  // Paths
  cachePath: string;
  workingDir: string;
}

// ============================================================================
// Cache
// ============================================================================

export interface CacheKey {
  commitSha: string;
  filePath: string;
  contentHash: string;
}

export interface CacheEntry {
  key: CacheKey;
  findings: ReviewFinding[];
  createdAt: number; // Unix timestamp
  agentVersion: string; // Track agent changes
}

// ============================================================================
// Memory/Feedback
// ============================================================================

export interface MemoryEntry {
  issueHash: string; // Hash of finding pattern
  isFalsePositive: boolean;
  userFeedback?: string;
  examples: {
    file: string;
    snippet: string;
    decision: 'accept' | 'reject';
  }[];
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Reporting
// ============================================================================

export interface ReviewReport {
  summary: {
    totalFindings: number;
    bySeverity: Record<Severity, number>;
    byCategory: Record<Category, number>;
    bySource: Record<'static' | 'ai', number>;
  };
  findings: ReviewFinding[];
  metadata: {
    repository: string;
    commit: string;
    branch?: string;
    reviewedFiles: number;
    duration: number;
    timestamp: number;
  };
}

// ============================================================================
// Errors
// ============================================================================

export class SieveError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'SieveError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class GitError extends SieveError {
  constructor(message: string, details?: unknown) {
    super(message, 'GIT_ERROR', details);
    this.name = 'GitError';
  }
}

export class LLMError extends SieveError {
  constructor(message: string, details?: unknown) {
    super(message, 'LLM_ERROR', details);
    this.name = 'LLMError';
  }
}

export class CacheError extends SieveError {
  constructor(message: string, details?: unknown) {
    super(message, 'CACHE_ERROR', details);
    this.name = 'CacheError';
  }
}

export class ConfigError extends SieveError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIG_ERROR', details);
    this.name = 'ConfigError';
  }
}
