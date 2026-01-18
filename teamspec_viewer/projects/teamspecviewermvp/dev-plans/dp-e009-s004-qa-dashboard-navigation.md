---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "QA Dashboard Navigation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e009-s004"
filename_pattern: "dp-e009-s004-qa-dashboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e009-004"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - QA dashboard
  - tester dashboard
  - test cases navigation
  - regression tests
aliases:
  - QA dashboard implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e009-s004-qa-dashboard-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e009-s004 |
| **Story** | [s-e009-004](../stories/backlog/s-e009-004-qa-dashboard-navigation.md) |
| **Epic** | epic-TSV-009 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e009-004](../stories/backlog/s-e009-004-qa-dashboard-navigation.md) | QA Dashboard Navigation | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a new QADashboard component with focus on testing artifacts:
1. Create main QADashboard component with 3 sections
2. Project-level: Test Cases, Bug Reports
3. Product-level: Regression Tests
4. Status-based filtering for test results

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `QADashboard.tsx` | New | Main dashboard with 3 sections |
| `TestCaseTree.tsx` | New | Tree navigation for test cases |
| `RegressionTree.tsx` | New | Tree navigation for regression tests |
| `BugTree.tsx` | New | Tree navigation for bug reports |
| `App.tsx` | Modified | Route QA role to QADashboard |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/QADashboard.tsx` | Create | Main QA dashboard |
| `frontend/src/components/TestCaseTree.tsx` | Create | Test case tree navigation |
| `frontend/src/components/RegressionTree.tsx` | Create | Regression test tree navigation |
| `frontend/src/components/BugTree.tsx` | Create | Bug report tree navigation |
| `frontend/src/App.tsx` | Modify | Add QA dashboard routing |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e009-001 (RoleSelector) | Story | Required |
| s-e009-005 (Backend APIs) | Story | Required |
| ArtifactTree pattern | Existing | Reuse |

### 2.3 API Calls

| Endpoint | Purpose |
|----------|---------|
| `GET /api/projects/:projectId/test-cases` | Fetch test cases |
| `GET /api/products/:productId/regression-tests` | Fetch regression tests |
| `GET /api/projects/:projectId/bug-reports` | Fetch bug reports |

### 2.4 Component Structure

```tsx
// QADashboard.tsx

import { Box, Typography, Grid, Paper, Chip, Badge } from '@mui/material';
import { useProduct } from '../contexts/ProductContext';
import { TestCaseTree } from './TestCaseTree';
import { RegressionTree } from './RegressionTree';
import { BugTree } from './BugTree';
import BugReportIcon from '@mui/icons-material/BugReport';

export function QADashboard() {
    const { selectedProduct, selectedProject } = useProduct();
    const [openBugsCount, setOpenBugsCount] = useState(0);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                QA Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {/* Test Cases (Project) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">Test Cases</Typography>
                            <Chip label="Project" size="small" color="secondary" />
                        </Box>
                        <TestCaseTree projectId={selectedProject?.id} />
                    </Paper>
                </Grid>

                {/* Regression Tests (Product) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">Regression Tests</Typography>
                            <Chip label="Product" size="small" color="primary" />
                        </Box>
                        <RegressionTree productId={selectedProduct?.id} />
                    </Paper>
                </Grid>

                {/* Bug Reports (Project) */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">Bug Reports</Typography>
                            <Chip label="Project" size="small" color="secondary" />
                            <Badge 
                                badgeContent={openBugsCount} 
                                color="error"
                                sx={{ ml: 2 }}
                            >
                                <BugReportIcon />
                            </Badge>
                        </Box>
                        <BugTree 
                            projectId={selectedProject?.id}
                            onBugCountChange={setOpenBugsCount}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
```

```tsx
// TestCaseTree.tsx

interface TestCaseTreeProps {
    projectId?: string;
}

export function TestCaseTree({ projectId }: TestCaseTreeProps) {
    const [testCases, setTestCases] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;
        
        fetch(`/api/projects/${projectId}/test-cases`)
            .then(res => res.json())
            .then(data => {
                setTestCases(data.artifacts);
                setLoading(false);
            });
    }, [projectId]);

    if (loading) return <CircularProgress />;
    if (testCases.length === 0) return <EmptyState message="No test cases found" />;

    // Group by Feature-Increment
    const groupedByFI = testCases.reduce((acc, tc) => {
        const fi = tc.metadata?.feature_increment || 'Unlinked';
        if (!acc[fi]) acc[fi] = [];
        acc[fi].push(tc);
        return acc;
    }, {} as Record<string, Artifact[]>);

    return (
        <TreeView>
            {Object.entries(groupedByFI).map(([fi, cases]) => (
                <TreeItem key={fi} nodeId={fi} label={fi}>
                    {cases.map(tc => (
                        <TreeItem 
                            key={tc.id}
                            nodeId={tc.id}
                            label={
                                <ArtifactLabel 
                                    id={tc.id}
                                    title={tc.title}
                                    status={tc.status}
                                />
                            }
                            onClick={() => onArtifactSelect(tc.path)}
                        />
                    ))}
                </TreeItem>
            ))}
        </TreeView>
    );
}
```

```tsx
// BugTree.tsx

interface BugTreeProps {
    projectId?: string;
    onBugCountChange?: (count: number) => void;
}

export function BugTree({ projectId, onBugCountChange }: BugTreeProps) {
    const [bugs, setBugs] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;
        
        fetch(`/api/projects/${projectId}/bug-reports`)
            .then(res => res.json())
            .then(data => {
                setBugs(data.artifacts);
                setLoading(false);
                
                // Count open bugs
                const openCount = data.artifacts.filter(
                    (b: Artifact) => b.status === 'Open' || b.status === 'In Progress'
                ).length;
                onBugCountChange?.(openCount);
            });
    }, [projectId]);

    if (loading) return <CircularProgress />;
    if (bugs.length === 0) return <EmptyState message="No bug reports found" />;

    // Group by status
    const groupedByStatus = bugs.reduce((acc, bug) => {
        const status = bug.status || 'Unknown';
        if (!acc[status]) acc[status] = [];
        acc[status].push(bug);
        return acc;
    }, {} as Record<string, Artifact[]>);

    const statusOrder = ['Open', 'In Progress', 'Resolved', 'Closed'];

    return (
        <TreeView>
            {statusOrder.map(status => {
                const statusBugs = groupedByStatus[status] || [];
                if (statusBugs.length === 0) return null;
                
                return (
                    <TreeItem 
                        key={status} 
                        nodeId={status} 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{status}</span>
                                <Chip size="small" label={statusBugs.length} />
                            </Box>
                        }
                    >
                        {statusBugs.map(bug => (
                            <TreeItem 
                                key={bug.id}
                                nodeId={bug.id}
                                label={
                                    <ArtifactLabel 
                                        id={bug.id}
                                        title={bug.title}
                                        severity={bug.metadata?.severity}
                                    />
                                }
                                onClick={() => onArtifactSelect(bug.path)}
                            />
                        ))}
                    </TreeItem>
                );
            })}
        </TreeView>
    );
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] QADashboard renders all 3 sections
- [ ] TestCaseTree groups test cases by Feature-Increment
- [ ] RegressionTree displays regression tests
- [ ] BugTree groups bugs by status
- [ ] Open bug count badge updates correctly

### 3.2 Integration Tests

- [ ] Full flow: Select QA role → Dashboard loads → Click test case → Reader shows content

### 3.3 Manual Testing

- [ ] Verify test cases load for teamspecviewermvp project
- [ ] Verify regression tests load from product level
- [ ] Verify bug reports grouped by status

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API not ready | Medium | High | Stub with mock data until s-e009-005 complete |
| Bug count performance | Low | Low | Compute count on fetch, not realtime |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Display Test Cases (Project) | TestCaseTree grouped by FI |
| 2 | Display Regression Tests (Product) | RegressionTree component |
| 3 | Display Bug Reports (Project) | BugTree grouped by status |
| 4 | Navigate to artifact | onClick → ArtifactReader |
| 5 | Group bugs by status | StatusOrder array for ordering |
| 6 | Open bug count badge | Badge with error color |
| 7 | Empty state handling | Show appropriate messages |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] QADashboard component created
- [ ] TestCaseTree component created
- [ ] RegressionTree component created
- [ ] BugTree component created
- [ ] Routing updated
- [ ] Unit tests written
- [ ] Tests passing

### Post-Implementation

- [ ] Documentation updated
- [ ] Story marked complete

---

## Change Log

| Date | Author | Status | Summary |
|------|--------|--------|---------|
| 2026-01-17 | DEV Agent | Draft | Initial dev plan |
