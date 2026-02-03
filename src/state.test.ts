import { describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { readState, writeState } from './state.ts';

const withTempDir = async (prefix: string, run: (dir: string) => Promise<void>): Promise<void> => {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

describe('state', () => {
  it('returns default state when state.json is missing', async () => {
    await withTempDir('full-auto-state-', async (dir) => {
      const state = await readState(dir);

      expect(state.status).toBe('pick_next');
    });
  });

  it('writes and reads a valid state', async () => {
    await withTempDir('full-auto-state-', async (dir) => {
      const now = new Date().toISOString();

      await writeState({ status: 'plan', lastUpdated: now }, dir);

      const state = await readState(dir);

      expect(state.status).toBe('plan');
    });
  });

  it('falls back to default state when status is invalid', async () => {
    await withTempDir('full-auto-state-', async (dir) => {
      const statePath = resolve(dir, '.opencode/full-auto/state.json');
      await mkdir(resolve(dir, '.opencode/full-auto'), { recursive: true });
      await writeFile(statePath, JSON.stringify({ status: 'invalid' }), 'utf-8');

      const state = await readState(dir);

      expect(state.status).toBe('pick_next');
    });
  });
});
