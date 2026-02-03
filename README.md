# OpenCode Full-Auto Plugin

Automates a simple, repeatable CLI workflow inside OpenCode. The plugin initializes a project-local state machine, executes per-state CLI sequences, and keeps the workflow state in a single JSON file. Everything is editable: commands, CLI sequences, and state rules.

## What It Does

- Initializes a `.opencode/full-auto` workspace with commands, CLI sequences, and state.
- Runs a fixed workflow loop: `pick_next → plan → implement → review → done`.
- Executes CLI sequences for each state and then runs a lightweight `update_state_status` step.
- Stores the current state in `.opencode/full-auto/state.json`.
- Inserts a managed header block at the top of `AGENTS.md` to define the state rules.

## Commands

The plugin registers two styles of commands (both work):

- `full-auto init` / `full-auto start` / `full-auto stop` / `full-auto run-once`
- `full-auto-init` / `full-auto-start` / `full-auto-stop` / `full-auto-run-once`

## Initialized Structure

`full-auto init` creates:

```
.opencode/full-auto/
  state.json
  checklist.md

  commands/
    pick_next.md
    plan.md
    implement.md
    review.md
    done.md
    update_state_status.md

  cli/
    pick_next.json
    plan.json
    implement.json
    review.json
    done.json
    update_state_status.json
```

It also creates/updates `AGENTS.md` and writes a managed header block that defines valid states and how transitions are decided.

## How It Works

1. Read the current state from `.opencode/full-auto/state.json`.
2. Execute the CLI sequence for that state.
3. Execute `update_state_status` (fast model) to update `state.json`.
4. Repeat until stopped.

The CLI sequences are simple JSON files containing a delay and a list of commands.

Example `cli/plan.json`:

```json
{
  "delay_ms": 800,
  "commands": ["/exit", "opencode --model gpt-5", "/plan"]
}
```

## Installation

### Prerequisites

- [OpenCode CLI](https://opencode.ai) installed and configured
- Node.js 18+ or Bun runtime

### Option 1: Install from npm (recommended)

```bash
npm install -g fullautoagent
```

Or with your preferred package manager:

```bash
pnpm add -g fullautoagent
yarn global add fullautoagent
bun add -g fullautoagent
```

### Option 2: Install from source

```bash
git clone https://github.com/maystudios/OpenCode-FullAutoAgent.git
cd OpenCode-FullAutoAgent
npm install
npm run build
npm link
```

### Enable the Plugin in OpenCode

Create or edit your OpenCode config file at `~/.config/opencode/config.json`:

```json
{
  "plugins": ["fullautoagent"]
}
```

### Initialize in Your Project

Navigate to your project directory and run:

```bash
opencode
```

Then inside OpenCode:

```
/full-auto init
```

This creates the `.opencode/full-auto/` workspace with all default templates.

### Usage

| Command               | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `/full-auto init`     | Initialize the workflow structure in current project |
| `/full-auto start`    | Start the automated workflow loop                    |
| `/full-auto stop`     | Stop the running loop after current cycle            |
| `/full-auto run-once` | Execute a single workflow cycle                      |

### Customization

After init, edit the files in `.opencode/full-auto/` to customize:

- **commands/\*.md** - Prompt templates for each workflow step
- **cli/\*.json** - CLI sequences (delays, model selection, command order)
- **checklist.md** - Your project task backlog
- **state.json** - Current workflow state (usually managed automatically)

## Development

Build and tooling:

- `mise run build`
- `mise run test`
- `mise run lint`
- `mise run lint:fix`
- `mise run format`

Testing fallback if `mise` or `bun` is unavailable:

- `npx vitest run`

Note: the tool import uses the explicit subpath `@opencode-ai/plugin/tool` to avoid missing re-exports in some installs.

## Project Context

The authoritative project concept lives in `docs/concept.md` and should be updated if behavior changes.

## License

MIT License. See `LICENSE`.
