import { readState, writeState } from '../src/state.ts';

const run = async (): Promise<void> => {
  const nextState = {
    status: 'plan' as const,
    lastUpdated: new Date().toISOString(),
    activeTask: 'T-04',
  };

  try {
    await writeState(nextState);
    const readBack = await readState();

    if (readBack.status !== nextState.status || readBack.activeTask !== nextState.activeTask) {
      process.stderr.write('[ERROR] State roundtrip mismatch\n');
      process.exitCode = 1;
      return;
    }

    process.stdout.write('SUCCESS\n');
  } catch (error) {
    const message = error instanceof Error ? error.toString() : String(error);
    process.stderr.write(`[ERROR] State test failed: ${message}\n`);
    process.exitCode = 1;
  }
};

void run();
