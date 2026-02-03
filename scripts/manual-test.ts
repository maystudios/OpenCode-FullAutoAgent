import { fullAutoTool } from '../src/tools/full-auto.ts';

const run = async (): Promise<void> => {
  try {
    const result = await fullAutoTool.execute({ action: 'init', args: undefined });
    process.stdout.write(`${result}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.toString() : String(error);
    process.stderr.write(`[ERROR] Manual test failed: ${message}\n`);
    process.exitCode = 1;
  }
};

void run();
