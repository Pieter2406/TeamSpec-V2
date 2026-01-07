# Dev Plan: S-001 & S-002 - Fix Command Implementation

> **Stories:** [S-001](../stories/backlog/S-001-add-fix-command-to-prompt-generator.md), [S-002](../stories/backlog/S-002-add-fix-command-to-readme-index.md)  
> **Feature:** [F-007](../features/F-007-auto-fix-agent-command.md)  
> **Author:** DEV  
> **Created:** 2026-01-08

---

## Summary

Add the `ts:fix` command to the prompt generator so that users can invoke auto-fix for linter errors via Copilot Chat.

---

## Tasks

### Task 1: Add `utility` role to COMMANDS object
**File:** `cli/lib/prompt-generator.js`  
**Effort:** 15 min  
**Status:** [x] Completed

Add new role definition:
```javascript
utility: {
    name: 'Utility',
    commands: [
        {
            name: 'fix',
            description: 'Auto-fix linter errors',
            prompt: `Auto-fix TeamSpec linter errors:
1. Run \`teamspec lint\` to identify errors
2. Review the linter output
3. Apply fixes for each error category
4. Re-run linter to verify fixes

Supports: TS-PROJ, TS-FEAT, TS-STORY, TS-ADR, TS-DEVPLAN, TS-DOD, TS-NAMING rules.`
        }
    ]
}
```

---

### Task 2: Add ROLE_TO_AGENT mapping for utility
**File:** `cli/lib/prompt-generator.js`  
**Effort:** 5 min  
**Status:** [x] Completed

Add to `ROLE_TO_AGENT`:
```javascript
utility: 'AGENT_FIX'
```

---

### Task 3: Update generatePromptFile for utility role naming
**File:** `cli/lib/prompt-generator.js`  
**Effort:** 10 min  
**Status:** [x] Completed

The current pattern generates `utility-fix.prompt.md` with command name `ts:utility-fix`. 

For cleaner UX, we want just `fix.prompt.md` with command name `ts:fix`.

**Option A:** Special-case utility commands to omit role prefix
**Option B:** Accept `ts:utility-fix` naming (consistent but verbose)

**Recommendation:** Option A - cleaner UX

---

### Task 4: Update README generation to include Utility section
**File:** `cli/lib/prompt-generator.js`  
**Effort:** 5 min  
**Status:** [x] Completed

README auto-generates from COMMANDS object, so Task 1 should handle this automatically.

Verify section appears:
```markdown
### Utility

- `/ts:fix` - Auto-fix linter errors
```

---

### Task 5: Write unit tests
**File:** `cli/test/prompt-generator.test.js`  
**Effort:** 20 min  
**Status:** [x] Completed

Add tests:
- [ ] `utility` role exists in COMMANDS
- [ ] `fix` command exists under utility
- [ ] `fix.prompt.md` is generated
- [ ] Fix prompt has correct frontmatter
- [ ] Fix prompt links to AGENT_FIX.md
- [ ] README includes Utility section
- [ ] README includes fix command

---

### Task 6: Manual verification
**Effort:** 10 min  
**Status:** [x] Completed

1. Run `teamspec init` in test directory
2. Verify `fix.prompt.md` generated
3. Verify README.md includes Utility section
4. Run all tests: `node --test test/*.test.js`

---

## Dependencies

| Dependency | Status |
|------------|--------|
| AGENT_FIX.md exists in teamspec-core/agents/ | ✅ Available |
| prompt-generator.js exists | ✅ Available |
| Test framework set up | ✅ Available |

---

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Naming inconsistency (utility-fix vs fix) | Medium | Decision: Use `ts:fix` (special case) |
| Test coverage gap | Low | Add comprehensive tests in Task 5 |

---

## Effort Summary

| Task | Estimate |
|------|----------|
| Task 1: Add utility role | 15 min |
| Task 2: Add ROLE_TO_AGENT | 5 min |
| Task 3: Update naming | 10 min |
| Task 4: Verify README | 5 min |
| Task 5: Write tests | 20 min |
| Task 6: Manual verify | 10 min |
| **Total** | **~1 hour** |

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All tests passing
- [ ] S-001 AC verified
- [ ] S-002 AC verified
- [ ] Feature Canon updated (if needed)
