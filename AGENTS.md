
---

## Production Deployment Safety

This repository auto-deploys to production after every push.

Because pushes go live automatically:
- never make broad refactors without explicit instruction
- prefer small scoped edits
- always verify build/lint before finishing
- always explain files changed
- always highlight deployment risk for structural changes
- for risky tasks, propose the plan before implementation
- update docs after any deployment/process change
