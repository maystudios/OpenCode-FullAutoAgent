import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  getFullAutoPath,
  CLI_DIR,
  COMMANDS_DIR,
  getCommandPath,
  getCliPath,
} from '../constants.ts';
import {
  PICK_NEXT_TEMPLATE,
  PLAN_TEMPLATE,
  IMPLEMENT_TEMPLATE,
  REVIEW_TEMPLATE,
  DONE_TEMPLATE,
  UPDATE_STATE_STATUS_TEMPLATE,
  DEFAULT_SEQUENCES,
  CHECKLIST_TEMPLATE,
} from '../templates/index.ts';
import { writeState } from '../state.ts';
import { injectAgentsHeader } from '../agents-md.ts';

const executeInit = async (): Promise<string> => {
  try {
    const root = getFullAutoPath();

    // 1. Create directory structure
    await mkdir(resolve(root, CLI_DIR), { recursive: true });
    await mkdir(resolve(root, COMMANDS_DIR), { recursive: true });

    // 2. Write Command Templates
    const commands = {
      pick_next: PICK_NEXT_TEMPLATE,
      plan: PLAN_TEMPLATE,
      implement: IMPLEMENT_TEMPLATE,
      review: REVIEW_TEMPLATE,
      done: DONE_TEMPLATE,
      update_state_status: UPDATE_STATE_STATUS_TEMPLATE,
    };

    for (const [name, template] of Object.entries(commands)) {
      await writeFile(getCommandPath(name), template, 'utf-8');
    }

    // 3. Write CLI Sequences
    for (const [name, sequence] of Object.entries(DEFAULT_SEQUENCES)) {
      await writeFile(getCliPath(name), JSON.stringify(sequence, null, 2) + '\n', 'utf-8');
    }

    // 4. Initialize State
    await writeState({
      status: 'pick_next',
      lastUpdated: new Date().toISOString(),
    });

    // 5. Initialize Checklist Example
    await writeFile(resolve(root, 'checklist.md'), CHECKLIST_TEMPLATE, 'utf-8');

    // 6. Inject AGENTS.md Header
    await injectAgentsHeader();

    return 'Full-Auto initialized successfully. Directory structure created and AGENTS.md updated.';
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `[ERROR] Failed to initialize Full-Auto: ${message}`;
  }
};

export { executeInit };
