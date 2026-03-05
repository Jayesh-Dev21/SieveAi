/**
 * Security analysis agent
 */

import { BaseAgent } from './base-agent.js';

export class SecurityAgent extends BaseAgent {
  protected name = 'SecurityAgent';
  protected category = 'security' as const;
}
