import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const START_MARKER = '<!-- FULL-AUTO-START -->';
const END_MARKER = '<!-- FULL-AUTO-END -->';

const DEFAULT_HEADER = `
## Full-Auto State Definition
This section is managed by the Full-Auto plugin.

- **States:** pick_next, plan, implement, review, done
- **State File:** .opencode/full-auto/state.json
- **Rules:**
  1. Each state completes by updating the state file.
  2. The next state is determined by the current progress and AGENTS.md instructions.
`;

export const injectAgentsHeader = async (baseDir: string = process.cwd()): Promise<void> => {
  const agentsPath = resolve(baseDir, 'AGENTS.md');
  let content = '';

  try {
    content = await readFile(agentsPath, 'utf-8');
  } catch (error) {
    // If AGENTS.md doesn't exist, we start with a clean slate
    content = '# Project Agents\n';
  }

  const header = `${START_MARKER}\n${DEFAULT_HEADER.trim()}\n${END_MARKER}`;

  const startIndex = content.indexOf(START_MARKER);
  const endIndex = content.indexOf(END_MARKER);

  let newContent: string;

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    // Replace existing block
    newContent =
      content.slice(0, startIndex) + header + content.slice(endIndex + END_MARKER.length);
  } else {
    // Insert at beginning (after any potential shebang or initial title)
    newContent = `${header}\n\n${content}`;
  }

  await writeFile(agentsPath, newContent, 'utf-8');
};
