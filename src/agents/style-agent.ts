/**
 * Code style and maintainability agent
 */

import { BaseAgent } from './base-agent.js';

export class StyleAgent extends BaseAgent {
  protected name = 'StyleAgent';
  protected category = 'style' as const;
}
