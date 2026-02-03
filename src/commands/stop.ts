import { orchestrator } from '../orchestrator.ts';

const executeStop = async (): Promise<string> => {
  return orchestrator.stopLoop();
};

export { executeStop };
