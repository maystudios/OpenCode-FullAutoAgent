import { orchestrator } from '../orchestrator.ts';

const executeRunOnce = async (): Promise<string> => {
  return orchestrator.runOnce();
};

export { executeRunOnce };
