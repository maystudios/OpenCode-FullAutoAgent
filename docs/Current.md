state: implement
active_batch: B-04 Finalization & Testing
milestones_done: [M1, M2, M3]
milestones_next: []
next_command: /next-review
changed_files:

- src/constants.ts (baseDir option for paths to isolate tests)
- src/state.ts (read/write accept baseDir)
- src/cli-executor.ts (executeSequence accepts baseDir)
- src/agents-md.ts (injectAgentsHeader accepts baseDir)
- src/state.test.ts (temp dir per test, no global cwd)
- src/cli-executor.test.ts (temp dir per test, baseDir usage)
- src/agents-md.test.ts (temp dir per test, baseDir usage)
- src/orchestrator.test.ts (spy-based mocks to avoid global module mocks)
- docs/Plan-Next-Task.md (progress/notes updated after fixing tests)
- docs/Current.md (refreshed status, files, and test results)
- src/commands/init.ts (write checklist in .opencode/full-auto)
- src/templates/commands.ts (pick_next checklist path updated)
- src/index.ts (command aliases for full-auto init/start/stop/run-once)
- src/tools/full-auto.ts (tool import uses explicit subpath)
- docs/testing.md (test fallback and command aliases)
- README.md (project README rewritten)
- docs/Checklist.md (T-10 marked done)
  tests:
- build: not run
- test: passed (npx vitest run)
- lint: not run
  blockers:
- none
