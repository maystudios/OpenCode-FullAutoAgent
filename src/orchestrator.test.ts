import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';

import * as cliExecutor from './cli-executor.ts';
import { orchestrator } from './orchestrator.ts';
import * as state from './state.ts';

let executeSequenceSpy: MockInstance | undefined;
let readStateSpy: MockInstance | undefined;

afterEach(() => {
  executeSequenceSpy?.mockRestore();
  readStateSpy?.mockRestore();
});

describe('orchestrator', () => {
  it('runs a single cycle via runOnce', async () => {
    executeSequenceSpy = vi.spyOn(cliExecutor, 'executeSequence').mockResolvedValue({ count: 1 });
    readStateSpy = vi
      .spyOn(state, 'readState')
      .mockResolvedValueOnce({ status: 'pick_next', lastUpdated: 'now' })
      .mockResolvedValueOnce({ status: 'plan', lastUpdated: 'later' });

    const result = await orchestrator.runOnce();

    expect(result).toBe('Full-Auto run-once completed.');
    expect(executeSequenceSpy).toHaveBeenCalledWith('pick_next');
    expect(executeSequenceSpy).toHaveBeenCalledWith('update_state_status');
  });

  it('halts when state is stop', async () => {
    executeSequenceSpy = vi.spyOn(cliExecutor, 'executeSequence').mockResolvedValue({ count: 1 });
    readStateSpy = vi
      .spyOn(state, 'readState')
      .mockResolvedValue({ status: 'stop', lastUpdated: 'now' });

    const result = await orchestrator.runOnce();

    expect(result).toBe('Full-Auto run-once completed.');
    expect(executeSequenceSpy).not.toHaveBeenCalled();
  });

  it('starts and stops the loop', async () => {
    executeSequenceSpy = vi.spyOn(cliExecutor, 'executeSequence').mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      return { count: 1 };
    });
    readStateSpy = vi
      .spyOn(state, 'readState')
      .mockResolvedValue({ status: 'pick_next', lastUpdated: 'now' });

    const startMessage = await orchestrator.startLoop();

    expect(startMessage).toBe('Full-Auto loop started.');

    await new Promise((resolve) => setTimeout(resolve, 0));

    const stopMessage = await orchestrator.stopLoop();

    expect(stopMessage).toBe('Full-Auto stop requested.');
  });
});
