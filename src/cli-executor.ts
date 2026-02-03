import { readFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { getCliPath } from './constants.ts';
import type { CliSequence } from './types.ts';

const execAsync = promisify(exec);

/**
 * Simple sleep helper using Promises
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a single command. If it starts with '/', it's treated as an OpenCode command
 * and printed to stdout. Otherwise, it's executed as a shell command.
 */
const runCommand = async (command: string): Promise<void> => {
  if (command.startsWith('/')) {
    process.stdout.write(`${command}\n`);
    return;
  }

  try {
    process.stdout.write(`[SHELL] Executing: ${command}\n`);
    const { stdout, stderr } = await execAsync(command);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`[ERROR] Shell command failed: ${message}\n`);
  }
};

/**
 * Executes a pre-defined CLI sequence from a JSON file.
 */
export const executeSequence = async (
  stateName: string,
  baseDir?: string
): Promise<{ count: number }> => {
  try {
    const cliPath = getCliPath(stateName, baseDir);
    const raw = await readFile(cliPath, 'utf-8');
    const sequence = JSON.parse(raw) as CliSequence;

    if (!sequence || !Array.isArray(sequence.commands)) {
      throw new Error(`Invalid sequence format in ${stateName}.json`);
    }

    const delay = sequence.delay_ms ?? 500;

    for (const command of sequence.commands) {
      await runCommand(command);
      await sleep(delay);
    }

    return { count: sequence.commands.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`[ERROR] Failed to execute sequence '${stateName}': ${message}\n`);
    return { count: 0 };
  }
};
