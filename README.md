# TeamSpec 2.0

> **Feature Canon Operating Model for AI-Assisted Software Delivery**

[![npm version](https://img.shields.io/npm/v/teamspec.svg)](https://www.npmjs.com/package/teamspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=teamspec.teamspec)

---

## What is TeamSpec?

TeamSpec is a **Feature Canon Operating Model** that brings structure and clarity to software delivery. It provides a framework where:

- 📚 **Feature Canon** is the single source of truth for system behavior
- 📝 **Stories are deltas** — describing changes, not duplicating documentation  
- 👥 **Roles have clear boundaries** — BA, FA, SA, DEV, QA, SM, DES
- 🤖 **AI agents understand context** — works with GitHub Copilot, Cursor, Claude, and more

```
                    ┌─────────────────────────────────────┐
                    │         Feature Canon               │
                    │   (Single Source of Truth)          │
                    └─────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
    ┌───────────┐            ┌───────────┐            ┌───────────┐
    │  Stories  │            │    ADRs   │            │ Decisions │
    │  (Deltas) │            │  (Tech)   │            │ (Business)│
    └───────────┘            └───────────┘            └───────────┘
```

---

## Quick Start

### Option 1: CLI (Recommended)

```bash
# Install globally
npm install -g teamspec

# Initialize in your repository
cd your-repo
teamspec
```

The CLI guides you through:
1. Team profile selection (startup, enterprise, regulated, etc.)
2. Organization and team configuration
3. Development cadence setup (scrum, kanban, scrumban)
4. Initial project creation

### Option 2: VS Code Extension

Install the **@teamspec** chat participant for GitHub Copilot:

```bash
# From the vscode-extension folder
npm install
npm run package
# Install the generated .vsix file
```

Then use natural language commands:
```
@teamspec /fa story F-042 Add password reset functionality
@teamspec /dev plan S-001
@teamspec /qa test F-042
```

### Option 3: Manual Setup

Copy the `.teamspec/` folder from your CLI installation into your repository.

---

## Core Concepts

### Feature Canon

The Feature Canon is the **authoritative source of truth** for what your system does. It lives in `/features/` and contains:

- **Feature files** (`F-001-user-authentication.md`) — Complete behavior specifications
- **Features index** — Registry of all features
- **Story ledger** — History of completed changes

```markdown
<!-- Example: F-001-user-authentication.md -->
# F-001: User Authentication

## Current Behavior
Users can log in with email/password...

## Business Rules
- BR-001: Passwords must be 8+ characters
- BR-002: Lock account after 5 failed attempts
```

### Stories as Deltas

Stories don't duplicate the Feature Canon — they describe **changes**:

```markdown
## Before (Current Behavior)
Reference: F-001, Section: Login Flow
Users can only log in with email/password.

## After (New Behavior)  
Users can also log in with Google OAuth.

## Acceptance Criteria
- [ ] Google OAuth button appears on login page
- [ ] Successful Google auth creates/links account
```

### Role Boundaries

| Role | Owns | Primary Commands |
|------|------|------------------|
| **BA** | Business value, scope, decisions | `ts:ba project`, `ts:ba feature` |
| **FA** | Feature Canon, stories, behavior | `ts:fa story`, `ts:fa slice` |
| **SA** | Architecture, ADRs, tech decisions | `ts:arch adr` |
| **DEV** | Implementation, dev plans | `ts:dev plan`, `ts:dev implement` |
| **QA** | Test cases, bugs, validation | `ts:qa test`, `ts:qa bug` |
| **SM** | Sprints, ceremonies, process | `ts:sm sprint`, `ts:sm planning` |
| **DES** | UX design, design artifacts | `ts:des wireframe` |

---

## Project Structure

After initialization, your repository will have:

```
your-repo/
├── .teamspec/                      # Framework core
│   ├── templates/                  # Document templates
│   ├── definitions/                # DoR/DoD checklists
│   ├── profiles/                   # Profile overlays
│   └── context/
│       └── team.yml                # Team configuration
│
├── projects/{project-id}/          # Project artifacts
│   ├── project.yml                 # Project metadata
│   ├── features/                   # 📚 Feature Canon
│   │   ├── F-001-*.md              # Feature files
│   │   ├── features-index.md       # Feature registry
│   │   └── story-ledger.md         # Story history
│   ├── stories/                    # 📝 Stories (deltas)
│   │   ├── backlog/                # New stories
│   │   ├── ready-to-refine/        # For refinement
│   │   └── ready-for-development/  # Sprint-ready
│   ├── adr/                        # Architecture decisions
│   ├── decisions/                  # Business decisions
│   ├── dev-plans/                  # Implementation plans
│   ├── qa/test-cases/              # Test documentation
│   ├── epics/                      # Epic definitions
│   └── sprints/                    # Sprint management
```

---

## AI Agent Integration

### VS Code / GitHub Copilot

The `@teamspec` chat participant understands your project context:

```
@teamspec /help                    # Show all commands
@teamspec /status                  # Project overview
@teamspec /fa story F-042 ...      # Create a story
@teamspec /dev plan S-001          # Plan implementation
@teamspec /feedback                # Report issues
```

### Other AI Assistants (Claude, ChatGPT, Cursor)

Use the agent prompts in `/agents/`:

1. Copy `AGENT_BOOTSTRAP.md` as system context
2. Add the role-specific agent (e.g., `AGENT_FA.md`)
3. Include your team context from `.teamspec/context/team.yml`

---

## Documentation

| Document | Purpose |
|----------|---------|
| [CLI README](cli/README.md) | CLI installation and commands |
| [Agents Guide](agents/README.md) | Role-based AI agent prompts |
| [Templates Guide](templates/README.md) | Document templates reference |
| [Roles & Responsibilities](roles/ROLES_AND_RESPONSIBILITIES.md) | Role boundaries and ownership |
| [Project Structure Reference](PROJECT_STRUCTURE_REFERENCE.md) | Detailed folder structure |

---

## Command Reference

### CLI Commands

```bash
teamspec                  # Interactive setup
teamspec --profile X      # Use specific profile
teamspec lint             # Validate project structure
teamspec lint --project X # Lint specific project
teamspec update           # Update TeamSpec core files
```

### Copilot Commands (with @teamspec)

| Command | Description |
|---------|-------------|
| `/ba project` | Create/manage projects |
| `/ba feature` | Extract features from requirements |
| `/fa story` | Create delta-based stories |
| `/fa slice` | Slice requirements into stories |
| `/arch adr` | Create architecture decisions |
| `/dev plan` | Create implementation plans |
| `/qa test` | Design test cases |
| `/sm sprint` | Sprint management |
| `/status` | Project health overview |
| `/feedback` | Report bugs or suggestions |

---

## Profiles

TeamSpec supports different team profiles:

| Profile | Characteristics |
|---------|-----------------|
| **startup** | Minimal process, fast iteration |
| **enterprise** | Full governance, compliance |
| **regulated** | Audit trails, formal approvals |
| **agency** | Multi-client, project-based |
| **opensource** | Community-driven, RFC-style |

Select during `teamspec init` or with `--profile`.

---

## Quality Gates

### Definition of Ready (DoR)

Before a story enters development:
- [ ] Linked to Feature Canon
- [ ] Before/After delta clearly described
- [ ] Acceptance Criteria are testable
- [ ] Estimate assigned

### Definition of Done (DoD)

Before a story is marked complete:
- [ ] All AC verified
- [ ] Code reviewed and merged
- [ ] Tests passing
- [ ] **Feature Canon updated** (if behavior changed)

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/teamspec/teamspec.git
cd teamspec

# CLI development
cd cli
npm install
npm test

# VS Code extension development
cd vscode-extension
npm install
npm run compile
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Links

- 📦 [npm package](https://www.npmjs.com/package/teamspec)
- 🐛 [Issue tracker](https://github.com/teamspec/teamspec/issues)
- 📖 [Documentation](https://github.com/teamspec/teamspec/wiki)

---

<p align="center">
  <strong>Built for teams who believe documentation should be a living asset, not a burden.</strong>
</p>
