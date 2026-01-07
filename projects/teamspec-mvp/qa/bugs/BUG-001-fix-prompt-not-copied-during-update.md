# BUG-001: Fix prompt not copied during teamspec update

## Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-001 |
| **Story** | S-001 |
| **Feature** | [F-007](../../features/F-007-auto-fix-agent-command.md) |
| **Severity** | High |
| **Priority** | P1 |
| **Status** | Open |
| **Reporter** | QA |
| **Assigned** | DEV |

---

## Classification

### Bug Type (REQUIRED - exactly one)

- [x] **Implementation Defect** (code doesn't match Canon)
- [ ] Canon Wrong (Canon doesn't match intent)
- [ ] Undocumented Behavior (not specified anywhere)

### Classification Rationale

Feature Canon F-007 states in **BR-007-002**:
> "The `fix.prompt.md` file MUST be **updated/regenerated** when the user runs `teamspec update`"

The implementation (`cli/lib/cli.js`) does NOT call `generateAllPrompts()` during the update command. The prompt files are only generated during `init`.

---

## Description

### Expected Behavior

**Source:** Feature Canon F-007, BR-007-002

When running `teamspec update`:
1. Core files updated (agents, templates, definitions, profiles)
2. Prompt files in `.github/prompts/` regenerated
3. `fix.prompt.md` created or updated

### Actual Behavior

When running `teamspec update`:
1. Core files updated ✓
2. copilot-instructions.md updated (if exists) ✓
3. **Prompt files NOT regenerated** ✗
4. **`fix.prompt.md` NOT created/updated** ✗

### Steps to Reproduce

1. Run `teamspec init --copilot yes` in a directory
2. Verify `fix.prompt.md` exists in `.github/prompts/`
3. Delete `fix.prompt.md` (simulating outdated installation)
4. Run `teamspec update`
5. Check `.github/prompts/` directory

**Result:** `fix.prompt.md` is NOT recreated

### Evidence

**Code Location:** `cli/lib/cli.js` lines 1034-1078

```javascript
// Handle update command
if (options.command === 'update') {
  // ...
  const coreResult = updateTeamspecCore(targetDir, sourceDir);

  // Update copilot instructions if they exist
  const copilotPath = path.join(targetDir, '.github', 'copilot-instructions.md');
  if (fs.existsSync(copilotPath)) {
    copyCopilotInstructions(targetDir, sourceDir);
  }

  // ❌ MISSING: generateAllPrompts(targetDir) call
  
  printUpdateSummary(coreResult);
}
```

The `generateAllPrompts()` function is only called in `setupIDEIntegration()` which is only invoked during `init`.

---

## Impact

- **User Impact:** Users who installed TeamSpec before F-007 will not receive the `ts:fix` command when updating
- **Business Impact:** New features requiring prompt files won't propagate to existing installations

---

## Resolution

### For Implementation Defect:

DEV fixes code to match Canon:

1. Add prompt regeneration to update command in `cli/lib/cli.js`
2. After `updateTeamspecCore()`, check if `.github/prompts/` exists
3. If prompts directory exists, call `generateAllPrompts(targetDir)` to regenerate
4. Add unit test for update + prompts regeneration

### Suggested Fix Location

```javascript
// After line 1073 in cli/lib/cli.js
const promptsDir = path.join(targetDir, '.github', 'prompts');
if (fs.existsSync(promptsDir)) {
  console.log(`\n${colored('Updating prompt files...', colors.blue)}`);
  const { generateAllPrompts } = require('./prompt-generator');
  const generatedFiles = generateAllPrompts(targetDir);
  console.log(`  ✓ Regenerated ${generatedFiles.length} prompt files`);
}
```

---

## Related

- Feature: [F-007-auto-fix-agent-command.md](../../features/F-007-auto-fix-agent-command.md)
- Story: [S-001-add-fix-command-to-prompt-generator.md](../../stories/backlog/S-001-add-fix-command-to-prompt-generator.md)
- Test Case: TC-003, TC-004 in [F-007-test-cases.md](../test-cases/F-007-test-cases.md)
