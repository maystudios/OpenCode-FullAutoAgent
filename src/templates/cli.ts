import type { CliSequence } from '../types.ts';

export const PICK_NEXT_SEQUENCE: CliSequence = {
  delay_ms: 800,
  commands: ['/exit', 'opencode --model gpt-5', '/pick_next'],
};

export const PLAN_SEQUENCE: CliSequence = {
  delay_ms: 800,
  commands: ['/exit', 'opencode --model gpt-5', '/plan'],
};

export const IMPLEMENT_SEQUENCE: CliSequence = {
  delay_ms: 800,
  commands: ['/exit', 'opencode --model gpt-5', '/implement'],
};

export const REVIEW_SEQUENCE: CliSequence = {
  delay_ms: 800,
  commands: ['/exit', 'opencode --model gpt-5', '/review'],
};

export const DONE_SEQUENCE: CliSequence = {
  delay_ms: 800,
  commands: ['/exit', 'opencode --model gpt-5', '/done'],
};

export const STOP_SEQUENCE: CliSequence = {
  delay_ms: 800,
  commands: ['/exit'],
};

export const UPDATE_STATE_STATUS_SEQUENCE: CliSequence = {
  delay_ms: 400,
  commands: ['/exit', 'opencode --model fast-small', '/update_state_status'],
};

export const DEFAULT_SEQUENCES: Record<string, CliSequence> = {
  pick_next: PICK_NEXT_SEQUENCE,
  plan: PLAN_SEQUENCE,
  implement: IMPLEMENT_SEQUENCE,
  review: REVIEW_SEQUENCE,
  done: DONE_SEQUENCE,
  stop: STOP_SEQUENCE,
  update_state_status: UPDATE_STATE_STATUS_SEQUENCE,
};
