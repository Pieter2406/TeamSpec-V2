# TeamSpec VS Code Extension

AI-powered chat participant for Feature Canon-driven software delivery.

## Features

The `@teamspec` chat participant provides role-based AI assistance for agile teams following the TeamSpec operating model.

### Slash Commands

#### Role Commands
| Command | Role | Purpose |
|---------|------|---------|
| `/ba` | Business Analyst | Projects, features, decisions |
| `/fa` | Functional Analyst | Stories, Canon sync, slicing |
| `/arch` | Solution Architect | ADRs, technical design |
| `/dev` | Developer | Dev plans, implementation |
| `/qa` | QA Engineer | Tests, bugs, UAT |
| `/sm` | Scrum Master | Sprints, ceremonies |
| `/des` | Designer | UX design, flows |

#### Quick Commands
| Command | Purpose |
|---------|---------|
| `/story` | Quick story creation |
| `/feature` | Quick feature creation |
| `/adr` | Quick ADR creation |
| `/bug` | Quick bug report |
| `/sprint` | Sprint operations |

#### Meta Commands
| Command | Purpose |
|---------|---------|
| `/status` | Project overview and health |
| `/context` | Show workspace context |
| `/help` | Show available commands |

### Usage Examples

```
@teamspec /fa story F-042 Add password reset functionality
@teamspec /dev plan S-001
@teamspec /qa test F-042
@teamspec /sm sprint status
@teamspec /ba feature New checkout flow
```

## Installation

### From VSIX (Local)

1. Build the extension:
   ```bash
   npm install
   npm run package
   ```

2. Install the generated `.vsix` file:
   - Open VS Code
   - Press `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
   - Select the `.vsix` file

### Via TeamSpec CLI

```bash
teamspec init --ide vscode
```

This will automatically install the TeamSpec extension.

## Configuration

### Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `teamspec.agentsPath` | string | "" | Path to TeamSpec agents folder |
| `teamspec.defaultRole` | enum | "FA" | Default role when none specified |
| `teamspec.enforceGates` | boolean | true | Enforce quality gates |

### Agent Files

The extension loads agent prompts from:
1. `.teamspec/agents/` in your workspace
2. `agents/` folder in your workspace
3. Bundled fallback prompts

## TeamSpec Philosophy

### Feature Canon
The Feature Canon (`/features/`) is the single source of truth for system behavior.

### Stories as Deltas
Stories describe CHANGES to the Canon, not complete behavior documentation.

### Role Boundaries
Each role has explicit ownership:
- **BA**: Business intent, Features, Decisions
- **FA**: Behavior specs, Stories, Canon sync
- **SA**: Technical design, ADRs
- **DEV**: Implementation, Dev plans
- **QA**: Verification, Test design
- **SM**: Sprint operations, Metrics
- **DES**: UX design, Design artifacts

### Quality Gates
- **Definition of Ready (DoR)**: Before development
- **Definition of Done (DoD)**: After completion
- **Canon Sync**: Canon must be updated before story is Done

## Development

### Building

```bash
npm install
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Testing

```bash
npm run test
```

### Packaging

```bash
npm run package
```

## License

MIT
