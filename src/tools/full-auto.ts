import { tool } from '@opencode-ai/plugin/tool';
import { executeInit } from '../commands/init.ts';
import { executeRunOnce } from '../commands/run-once.ts';
import { executeStart } from '../commands/start.ts';
import { executeStop } from '../commands/stop.ts';

type FullAutoAction = 'init' | 'start' | 'stop' | 'run_once';

const actionSchema = tool.schema.enum(['init', 'start', 'stop', 'run_once']);

const fullAutoTool = tool({
  description: 'Execute Full-Auto workflow actions',
  args: {
    action: actionSchema.describe('Action to run for Full-Auto'),
    args: tool.schema.string().optional().describe('Optional action arguments'),
  },
  async execute({ action }) {
    if (action === 'init') {
      return executeInit();
    }

    if (action === 'start') {
      return executeStart();
    }

    if (action === 'stop') {
      return executeStop();
    }

    return executeRunOnce();
  },
});

export { fullAutoTool };
export type { FullAutoAction };
