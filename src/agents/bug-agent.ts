/**
 * Bug detection agent
 */

import { BaseAgent } from './base-agent.js';

export class BugAgent extends BaseAgent {
  protected name = 'BugAgent';
  protected category = 'bug' as const;
}
