type WorkflowStatus = 'pick_next' | 'plan' | 'implement' | 'review' | 'done';

interface WorkflowState {
  status: WorkflowStatus;
  lastUpdated: string;
  activeTask?: string;
  context?: Record<string, unknown>;
}

interface CliSequence {
  delay_ms: number;
  commands: string[];
}

interface FullAutoConfig {
  defaultDelayMs: number;
}

export type { WorkflowState, WorkflowStatus, CliSequence, FullAutoConfig };
