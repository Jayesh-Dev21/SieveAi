/**
 * LLM client facade
 * Provides unified interface for different LLM providers
 */

import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
} from '../types/index.js';
import { LLMError } from '../types/index.js';
import { OllamaProvider } from './providers/ollama.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('llm:client');

export interface LLMClientOptions {
  model: string; // Format: "provider:model" e.g., "ollama:glm-4.7"
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

/**
 * Main LLM client that routes to appropriate provider
 */
export class LLMClient {
  private provider: LLMProvider;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(options: LLMClientOptions) {
    const { provider, model } = this.parseModel(options.model);
    this.model = model;
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens ?? 2048;

    // Initialize provider
    this.provider = this.createProvider(provider, options.timeout);

    logger.debug('LLM client initialized:', {
      provider: this.provider.name,
      model: this.model,
      temperature: this.temperature,
    });
  }

  /**
   * Parse model string (format: "provider:model")
   */
  private parseModel(modelStr: string): {
    provider: string;
    model: string;
  } {
    const parts = modelStr.split(':');
    if (parts.length !== 2) {
      throw new LLMError(
        'Invalid model format. Expected "provider:model" (e.g., "ollama:glm-4.7")',
      );
    }

    const [provider, model] = parts as [string, string];
    return { provider, model };
  }

  /**
   * Create provider instance based on name
   */
  private createProvider(name: string, timeout?: number): LLMProvider {
    switch (name.toLowerCase()) {
      case 'ollama':
        return new OllamaProvider({ timeout });

      default:
        throw new LLMError(`Unsupported LLM provider: ${name}`);
    }
  }

  /**
   * Check if the provider is available
   */
  async isAvailable(): Promise<boolean> {
    return this.provider.isAvailable();
  }

  /**
   * Send a chat completion request
   */
  async chat(messages: LLMRequest['messages']): Promise<LLMResponse> {
    const request: LLMRequest = {
      model: this.model,
      messages,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    };

    logger.debug('Sending chat request:', {
      model: this.model,
      messagesCount: messages.length,
    });

    try {
      const startTime = Date.now();
      const response = await this.provider.chat(request);
      const duration = Date.now() - startTime;

      logger.debug('Chat response received:', {
        duration,
        finishReason: response.finishReason,
        tokens: response.usage?.totalTokens,
      });

      return response;
    } catch (error) {
      logger.error('Chat request failed:', error);
      throw error;
    }
  }

  /**
   * Simple completion helper (system + user message)
   */
  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    return response.content;
  }

  /**
   * Get model info
   */
  getModelInfo(): {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
  } {
    return {
      provider: this.provider.name,
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    };
  }
}

/**
 * Create an LLM client with default settings
 */
export function createLLMClient(
  model = 'ollama:glm-4.7',
  options: Partial<LLMClientOptions> = {},
): LLMClient {
  return new LLMClient({
    model,
    ...options,
  });
}
