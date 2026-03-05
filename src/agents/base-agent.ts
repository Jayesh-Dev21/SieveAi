/**
 * Base agent class for code review
 */

import type {
  AgentContext,
  AgentResult,
  ReviewFinding,
  FileDiff,
  Category,
} from '../types/index.js';
import { LLMError } from '../types/index.js';
import { LLMClient } from '../llm/client.js';
import { getSystemPrompt, buildUserPrompt } from '../llm/prompts.js';
import { createLogger } from '../utils/logger.js';
import { hashFinding } from '../utils/hash.js';

const logger = createLogger('agent:base');

export abstract class BaseAgent {
  protected abstract name: string;
  protected abstract category: Category;
  protected client: LLMClient;

  constructor(client: LLMClient) {
    this.client = client;
  }

  /**
   * Review code changes
   */
  async review(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    logger.debug(`${this.name} starting review`);

    const findings: ReviewFinding[] = [];

    try {
      // Process each file
      for (const file of context.diff) {
        const fileFindings = await this.reviewFile(file, context);
        findings.push(...fileFindings);
      }

      const duration = Date.now() - startTime;
      logger.debug(`${this.name} completed in ${duration}ms, found ${findings.length} issues`);

      return {
        findings,
        metadata: {
          agentName: this.name,
          duration,
          model: context.config.model,
        },
      };
    } catch (error) {
      logger.error(`${this.name} failed:`, error);
      throw error;
    }
  }

  /**
   * Review a single file
   */
  protected async reviewFile(
    file: FileDiff,
    _context: AgentContext,
  ): Promise<ReviewFinding[]> {
    try {
      // Build diff string
      const diffText = this.buildDiffText(file);

      if (!diffText.trim()) {
        return [];
      }

      // Build prompts
      const systemPrompt = getSystemPrompt(
        this.category as 'bug' | 'security' | 'style',
      );
      const userPrompt = buildUserPrompt({
        file: file.path,
        diff: diffText,
        category: this.category as 'bug' | 'security' | 'style',
      });

      // Call LLM
      const response = await this.client.complete(systemPrompt, userPrompt);

      // Parse response
      const findings = this.parseResponse(response, file);

      return findings;
    } catch (error) {
      if (error instanceof LLMError) {
        logger.error(`LLM error in ${this.name}:`, error.message);
        return [];
      }
      throw error;
    }
  }

  /**
   * Build diff text from file
   */
  protected buildDiffText(file: FileDiff): string {
    return file.hunks
      .map((hunk) => {
        const header = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@ ${hunk.header}`;
        return `${header}\n${hunk.content}`;
      })
      .join('\n\n');
  }

  /**
   * Parse LLM response into findings
   */
  protected parseResponse(
    response: string,
    file: FileDiff,
  ): ReviewFinding[] {
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] ?? '{}' : response;

      const parsed = JSON.parse(jsonStr) as {
        findings?: Array<{
          message: string;
          line: number;
          severity?: string;
          confidence?: number;
          rationale?: string;
          suggestion?: string;
        }>;
      };

      if (!parsed.findings || !Array.isArray(parsed.findings)) {
        logger.warn(`Invalid response format from ${this.name}`);
        return [];
      }

      return parsed.findings.map((finding) => {
        const id = hashFinding(file.path, finding.line, finding.message);

        return {
          id,
          message: finding.message,
          location: {
            file: file.path,
            line: finding.line,
          },
          severity: this.parseSeverity(finding.severity),
          category: this.category,
          confidence: finding.confidence ?? 70,
          rationale: finding.rationale ?? '',
          suggestion: finding.suggestion,
          source: 'ai' as const,
          agentName: this.name,
        };
      });
    } catch (error) {
      logger.error(`Failed to parse ${this.name} response:`, error);
      logger.debug('Response:', response);
      return [];
    }
  }

  /**
   * Parse severity string
   */
  protected parseSeverity(
    severity?: string,
  ): 'critical' | 'high' | 'medium' | 'low' | 'info' {
    const normalized = severity?.toLowerCase();
    if (
      normalized === 'critical' ||
      normalized === 'high' ||
      normalized === 'medium' ||
      normalized === 'low' ||
      normalized === 'info'
    ) {
      return normalized;
    }
    return 'medium';
  }
}
