import { resolve } from 'node:path';

const FULL_AUTO_DIR = '.opencode/full-auto';
const STATE_FILE = 'state.json';
const CLI_DIR = 'cli';
const COMMANDS_DIR = 'commands';

const getFullAutoPath = (baseDir: string = process.cwd()): string => {
  return resolve(baseDir, FULL_AUTO_DIR);
};

const getStatePath = (baseDir: string = process.cwd()): string => {
  return resolve(getFullAutoPath(baseDir), STATE_FILE);
};

const getCliPath = (stateName: string, baseDir: string = process.cwd()): string => {
  return resolve(getFullAutoPath(baseDir), CLI_DIR, `${stateName}.json`);
};

const getCommandPath = (stateName: string, baseDir: string = process.cwd()): string => {
  return resolve(getFullAutoPath(baseDir), COMMANDS_DIR, `${stateName}.md`);
};

export {
  FULL_AUTO_DIR,
  STATE_FILE,
  CLI_DIR,
  COMMANDS_DIR,
  getFullAutoPath,
  getStatePath,
  getCliPath,
  getCommandPath,
};
