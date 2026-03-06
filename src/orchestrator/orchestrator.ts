/**
 * Review orchestrator - coordinates agents and aggregates results
 */

import type {
  ReviewFinding,
  ReviewConfig,
  FileDiff,
  AgentContext,
  ReviewReport,
  Severity,
  Category,
} from '../types/index.js';
import { LLMClient, createLLMClient } from '../llm/client.js';
import { BugAgent } from '../agents/bug-agent.js';
import { SecurityAgent } from '../agents/security-agent.js';
import { StyleAgent } from '../agents/style-agent.js';
import { scanSecrets } from '../static/secrets.js';
import { checkSyntax } from '../static/syntax-checker.js';
import { analyzeWhitespace } from '../static/whitespace-analyzer.js';
// import { checkSpelling } from '../static/spell-checker.js';
import { CacheManager } from '../cache/manager.js';
import { createLogger } from '../utils/logger.js';
import { getCachePath } from '../config/loader.js';

const logger = createLogger('orchestrator');

export interface OrchestratorOptions {
  config: ReviewConfig;
  commitSha: string;
  branch?: string;
}

/**
 * Main orchestrator for code review
 */
export class ReviewOrchestrator {
  private config: ReviewConfig;
  private llmClient: LLMClient;
  private cacheManager: CacheManager;
  private commitSha: string;
  private branch?: string;

  constructor(options: OrchestratorOptions) {
    this.config = options.config;
    this.commitSha = options.commitSha;
    this.branch = options.branch;

    // Initialize LLM client
    this.llmClient = createLLMClient(options.config.model, {
      temperature: options.config.temperature,
      maxTokens: options.config.maxTokens,
    });

    // Initialize cache
    this.cacheManager = new CacheManager({
      enabled: options.config.enableCache,
      dbPath: getCachePath(options.config),
    });

    logger.debug('Orchestrator initialized');
  }

  /**
   * Run full review on file diffs
   */
  async review(files: FileDiff[]): Promise<ReviewReport> {
    const startTime = Date.now();
    logger.info(`Starting review of ${files.length} files`);

    // Check LLM availability
    const isAvailable = await this.llmClient.isAvailable();
    if (!isAvailable) {
      logger.warn('LLM is not available, skipping AI analysis');
    }

    const allFindings: ReviewFinding[] = [];

    // Step 1: Static analysis
    if (this.config.enableSecretScanning) {
      logger.info('Running secret scanner...');
      const secretFindings = scanSecrets(files);
      allFindings.push(...secretFindings);
      logger.info(`Found ${secretFindings.length} secrets`);
    }

    // Step 1.5: Syntax checking
    logger.info('Running syntax checker...');
    const syntaxFindings = checkSyntax(files);
    allFindings.push(...syntaxFindings);
    logger.info(`Found ${syntaxFindings.length} syntax errors`);

    // Step 1.6: Spell checking (future feature)
    // TODO: Enable after resolving type configuration issues
    // if (this.config.enableSpellCheck ?? true) {
    //   logger.info('Running spell checker...');
    //   const spellFindings = checkSpelling(files);
    //   allFindings.push(...spellFindings);
    //   logger.info(`Found ${spellFindings.length} spelling issues`);
    // }

    // Step 1.7: Whitespace analysis
    logger.info('Running whitespace analyzer...');
    const whitespaceFindings = analyzeWhitespace(files);
    allFindings.push(...whitespaceFindings);
    logger.info(`Found ${whitespaceFindings.length} formatting issues`);

    // Step 2: AI agents (if LLM is available)
    if (isAvailable) {
      const agentFindings = await this.runAgents(files);
      allFindings.push(...agentFindings);
    }

    // Step 3: Filter by confidence
    const filtered = this.filterFindings(allFindings);

    // Step 4: Build report
    const duration = Date.now() - startTime;
    const report = this.buildReport(filtered, files.length, duration);

    logger.success(`Review complete: ${filtered.length} findings in ${duration}ms`);

    return report;
  }

  /**
   * Run AI agents in parallel
   */
  private async runAgents(files: FileDiff[]): Promise<ReviewFinding[]> {
    const context: AgentContext = {
      diff: files,
      config: this.config,
    };

    // Check cache first
    const uncachedFiles: FileDiff[] = [];
    const cachedFindings: ReviewFinding[] = [];

    for (const file of files) {
      const cached = await this.cacheManager.get(this.commitSha, file);
      if (cached) {
        cachedFindings.push(...cached);
        logger.debug(`Using cached results for ${file.path}`);
      } else {
        uncachedFiles.push(file);
      }
    }

    if (uncachedFiles.length === 0) {
      logger.info('All files cached, skipping AI analysis');
      return cachedFindings;
    }

    logger.info(`Running AI agents on ${uncachedFiles.length} files...`);

    // Create agents
    const agents = [
      new BugAgent(this.llmClient),
      new SecurityAgent(this.llmClient),
      new StyleAgent(this.llmClient),
    ];

    // Run agents in parallel
    const agentPromises = this.config.parallel
      ? agents.map((agent) =>
          agent.review({ ...context, diff: uncachedFiles }),
        )
      : [];

    // Or run sequentially
    const results = this.config.parallel
      ? await Promise.all(agentPromises)
      : [];

    if (!this.config.parallel) {
      for (const agent of agents) {
        const result = await agent.review({ ...context, diff: uncachedFiles });
        results.push(result);
      }
    }

    // Aggregate findings
    const newFindings = results.flatMap((r) => r.findings);

    // Cache results per file
    for (const file of uncachedFiles) {
      const fileFindings = newFindings.filter(
        (f) => f.location.file === file.path,
      );
      await this.cacheManager.set(this.commitSha, file, fileFindings);
    }

    return [...cachedFindings, ...newFindings];
  }

  /**
   * Filter findings by confidence and severity
   */
  private filterFindings(findings: ReviewFinding[]): ReviewFinding[] {
    return findings.filter((finding) => {
      // Filter by confidence
      if (finding.confidence < this.config.minConfidence) {
        return false;
      }

      // Filter by severity
      if (
        this.config.severityFilter &&
        !this.config.severityFilter.includes(finding.severity)
      ) {
        return false;
      }

      // Filter by category
      if (
        this.config.categoryFilter &&
        !this.config.categoryFilter.includes(finding.category)
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Build final report
   */
  private buildReport(
    findings: ReviewFinding[],
    fileCount: number,
    duration: number,
  ): ReviewReport {
    // Count by severity
    const bySeverity: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    // Count by category
    const byCategory: Record<Category, number> = {
      bug: 0,
      security: 0,
      performance: 0,
      style: 0,
      maintainability: 0,
      testing: 0,
      documentation: 0,
    };

    // Count by source
    const bySource: Record<'static' | 'ai', number> = {
      static: 0,
      ai: 0,
    };

    for (const finding of findings) {
      bySeverity[finding.severity]++;
      byCategory[finding.category]++;
      bySource[finding.source]++;
    }

    return {
      summary: {
        totalFindings: findings.length,
        bySeverity,
        byCategory,
        bySource,
      },
      findings,
      metadata: {
        repository: this.config.workingDir,
        commit: this.commitSha,
        branch: this.branch,
        reviewedFiles: fileCount,
        duration,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Close orchestrator and cleanup resources
   */
  close(): void {
    this.cacheManager.close();
  }
}
