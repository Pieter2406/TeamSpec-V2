# Test Cases: F-007 - Auto-Fix Agent Command

## Metadata

| Field | Value |
|-------|-------|
| **Feature** | [F-007](../../features/F-007-auto-fix-agent-command.md) |
| **Version** | 1.0 |
| **Last Updated** | 2026-01-08 |
| **Author** | QA |

---

## Test Coverage Matrix

| Business Rule | Test Cases | Automated |
|---------------|------------|-----------|
| BR-007-001 | TC-001, TC-002 | Yes |
| BR-007-002 | TC-003, TC-004 | Yes |
| BR-007-003 | TC-005, TC-006 | Yes |
| BR-007-004 | TC-007 | Manual |
| BR-007-005 | TC-008 | Manual |
| BR-007-006 | TC-009 | Yes |

---

## Test Cases

### TC-001: Fix prompt generated during init (VS Code)

**Covers:** BR-007-001  
**Type:** Happy Path

**Preconditions:**
- Empty directory with no `.github/prompts/`
- TeamSpec CLI installed

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Run `teamspec init --copilot yes` | Init completes successfully |
| 2 | Check `.github/prompts/` directory | `fix.prompt.md` exists |
| 3 | Verify file content | Contains valid YAML frontmatter |

**Postconditions:**
- `fix.prompt.md` present in `.github/prompts/`

**Automation Status:** Automated (prompt-generator.test.js)

---

### TC-002: Fix prompt generated during init (Cursor)

**Covers:** BR-007-001  
**Type:** Happy Path

**Preconditions:**
- Empty directory
- TeamSpec CLI installed

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Run `teamspec init --copilot cursor` | Init completes successfully |
| 2 | Check `.github/prompts/` directory | `fix.prompt.md` exists |

**Postconditions:**
- Cursor-compatible prompt file present

**Automation Status:** Automated

---

### TC-003: Fix prompt regenerated during update

**Covers:** BR-007-002  
**Type:** Happy Path

**Preconditions:**
- Existing TeamSpec installation
- `fix.prompt.md` exists but is outdated

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Modify `fix.prompt.md` content | File changed |
| 2 | Run `teamspec update` | Update completes |
| 3 | Check `fix.prompt.md` content | File restored to current version |

**Postconditions:**
- Prompt file matches latest template

**Automation Status:** Automated

---

### TC-004: Fix prompt created if missing during update

**Covers:** BR-007-002  
**Type:** Edge Case

**Preconditions:**
- Existing TeamSpec installation
- `fix.prompt.md` deleted

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Delete `fix.prompt.md` | File removed |
| 2 | Run `teamspec update` | Update completes |
| 3 | Check `.github/prompts/` | `fix.prompt.md` recreated |

**Postconditions:**
- Missing prompt file restored

**Automation Status:** Automated

---

### TC-005: Fix prompt links to AGENT_FIX.md

**Covers:** BR-007-003  
**Type:** Happy Path

**Preconditions:**
- TeamSpec initialized

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `fix.prompt.md` content | File readable |
| 2 | Search for AGENT_FIX.md link | Contains `../../.teamspec/agents/AGENT_FIX.md` |

**Postconditions:**
- Link path is correct relative path

**Automation Status:** Automated (prompt-generator.test.js)

---

### TC-006: AGENT_FIX.md exists in shipped agents

**Covers:** BR-007-003  
**Type:** Happy Path

**Preconditions:**
- TeamSpec initialized

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Check `.teamspec/agents/` | Directory exists |
| 2 | Verify AGENT_FIX.md | File present |
| 3 | Verify file not empty | Has content > 100 bytes |

**Postconditions:**
- Agent file available for prompt linking

**Automation Status:** Automated

---

### TC-007: Fix command requires linter output

**Covers:** BR-007-004  
**Type:** Happy Path

**Preconditions:**
- TeamSpec initialized
- Project with linter errors

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Copilot Chat | Chat opens |
| 2 | Type `/ts:fix` | Agent responds |
| 3 | Verify agent asks for linter output | Requests `teamspec lint` results |

**Postconditions:**
- Fix agent guides user to run linter first

**Automation Status:** Manual

---

### TC-008: Fix does not auto-modify without confirmation

**Covers:** BR-007-005  
**Type:** Safety

**Preconditions:**
- TeamSpec initialized
- Linter errors present

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Run `teamspec lint` | Errors displayed |
| 2 | Invoke `/ts:fix` | Agent proposes fixes |
| 3 | Verify agent waits for approval | Does not modify files automatically |

**Postconditions:**
- User has control over applied changes

**Automation Status:** Manual

---

### TC-009: README includes fix command in Utility section

**Covers:** BR-007-006  
**Type:** Happy Path

**Preconditions:**
- TeamSpec initialized

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `.github/prompts/README.md` | File exists |
| 2 | Search for "Utility" section | Section present |
| 3 | Search for `ts:fix` | Command listed |
| 4 | Verify description | "Auto-fix linter errors" present |

**Postconditions:**
- Fix command discoverable in README

**Automation Status:** Automated (prompt-generator.test.js)

---

### TC-010: Fix prompt has correct frontmatter

**Covers:** BR-007-001, BR-007-003  
**Type:** Happy Path

**Preconditions:**
- TeamSpec initialized

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `fix.prompt.md` | File readable |
| 2 | Parse YAML frontmatter | Valid YAML |
| 3 | Check `name` field | Equals `ts:fix` |
| 4 | Check `description` field | Contains "Auto-fix" |
| 5 | Check `agent` field | Equals `agent` |

**Postconditions:**
- Frontmatter follows VS Code Copilot prompt format

**Automation Status:** Automated (prompt-generator.test.js)

---

### TC-011: Fix prompt mentions supported rule categories

**Covers:** In Scope item 6  
**Type:** Documentation

**Preconditions:**
- TeamSpec initialized

**Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `fix.prompt.md` content | File readable |
| 2 | Search for rule categories | Contains TS-PROJ, TS-FEAT, TS-STORY |

**Postconditions:**
- Users know what rules can be fixed

**Automation Status:** Automated (prompt-generator.test.js)

---

## Edge Cases

### EC-001: Init without IDE integration

**Scenario:** User runs `teamspec init` without `--copilot` flag  
**Expected:** No prompt files generated (correct behavior)  
**Canon Reference:** BR-007-001 - "for supported IDEs"

### EC-002: Multiple inits overwrite prompts

**Scenario:** User runs `teamspec init` twice  
**Expected:** Prompts regenerated, not duplicated  
**Canon Reference:** BR-007-001

### EC-003: Invalid prompt directory permissions

**Scenario:** `.github/prompts/` is read-only  
**Expected:** Error message, graceful failure  
**Canon Reference:** Error handling

---

## Not Tested (Documented Exclusions)

- **Automatic fix without user invocation** — Out of scope per F-007
- **CI/CD integration** — Out of scope per F-007
- **Batch fixing across projects** — Out of scope per F-007
- **Undo/rollback of fixes** — Out of scope per F-007

---

## Traceability

| Test Case | Story | Automated Test |
|-----------|-------|----------------|
| TC-001 | S-001 | `fix.prompt.md is generated` |
| TC-002 | S-001 | `fix.prompt.md is generated` |
| TC-003 | S-001 | Manual verification |
| TC-004 | S-001 | Manual verification |
| TC-005 | S-001 | `fix prompt links to AGENT_FIX.md` |
| TC-006 | S-001 | File existence check |
| TC-007 | S-001 | Manual |
| TC-008 | S-001 | Manual |
| TC-009 | S-002 | `README includes fix command` |
| TC-010 | S-001 | `fix prompt has correct frontmatter` |
| TC-011 | S-001 | `fix prompt mentions supported rule categories` |
