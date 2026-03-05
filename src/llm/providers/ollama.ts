/**
 * Ollama provider implementation
 * Uses HTTP API directly (no dependencies)
 */

import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
} from '../../types/index.js';
import { LLMError } from '../../types/index.js';
import { createLogger } from '../../utils/logger.js';
import { retry } from '../../utils/errors.js';

const logger = createLogger('llm:ollama');

export interface OllamaOptions {
  baseUrl?: string;
  timeout?: number; // milliseconds
}

interface OllamaChatRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export class OllamaProvider implements LLMProvider {
  name = 'ollama';
  private baseUrl: string;
  private timeout: number;

  constructor(options: OllamaOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'http://localhost:11434';
    this.timeout = options.timeout ?? 120000; // 2 minutes default
  }

  /**
   * Check if Ollama is running and accessible
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      logger.debug('Ollama not available:', error);
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new LLMError(`Failed to list models: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        models?: Array<{ name: string }>;
      };
      return data.models?.map((m) => m.name) ?? [];
    } catch (error) {
      throw new LLMError('Failed to list Ollama models', { error });
    }
  }

  /**
   * Send chat completion request
   */
  async chat(request: LLMRequest): Promise<LLMResponse> {
    logger.debug('Sending chat request:', {
      model: request.model,
      messages: request.messages.length,
    });

    const ollamaRequest: OllamaChatRequest = {
      model: request.model,
      messages: request.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: false,
      options: {
        temperature: request.temperature,
        num_predict: request.maxTokens,
      },
    };

    try {
      const result = await retry(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);

          try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ollamaRequest),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new LLMError(
                `Ollama request failed: ${response.statusText}`,
                { status: response.status },
              );
            }

            return (await response.json()) as OllamaChatResponse;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        },
        {
          maxAttempts: 2,
          delayMs: 1000,
          onRetry: (attempt, error) => {
            logger.warn(`Ollama request failed, retrying (${attempt}/2)`, error);
          },
        },
      );

      logger.debug('Ollama response:', {
        done: result.done,
        promptTokens: result.prompt_eval_count,
        completionTokens: result.eval_count,
      });

      return {
        content: result.message.content,
        finishReason: this.mapFinishReason(result.done_reason),
        usage: result.prompt_eval_count
          ? {
              promptTokens: result.prompt_eval_count ?? 0,
              completionTokens: result.eval_count ?? 0,
              totalTokens:
                (result.prompt_eval_count ?? 0) + (result.eval_count ?? 0),
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }

      // Check if it's an abort error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new LLMError(
          `Ollama request timed out after ${this.timeout}ms`,
          { error },
        );
      }

      throw new LLMError('Ollama request failed', { error });
    }
  }

  /**
   * Map Ollama finish reason to our standard format
   */
  private mapFinishReason(
    reason?: string,
  ): 'stop' | 'length' | 'error' {
    if (!reason || reason === 'stop') {
      return 'stop';
    }
    if (reason === 'length') {
      return 'length';
    }
    return 'error';
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(model: string): Promise<void> {
    logger.info(`Pulling model ${model} from Ollama...`);

    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: model }),
      });

      if (!response.ok) {
        throw new LLMError(`Failed to pull model: ${response.statusText}`);
      }

      // Stream the progress (simplified - just wait for done)
      const reader = response.body?.getReader();
      if (!reader) {
        throw new LLMError('No response body');
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            try {
              const data = JSON.parse(line) as { status?: string };
              if (data.status) {
                logger.debug(data.status);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      logger.success(`Model ${model} pulled successfully`);
    } catch (error) {
      throw new LLMError(`Failed to pull model ${model}`, { error });
    }
  }
}
