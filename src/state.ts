import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { getFullAutoPath, getStatePath } from './constants.ts';
import type { WorkflowState, WorkflowStatus } from './types.ts';

const VALID_STATUSES: WorkflowStatus[] = ['pick_next', 'plan', 'implement', 'review', 'done'];

const getDefaultState = (): WorkflowState => {
  return {
    status: 'pick_next',
    lastUpdated: new Date().toISOString(),
  };
};

const isValidStatus = (status: unknown): status is WorkflowStatus => {
  return typeof status === 'string' && VALID_STATUSES.includes(status as WorkflowStatus);
};

const readState = async (baseDir?: string): Promise<WorkflowState> => {
  try {
    const statePath = getStatePath(baseDir);
    const raw = await readFile(statePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<WorkflowState>;

    if (!parsed || !isValidStatus(parsed.status)) {
      return getDefaultState();
    }

    return {
      status: parsed.status,
      lastUpdated: parsed.lastUpdated ?? new Date().toISOString(),
      activeTask: parsed.activeTask,
      context: parsed.context,
    };
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ENOENT') {
        return getDefaultState();
      }
    }

    const message = error instanceof Error ? error.toString() : String(error);
    process.stderr.write(`[ERROR] Failed to read workflow state: ${message}\n`);
    return getDefaultState();
  }
};

const writeState = async (state: WorkflowState, baseDir?: string): Promise<void> => {
  const statePath = getStatePath(baseDir);
  await mkdir(getFullAutoPath(baseDir), { recursive: true });
  const payload: WorkflowState = {
    ...state,
    lastUpdated: state.lastUpdated ?? new Date().toISOString(),
  };
  await writeFile(statePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
  process.stdout.write(`State updated: ${payload.status}\n`);
};

export { readState, writeState };
