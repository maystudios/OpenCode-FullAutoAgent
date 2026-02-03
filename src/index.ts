import type { Plugin } from '@opencode-ai/plugin';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fullAutoTool } from './tools/full-auto.ts';
import { executeInit } from './commands/init.ts';
import { executeStart } from './commands/start.ts';
import { executeStop } from './commands/stop.ts';
import { executeRunOnce } from './commands/run-once.ts';

interface CommandFrontmatter {
  description?: string;
  agent?: string;
  model?: string;
  subtask?: boolean;
}

function parseFrontmatter(content: string): { frontmatter: CommandFrontmatter; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content.trim() };
  }

  const [, yamlContent, body] = match;
  const frontmatter: CommandFrontmatter = {};

  for (const line of yamlContent.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key === 'description') frontmatter.description = value;
    if (key === 'agent') frontmatter.agent = value;
    if (key === 'model') frontmatter.model = value;
    if (key === 'subtask') frontmatter.subtask = value === 'true';
  }

  return { frontmatter, body: body.trim() };
}

export const FullAutoPlugin: Plugin = async () => {
  const commandFile = new URL('./commands/full-auto.md', import.meta.url);
  const content = await readFile(fileURLToPath(commandFile), 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  return {
    tool: {
      full_auto: fullAutoTool,
    },
    async config(config) {
      config.command = config.command ?? {};
      const commandRegistry = config.command as Record<
        string,
        {
          template?: string;
          description?: string;
          agent?: string;
          model?: string;
          subtask?: boolean;
          execute?: () => Promise<string>;
        }
      >;

      // Register main orchestrator command
      commandRegistry['full-auto'] = {
        template: body,
        description: frontmatter.description,
        agent: frontmatter.agent,
        model: frontmatter.model,
        subtask: frontmatter.subtask,
      };

      // Register explicit CLI commands
      const initCommand = {
        description: 'Initialize Full-Auto project structure',
        execute: executeInit,
      };

      const startCommand = {
        description: 'Start the Full-Auto orchestration loop',
        execute: executeStart,
      };

      const stopCommand = {
        description: 'Stop the running Full-Auto loop',
        execute: executeStop,
      };

      const runOnceCommand = {
        description: 'Execute a single Full-Auto state cycle',
        execute: executeRunOnce,
      };

      commandRegistry['full-auto-init'] = initCommand;
      commandRegistry['full-auto-start'] = startCommand;
      commandRegistry['full-auto-stop'] = stopCommand;
      commandRegistry['full-auto-run-once'] = runOnceCommand;
      commandRegistry['full-auto init'] = initCommand;
      commandRegistry['full-auto start'] = startCommand;
      commandRegistry['full-auto stop'] = stopCommand;
      commandRegistry['full-auto run-once'] = runOnceCommand;
    },
  };
};
