export const PICK_NEXT_TEMPLATE = `---
description: "Workflow Step 1: Pick the next task from the checklist"
---
# Pick Next Task
Please analyze the checklist in .opencode/full-auto/checklist.md and identify the next logical task to work on.
Consider dependencies, impact, and what unblocks the most work.
Update docs/Current.md to reflect the chosen task and next command.
`;

export const PLAN_TEMPLATE = `---
description: "Workflow Step 2: Plan the implementation of the selected task"
---
# Plan Task
Create a detailed plan for the active task in docs/Plan-Next-Task.md.
Define architecture, milestones, implementation steps, and acceptance criteria.
Align with docs/Concept.md as the source of truth.
`;

export const IMPLEMENT_TEMPLATE = `---
description: "Workflow Step 3: Implement the planned changes"
---
# Implement Task
Execute the plan defined in docs/Plan-Next-Task.md.
Write code, run tests, and ensure everything follows project conventions.
Update docs/Current.md with progress and test results.
`;

export const REVIEW_TEMPLATE = `---
description: "Workflow Step 4: Review and verify the implementation"
---
# Review Task
Verify the implementation against the acceptance criteria.
Run final tests and linters.
Update the checklist status.
`;

export const DONE_TEMPLATE = `---
description: "Workflow Step 5: Finalize the task and prepare for the next loop"
---
# Task Done
The task is completed. Clean up any temporary files.
The next step will be picking the next task.
`;

export const UPDATE_STATE_STATUS_TEMPLATE = `---
description: "Internal: Update the workflow state in state.json"
---
# Update Workflow State
Analyze the current progress and update .opencode/full-auto/state.json with the next state.
Use only valid states and strictly follow the rules defined in AGENTS.md.
`;
