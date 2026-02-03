import { describe, expect, it, vi } from 'vitest';

vi.mock('../commands/init.ts', () => ({
  executeInit: vi.fn().mockResolvedValue('init-ok'),
}));

vi.mock('../commands/start.ts', () => ({
  executeStart: vi.fn().mockResolvedValue('start-ok'),
}));

vi.mock('../commands/stop.ts', () => ({
  executeStop: vi.fn().mockResolvedValue('stop-ok'),
}));

vi.mock('../commands/run-once.ts', () => ({
  executeRunOnce: vi.fn().mockResolvedValue('run-once-ok'),
}));

import { fullAutoTool } from './full-auto.ts';

describe('fullAutoTool', () => {
  it('routes init action to executeInit', async () => {
    const context = {} as any;
    const result = await fullAutoTool.execute({ action: 'init' }, context);

    expect(result).toBe('init-ok');
  });

  it('routes run_once action to executeRunOnce', async () => {
    const context = {} as any;
    const result = await fullAutoTool.execute({ action: 'run_once' }, context);

    expect(result).toBe('run-once-ok');
  });
});
