import { executeSequence } from './cli-executor.ts';
import { readState } from './state.ts';
import type { WorkflowStatus } from './types.ts';

const UPDATE_STATE_SEQUENCE = 'update_state_status';

class Orchestrator {
  private isRunning: boolean = false;
  private stopRequested: boolean = false;
  private loopPromise: Promise<void> | null = null;

  async startLoop(): Promise<string> {
    if (this.isRunning) {
      return 'Full-Auto loop already running.';
    }

    this.isRunning = true;
    this.stopRequested = false;
    this.loopPromise = this.runLoop();

    return 'Full-Auto loop started.';
  }

  async stopLoop(): Promise<string> {
    if (!this.isRunning) {
      return 'Full-Auto loop is not running.';
    }

    this.stopRequested = true;

    if (this.loopPromise) {
      await this.loopPromise;
    }

    return 'Full-Auto stop requested.';
  }

  async runOnce(): Promise<string> {
    if (this.isRunning) {
      return 'Full-Auto loop already running.';
    }

    await this.executeCycle();
    return 'Full-Auto run-once completed.';
  }

  private async runLoop(): Promise<void> {
    try {
      while (!this.stopRequested) {
        await this.executeCycle();
      }
    } catch (error) {
      const message = error instanceof Error ? error.toString() : String(error);
      process.stderr.write(`[ERROR] Orchestrator loop failed: ${message}\n`);
    } finally {
      this.isRunning = false;
      this.loopPromise = null;
      this.stopRequested = false;
      process.stdout.write('Full-Auto loop stopped.\n');
    }
  }

  private async executeCycle(): Promise<void> {
    const currentState = await readState();
    const status: WorkflowStatus = currentState.status;
    process.stdout.write(`State: ${status}\n`);

    await executeSequence(status);
    await executeSequence(UPDATE_STATE_SEQUENCE);

    const updatedState = await readState();
    process.stdout.write(`Next state: ${updatedState.status}\n`);
  }
}

const orchestrator = new Orchestrator();

export { orchestrator };
