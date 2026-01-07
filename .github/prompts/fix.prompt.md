---
name: "ts:fix"
description: "TeamSpec Utility: Auto-fix linter errors"
agent: "agent"
---

# Auto-fix linter errors

Execute the **fix** workflow as a **Utility**.

See full role instructions: [AGENT_FIX.md](../../.teamspec/agents/AGENT_FIX.md)

## Quick Reference

Auto-fix TeamSpec linter errors:
1. Run `teamspec lint` to identify errors
2. Review the linter output
3. Apply fixes for each error category
4. Re-run linter to verify fixes

Supports: TS-PROJ, TS-FEAT, TS-STORY, TS-ADR, TS-DEVPLAN, TS-DOD, TS-NAMING rules.
