import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

vi.mock('node:child_process', () => ({
  exec: (
    command: string,
    callback: (error: Error | null, stdout: string, stderr: string) => void
  ) => {
    callback(null, `mocked:${command}`, '');
  },
}));

import { executeSequence } from './cli-executor.ts';

let stdoutSpy: ReturnType<typeof vi.spyOn> | undefined;
let stderrSpy: ReturnType<typeof vi.spyOn> | undefined;

const withTempDir = async (prefix: string, run: (dir: string) => Promise<void>): Promise<void> => {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

describe('executeSequence', () => {
  beforeEach(() => {
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy?.mockRestore();
    stderrSpy?.mockRestore();
  });

  it('executes commands from the sequence', async () => {
    await withTempDir('full-auto-cli-', async (dir) => {
      const cliDir = resolve(dir, '.opencode/full-auto/cli');
      await mkdir(cliDir, { recursive: true });
      await writeFile(
        resolve(cliDir, 'plan.json'),
        JSON.stringify({ delay_ms: 0, commands: ['/plan', 'echo test'] }, null, 2),
        'utf-8'
      );

      const result = await executeSequence('plan', dir);

      expect(result.count).toBe(2);
    });
  });

  it('returns zero count when sequence is missing', async () => {
    await withTempDir('full-auto-cli-', async (dir) => {
      const result = await executeSequence('missing', dir);

      expect(result.count).toBe(0);
    });
  });
});
