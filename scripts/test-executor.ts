import { executeSequence } from '../src/cli-executor.ts';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { FULL_AUTO_DIR, CLI_DIR, getCliPath } from '../src/constants.ts';

const run = async (): Promise<void> => {
  const testState = 'test-seq';
  const cliDir = `${process.cwd()}/${FULL_AUTO_DIR}/${CLI_DIR}`;
  const testFilePath = getCliPath(testState);

  const testData = {
    delay_ms: 100,
    commands: ['echo "Hello"', 'echo "World"', '/test-command'],
  };

  try {
    // Setup test file
    await mkdir(cliDir, { recursive: true });
    await writeFile(testFilePath, JSON.stringify(testData, null, 2), 'utf-8');

    process.stdout.write(`Testing sequence: ${testState}\n`);
    const result = await executeSequence(testState);

    if (result.count !== testData.commands.length) {
      process.stderr.write(
        `[ERROR] Expected ${testData.commands.length} commands, got ${result.count}\n`
      );
      process.exitCode = 1;
    } else {
      process.stdout.write('SUCCESS: Sequence executed correctly\n');
    }

    // Cleanup
    await rm(testFilePath);
  } catch (error) {
    const message = error instanceof Error ? error.toString() : String(error);
    process.stderr.write(`[ERROR] Executor test failed: ${message}\n`);
    process.exitCode = 1;
  }
};

void run();
