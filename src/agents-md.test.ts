import { describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { injectAgentsHeader } from './agents-md.ts';

const withTempDir = async (prefix: string, run: (dir: string) => Promise<void>): Promise<void> => {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

describe('injectAgentsHeader', () => {
  it('creates AGENTS.md with header markers when missing', async () => {
    await withTempDir('full-auto-agents-', async (dir) => {
      await injectAgentsHeader(dir);

      const content = await readFile(resolve(dir, 'AGENTS.md'), 'utf-8');

      expect(content).toContain('<!-- FULL-AUTO-START -->');
      expect(content).toContain('<!-- FULL-AUTO-END -->');
      expect(content).toContain('Full-Auto State Definition');
    });
  });

  it('keeps existing content and remains idempotent', async () => {
    await withTempDir('full-auto-agents-', async (dir) => {
      await writeFile(resolve(dir, 'AGENTS.md'), 'User notes\n', 'utf-8');

      await injectAgentsHeader(dir);
      await injectAgentsHeader(dir);

      const content = await readFile(resolve(dir, 'AGENTS.md'), 'utf-8');
      const markers = content.match(/FULL-AUTO-START/g) ?? [];

      expect(markers.length).toBe(1);
      expect(content).toContain('User notes');
    });
  });
});
