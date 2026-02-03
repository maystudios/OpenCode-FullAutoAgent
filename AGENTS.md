<!-- FULL-AUTO-START -->
## Full-Auto State Definition
This section is managed by the Full-Auto plugin.

- **States:** pick_next, plan, implement, review, done
- **State File:** .opencode/full-auto/state.json
- **Rules:**
  1. Each state completes by updating the state file.
  2. The next state is determined by the current progress and AGENTS.md instructions.
<!-- FULL-AUTO-END -->

# AGENTS.md

## Build & Test Commands

- **Build**: `mise run build` or `bun build ./src/index.ts --outdir dist --target bun`
- **Test**: `mise run test` or `bun test`
- **Single Test**: `bun test BackgroundTask.test.ts` (use file glob pattern)
- **Watch Mode**: `bun test --watch`
- **Lint**: `mise run lint` (eslint)
- **Fix Lint**: `mise run lint:fix` (eslint --fix)
- **Format**: `mise run format` (prettier)

## Code Style Guidelines

### Imports & Module System

- Use ES6 `import`/`export` syntax (module: "ESNext", type: "module")
- Group imports: external libraries first, then internal modules
- Use explicit file extensions (`.ts`) for internal imports

### Formatting (Prettier)

- **Single quotes** (`singleQuote: true`)
- **Line width**: 100 characters
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 (no trailing commas in function parameters)
- **Semicolons**: enabled

### TypeScript & Naming

- **NeverNesters**: avoid deeply nested structures. Always exit early.
- **Strict mode**: enforced (`"strict": true`)
- **Classes**: PascalCase (e.g., `BackgroundTask`, `BackgroundTaskManager`)
- **Methods/properties**: camelCase
- **Status strings**: use union types (e.g., `'pending' | 'running' | 'completed' | 'failed' | 'cancelled'`)
- **Explicit types**: prefer explicit type annotations over inference
- **Return types**: optional (not required but recommended for public methods)

### Error Handling

- Check error type before accessing error properties: `error instanceof Error ? error.toString() : String(error)`
- Log errors with `[ERROR]` prefix for consistency
- Always provide error context when recording output

### Linting Rules

- `@typescript-eslint/no-explicit-any`: warn (avoid `any` type)
- `no-console`: error (minimize console logs)
- `prettier/prettier`: error (formatting violations are errors)

## Testing

- Framework: **vitest** with `describe` & `it` blocks
- Style: Descriptive nested test cases with clear expectations
- Assertion library: `expect()` (vitest)

## Memory

- Store temporary data in `.memory/` directory (gitignored)

## Project Context

- **Type**: ES Module package for OpenCode plugin system
- **Target**: Bun runtime, ES2021+
- **Purpose**: Background task execution and lifecycle management

## Project Concept & Source of Truth

- The authoritative project concept is defined in: `docs/concept.md`
- This document is the **single source of truth** for architecture, goals, and intended behavior
- When implementing features or making design decisions:
  - Always align with the concept document
  - If implementation diverges, the concept must be updated explicitly
- The concept document takes precedence over assumptions or legacy behavior

All agents must consult `docs/concept.md` before introducing new functionality or changing system behavior.

### Documentation Path Convention
- Canonical docs directory is `docs/` (lowercase).
- Do not read/write `Docs/` if `docs/` exists.
