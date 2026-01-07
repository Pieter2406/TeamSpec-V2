---
name: "ts:ba-project"
description: "TeamSpec Business Analyst: Create project structure"
agent: "agent"
---

# Create project structure

Execute the **project** workflow as a **Business Analyst**.

See full role instructions: [AGENT_BA.md](../../.teamspec/agents/AGENT_BA.md)

## Quick Reference

Execute project creation workflow:
1. Gather project information (name, ID, stakeholders, goals)
2. Create project folder structure in projects/{id}/
3. Generate project.yml with metadata
4. Create README.md
5. Initialize folders: features/, stories/backlog/, stories/ready-to-refine/, stories/ready-for-development/, adr/, decisions/, dev-plans/, qa/test-cases/, epics/, sprints/
6. Create features-index.md and story-ledger.md
Wait for user confirmation before creating files.
