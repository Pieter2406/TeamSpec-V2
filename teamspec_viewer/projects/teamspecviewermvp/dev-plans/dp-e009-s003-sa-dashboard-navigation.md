---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "SA Dashboard Navigation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e009-s003"
filename_pattern: "dp-e009-s003-sa-dashboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e009-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - SA dashboard
  - solution architect dashboard
  - solution design navigation
aliases:
  - solution architect dashboard implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e009-s003-sa-dashboard-navigation`

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
| **Dev Plan ID** | dp-e009-s003 |
| **Story** | [s-e009-003](../stories/backlog/s-e009-003-sa-dashboard-navigation.md) |
| **Epic** | epic-TSV-009 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e009-003](../stories/backlog/s-e009-003-sa-dashboard-navigation.md) | SA Dashboard Navigation | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a new SADashboard component following the established pattern:
1. Create main SADashboard component with dual-level artifact display
2. Product-level: Solution Designs (SD), Technical Architecture (TA)
3. Project-level: SD Increments (SDI), TA Increments (TAI)
4. Clear visual distinction between product/project scope

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `SADashboard.tsx` | New | Main dashboard with 4 sections |
| `SDTree.tsx` | New | Tree navigation for Solution Designs + SDI |
| `TATree.tsx` | Reuse | Already created in s-e009-002 for TA + TAI |
| `App.tsx` | Modified | Route SA role to SADashboard |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/SADashboard.tsx` | Create | Main SA dashboard |
| `frontend/src/components/SDTree.tsx` | Create | SD/SDI tree navigation |
| `frontend/src/App.tsx` | Modify | Add SA dashboard routing |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e009-001 (RoleSelector) | Story | Required |
| s-e009-005 (Backend APIs) | Story | Required |
| TATree from s-e009-002 | Component | Reuse |

### 2.3 API Calls

| Endpoint | Purpose |
|----------|---------|
| `GET /api/products/:productId/solution-designs` | Fetch SD docs |
| `GET /api/projects/:projectId/sdi` | Fetch SDI docs |
| `GET /api/products/:productId/technical-architecture` | Fetch TA docs |
| `GET /api/projects/:projectId/tai` | Fetch TAI docs |

### 2.4 Component Structure

```tsx
// SADashboard.tsx

import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { useProduct } from '../contexts/ProductContext';
import { SDTree } from './SDTree';
import { TATree } from './TATree';

export function SADashboard() {
    const { selectedProduct, selectedProject } = useProduct();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Solution Architect Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {/* Solution Designs (Product) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">Solution Designs</Typography>
                            <Chip label="Product" size="small" color="primary" />
                        </Box>
                        <SDTree 
                            productId={selectedProduct?.id}
                            scope="product"
                        />
                    </Paper>
                </Grid>

                {/* SD Increments (Project) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">SD Increments</Typography>
                            <Chip label="Project" size="small" color="secondary" />
                        </Box>
                        <SDTree 
                            projectId={selectedProject?.id}
                            scope="project"
                        />
                    </Paper>
                </Grid>

                {/* Technical Architecture (Product) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">Technical Architecture</Typography>
                            <Chip label="Product" size="small" color="primary" />
                        </Box>
                        <TATree 
                            productId={selectedProduct?.id}
                            scope="product"
                        />
                    </Paper>
                </Grid>

                {/* TA Increments (Project) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6">TA Increments</Typography>
                            <Chip label="Project" size="small" color="secondary" />
                        </Box>
                        <TATree 
                            projectId={selectedProject?.id}
                            scope="project"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
```

```tsx
// SDTree.tsx

interface SDTreeProps {
    productId?: string;
    projectId?: string;
    scope: 'product' | 'project';
}

export function SDTree({ productId, projectId, scope }: SDTreeProps) {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const endpoint = scope === 'product'
            ? `/api/products/${productId}/solution-designs`
            : `/api/projects/${projectId}/sdi`;
        
        if ((scope === 'product' && !productId) || 
            (scope === 'project' && !projectId)) return;
        
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setArtifacts(data.artifacts);
                setLoading(false);
            });
    }, [productId, projectId, scope]);

    if (loading) return <CircularProgress />;
    if (artifacts.length === 0) {
        return <EmptyState message={`No ${scope === 'product' ? 'solution designs' : 'SD increments'} found`} />;
    }

    return (
        <TreeView>
            {artifacts.map(artifact => (
                <TreeItem 
                    key={artifact.id}
                    nodeId={artifact.id}
                    label={
                        <ArtifactLabel 
                            id={artifact.id}
                            title={artifact.title}
                            status={artifact.status}
                        />
                    }
                    onClick={() => onArtifactSelect(artifact.path)}
                />
            ))}
        </TreeView>
    );
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] SADashboard renders all 4 sections
- [ ] SDTree fetches product-level SDs correctly
- [ ] SDTree fetches project-level SDIs correctly
- [ ] Scope chips display correctly (Product/Project)
- [ ] Empty state displays when no artifacts

### 3.2 Integration Tests

- [ ] Full flow: Select SA role → Dashboard loads → Click SD → Reader shows content

### 3.3 Manual Testing

- [ ] Verify Solution Designs load at product level
- [ ] Verify SDI loads at project level
- [ ] Verify visual distinction between scopes

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API not ready | Medium | High | Stub with mock data until s-e009-005 complete |
| Scope confusion | Low | Medium | Clear Chip labels for Product vs Project |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Display Solution Designs (Product) | SDTree with scope="product" |
| 2 | Display SD Increments (Project) | SDTree with scope="project" |
| 3 | Display Technical Architecture (Product) | TATree with scope="product" |
| 4 | Display TA Increments (Project) | TATree with scope="project" |
| 5 | Navigate to artifact | onClick → ArtifactReader |
| 6 | Clear Product/Project scope | Chip badges showing scope |
| 7 | Empty state handling | Show appropriate message |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] SADashboard component created
- [ ] SDTree component created
- [ ] TATree component updated (if needed)
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
