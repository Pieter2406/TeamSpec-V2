# BA-001: Team-Specific Configuration Analysis

> **Analysis of:** [EPIC-001](../epics/EPIC-001-team-specific-configuration.md)  
> **Author:** Business Analyst  
> **Date:** 2026-01-08  
> **Status:** Planning

---

## Executive Summary

TeamSpec is currently a generic framework requiring teams to adapt their practices to its model. This analysis identifies the business opportunity to reverse this: enable teams to configure TeamSpec to match their existing organizational context. This transformation unlocks enterprise adoption, reduces training friction, and increases ROI.

**Key Insight:** The problem is not that TeamSpec is poorly designed—it's that one-size-fits-all doesn't fit any organization perfectly.

---

## Current State (As-Is)

### Today's User Experience

#### Onboarding Pain Points
1. **Team encounters TeamSpec for the first time**
   - Must learn new terminology (Feature Canon, stories, artifacts)
   - Must adopt unfamiliar role definitions
   - Must follow pre-defined workflow structure
   - **Friction:** High resistance from existing teams

2. **Implementation challenges**
   - Cannot customize roles to match existing titles
   - Cannot adapt workflow to existing process
   - Cannot enforce team-specific standards
   - **Result:** Teams create workarounds, defeating the purpose

3. **Adoption decision**
   - Teams compare cost of learning vs. cost of maintaining separate processes
   - Without customization, cost is high
   - **Outcome:** Adoption fails or becomes superficial

### Current Stakeholders & Pain Points

| Stakeholder | Current Pain Point | Impact |
|-------------|-------------------|--------|
| **Team Leads** | Cannot customize roles | High onboarding friction |
| **Engineering Managers** | No way to enforce team standards | Standards ignored or sidestepped |
| **Enterprise CTO** | One-size-fits-all | Cannot deploy across departments |
| **TeamSpec Maintainers** | High support burden | Support requests for custom adapting |

### Existing Configuration Mechanisms

- ❌ No team context configuration
- ❌ No role customization
- ❌ No tech stack templates
- ❌ No custom DoR/DoD
- ❌ No branching strategy definition
- ❌ No linter-enforced team standards

**Current State Summary:** Generic framework requiring teams to conform. No adoption in production environments.

---

## Future State (To-Be)

### What Success Looks Like

#### Onboarding Flow (New)

1. **Team runs `teamspec init`**
   - Configures team context (size, structure, location)
   - Selects or creates role definitions
   - Defines tech stack
   - Specifies branching strategy
   - Customizes DoR and DoD
   - **Result:** In < 30 minutes, TeamSpec matches team reality

2. **First week**
   - Team creates first epic with proper team context
   - Linter validates against team's own standards
   - Agents use team context in prompts
   - **Result:** No friction, immediate value

3. **Ongoing**
   - Team can update configuration as needed
   - Linter enforces team standards
   - All artifacts reflect team context
   - **Result:** TeamSpec becomes team's operating system, not external tool

### Configuration Domains

#### 1. Team Context
- Team name, size, structure
- Role mapping (e.g., "Architect" = "Solution Architect")
- Workflow customization
- Location/timezone considerations

#### 2. Technical Standards
- Tech stack (languages, frameworks)
- Architecture patterns
- Branching strategy (Git flow, trunk-based, etc.)
- Testing strategy (unit, integration, e2e requirements)

#### 3. Quality Gates
- Custom Definition of Ready
- Custom Definition of Done
- Team-specific acceptance criteria patterns
- Risk assessment criteria

#### 4. Enforcement
- Linter validates team-specific standards
- Agent prompts include team context
- CLI tools use team configuration
- Templates adapt to team context

### Expected Stakeholder Benefits

| Stakeholder | Future State | Benefit |
|-------------|--------------|---------|
| **Team Leads** | Choose roles that match team titles | Immediate recognition and adoption |
| **Engineering Managers** | Linter enforces team standards | Standards are validated on every artifact |
| **Enterprise CTO** | Deploy across 10+ teams with different configs | Scalable, enterprise-ready solution |
| **TeamSpec Maintainers** | One-time configuration vs. ongoing support | Reduced support burden, scales to many teams |

---

## Business Process: Team Configuration Workflow

### As-Is Process
```
Team wants to use TeamSpec
  ↓
Learn generic framework
  ↓
Adapt existing practices to match
  ↓
Implementation struggle
  ↓
Abandon or superficial adoption
```

### To-Be Process
```
Team wants to use TeamSpec
  ↓
Run: teamspec init --interactive
  ↓
Answer configuration questions
  ↓
teamspec generates .teamspec/ with team-specific config
  ↓
First artifact: Team context reflects real organization
  ↓
Linter validates team standards automatically
  ↓
Agent prompts include team context in suggestions
  ↓
Full adoption, production-ready from day one
```

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| **Onboarding Time** | 2+ hours | < 30 minutes | Time from init to first story |
| **Team Adoption** | 0 teams | 10+ teams | Teams using in production |
| **Standards Enforcement** | 0% | 100% | Linter rule coverage |
| **Team Satisfaction** | N/A | > 8/10 | NPS from pilot teams |
| **Support Burden** | High | Low | Support requests per team |

---

## Candidate Features

These features will implement the team-specific configuration capability:

1. **[F-001: Team Context Configuration](../features/F-001-team-context.md)**
   - Teams define organization structure, roles, workflow
   - Configuration stored in `.teamspec/config.yml`

2. **[F-002: Tech Stack Documentation](../features/F-002-tech-stack.md)**
   - Teams document their technical standards
   - Templates adapt to specified stack

3. **[F-003: Branching Strategy Configuration](../features/F-003-branching-strategy.md)**
   - Teams define their branching model
   - Linter validates commit messages/PR structure

4. **[F-004: Testing Strategy Framework](../features/F-004-testing-strategy.md)**
   - Teams specify testing requirements
   - Story templates include testing acceptance criteria

5. **[F-005: Custom Definition of Ready](../features/F-005-custom-dor.md)**
   - Teams customize what "ready-to-develop" means
   - Linter validates stories against custom DoR

6. **[F-006: Custom Definition of Done](../features/F-006-custom-dod.md)**
   - Teams customize what "done" means
   - Linter validates completion against custom DoD

---

## Related Artifacts

### Key Decisions Needed

| Decision | Options | Recommended |
|----------|---------|-------------|
| **Config Format** | YAML, JSON, interactive prompts | YAML + interactive init |
| **Config Location** | `.teamspec/` vs. root | `.teamspec/config.yml` |
| **Role Definition** | Hardcoded vs. custom mapping | Custom mapping with defaults |
| **Validation Timing** | Init-time vs. lint-time | Both: init validates syntax, lint validates content |

### Implementation Risks & Constraints

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| **Configuration complexity** | High | Start with interactive init, provide sensible defaults |
| **Teams ignore customization** | Medium | Training + templates that demonstrate value |
| **Inconsistent across teams** | Medium | Linter validates, enterprise guidelines docs |
| **Maintenance burden** | Medium | Automated tests for all configuration scenarios |

### Dependencies

- ✅ [AGENT_BA.md](../../agents/AGENT_BA.md) - Business analysis guidance
- ✅ [PROJECT_STRUCTURE.yml](../../PROJECT_STRUCTURE.yml) - Canonical folder structure
- ✅ [teamspec init CLI](../../cli/) - Existing initialization mechanism
- 🔄 Feature files (F-001 through F-006) - Must be created before development

---

## Next Steps

### Immediate (Week 1)
1. ✅ Create feature files for F-001 through F-006
2. ✅ Define default configurations for common team types (startup, enterprise, platform)
3. ✅ Create interactive init flow mockups

### Short-term (Weeks 2-3)
1. Refine features based on stakeholder feedback
2. Create configuration schema and validation rules
3. Design linter integration for team-specific standards

### Medium-term (Weeks 4-6)
1. Implement F-001 (Team Context Configuration)
2. Implement F-002 (Tech Stack Documentation)
3. Pilot with 2-3 internal teams

---

## Approval & Sign-off

| Role | Status | Date |
|------|--------|------|
| **Business Analyst** | ✅ Approved | 2026-01-08 |
| **Product Manager** | ⏳ Pending | — |
| **Engineering Lead** | ⏳ Pending | — |

---

## Appendix: Team Configuration Example

### Sample `.teamspec/config.yml` (To-Be)
```yaml
team:
  name: "Backend Platform"
  size: 8
  locations: ["San Francisco", "Austin"]

roles:
  mapping:
    "Product Owner": "BA"
    "Tech Lead": "SA"
    "Engineers": "DEV"
    "QA Lead": "QA"

tech_stack:
  language: "TypeScript"
  framework: "Node.js/Express"
  testing: "Jest"
  database: "PostgreSQL"
  ci_cd: "GitHub Actions"

branching_strategy:
  model: "trunk-based"
  protected_branches: ["main"]
  pr_required: true
  approval_required: 2

quality_gates:
  dor:
    - "Linked to Feature Canon"
    - "Estimate assigned (story points)"
    - "AC written in Given-When-Then format"
  dod:
    - "Code reviewed by peer"
    - "All tests passing (unit + integration)"
    - "Feature Canon updated if behavior changed"
```

This configuration tells TeamSpec:
- ✅ How to address team members in prompts and templates
- ✅ What tech stack to assume when creating development plans
- ✅ What branching requirements to enforce in linter
- ✅ What quality gates to validate

**Result:** TeamSpec becomes an extension of the team, not an external framework.
