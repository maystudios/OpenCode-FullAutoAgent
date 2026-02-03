import { orchestrator } from '../orchestrator.ts';

const executeStart = async (): Promise<string> => {
  return orchestrator.startLoop();
};

export { executeStart };
