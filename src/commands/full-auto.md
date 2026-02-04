---
description: Manage Full-Auto workflow
---

You must call the `full_auto` tool.
Choose the `action` based on the command text.

Valid actions:

- `init`
- `start`
- `stop`
- `run_once`

Mapping rules:

- If the input contains `init`, use `init`.
- If the input contains `start`, use `start`.
- If the input contains `stop`, use `stop`.
- If the input contains `run once` or `run-once`, use `run_once`.

Do not scaffold projects, ask for stacks, or run `/init`. This command only orchestrates Full-Auto.
If no valid action is provided, ask the user to pick one of the valid actions.
