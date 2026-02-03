# Testing Guide

This document describes how to validate the Full-Auto plugin.

## Automated Tests

Run the unit and integration tests:

```sh
mise run test
```

If `mise` is not available:

```sh
bun test
```

If `bun` is also unavailable:

```sh
npx vitest run
```

## Build Validation

Ensure the project builds successfully:

```sh
mise run build
```

Fallback:

```sh
bun build ./src/index.ts --outdir dist --target bun
```

## Manual End-to-End Validation

1. Initialize the project structure:
   - Run `full-auto init` (or `full-auto-init`)
   - Verify `.opencode/full-auto/` is created with `state.json`, `commands/`, and `cli/`

2. Run a single cycle:
   - Run `full-auto run-once` (or `full-auto-run-once`)
   - Confirm the current state sequence and `update_state_status` are executed

3. Start and stop the loop:
   - Run `full-auto start` (or `full-auto-start`)
   - Wait for at least one state transition
   - Run `full-auto stop` (or `full-auto-stop`)
   - Verify the loop stops after the current cycle

4. Validate state updates:
   - Check `.opencode/full-auto/state.json` for updated `status` and `lastUpdated`

## Troubleshooting

- If commands do not execute, confirm the CLI JSON files in `.opencode/full-auto/cli/`.
- If state updates fail, check `AGENTS.md` header markers.
- Ensure shell commands in CLI sequences are non-interactive.
