---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Integration Testing for Role Dashboards"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e009-s006"
filename_pattern: "dp-e009-s006-integration-testing.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e009-006"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - integration testing
  - E2E tests
  - Vitest
  - role dashboard tests
aliases:
  - integration test implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e009-s006-integration-testing`

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
| **Dev Plan ID** | dp-e009-s006 |
| **Story** | [s-e009-006](../stories/backlog/s-e009-006-integration-testing.md) |
| **Epic** | epic-TSV-009 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e009-006](../stories/backlog/s-e009-006-integration-testing.md) | Integration Testing | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create comprehensive integration tests covering:
1. Role selector functionality with all 5 roles
2. Dashboard routing for DEV, SA, QA roles
3. API endpoint responses
4. Component rendering with mock data
5. End-to-end navigation flows

### 1.2 Test Files

| Test File | Purpose |
|-----------|---------|
| `RoleSelector.test.tsx` | Role selector unit tests |
| `DEVDashboard.test.tsx` | DEV dashboard tests |
| `SADashboard.test.tsx` | SA dashboard tests |
| `QADashboard.test.tsx` | QA dashboard tests |
| `role-api.test.ts` | Backend API tests |
| `role-e2e.test.ts` | E2E navigation tests |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/__tests__/RoleSelector.test.tsx` | Modify | Add DEV/SA/QA role tests |
| `frontend/src/components/__tests__/DEVDashboard.test.tsx` | Create | DEV dashboard tests |
| `frontend/src/components/__tests__/SADashboard.test.tsx` | Create | SA dashboard tests |
| `frontend/src/components/__tests__/QADashboard.test.tsx` | Create | QA dashboard tests |
| `backend/src/routes/__tests__/role-api.test.ts` | Create | Backend API tests |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e009-001-005 | Stories | Required (all prior stories) |
| @testing-library/react | Package | Existing |
| vitest | Package | Existing |
| msw (mock service worker) | Package | May need install |

### 2.3 Test Implementation

```typescript
// frontend/src/components/__tests__/RoleSelector.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RoleSelector } from '../RoleSelector';
import { RoleProvider } from '../../contexts/RoleContext';

describe('RoleSelector', () => {
    const renderWithProvider = (component: React.ReactElement) => {
        return render(
            <RoleProvider>
                {component}
            </RoleProvider>
        );
    };

    it('should render all 5 roles', () => {
        renderWithProvider(<RoleSelector />);
        
        expect(screen.getByText('BA')).toBeInTheDocument();
        expect(screen.getByText('FA')).toBeInTheDocument();
        expect(screen.getByText('DEV')).toBeInTheDocument();
        expect(screen.getByText('SA')).toBeInTheDocument();
        expect(screen.getByText('QA')).toBeInTheDocument();
    });

    it('should show role description on hover', async () => {
        renderWithProvider(<RoleSelector />);
        
        const devRole = screen.getByText('DEV');
        fireEvent.mouseEnter(devRole);
        
        expect(await screen.findByText(/Developer/i)).toBeInTheDocument();
    });

    it('should update active role on click', () => {
        const onRoleChange = vi.fn();
        renderWithProvider(<RoleSelector onRoleChange={onRoleChange} />);
        
        fireEvent.click(screen.getByText('SA'));
        
        expect(onRoleChange).toHaveBeenCalledWith('SA');
    });

    it('should display correct icon for each role', () => {
        renderWithProvider(<RoleSelector />);
        
        // Check icons are rendered (by data-testid)
        expect(screen.getByTestId('icon-BA')).toBeInTheDocument();
        expect(screen.getByTestId('icon-FA')).toBeInTheDocument();
        expect(screen.getByTestId('icon-DEV')).toBeInTheDocument();
        expect(screen.getByTestId('icon-SA')).toBeInTheDocument();
        expect(screen.getByTestId('icon-QA')).toBeInTheDocument();
    });
});
```

```typescript
// frontend/src/components/__tests__/DEVDashboard.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEVDashboard } from '../DEVDashboard';
import { ProductProvider } from '../../contexts/ProductContext';

// Mock fetch
const mockDevPlans = [
    { id: 'dp-e001-s001', title: 'Dev Plan 1', path: '/path/1' },
    { id: 'dp-e001-s002', title: 'Dev Plan 2', path: '/path/2' }
];

beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ artifacts: mockDevPlans, count: 2, scope: 'project' })
    });
});

describe('DEVDashboard', () => {
    const renderWithProvider = () => {
        return render(
            <ProductProvider value={{ 
                selectedProduct: { id: 'tsv' }, 
                selectedProject: { id: 'teamspecviewermvp' }
            }}>
                <DEVDashboard />
            </ProductProvider>
        );
    };

    it('should render dashboard title', () => {
        renderWithProvider();
        expect(screen.getByText('Developer Dashboard')).toBeInTheDocument();
    });

    it('should display Dev Plans section', async () => {
        renderWithProvider();
        expect(screen.getByText('Dev Plans')).toBeInTheDocument();
    });

    it('should display Stories section', () => {
        renderWithProvider();
        expect(screen.getByText('Stories')).toBeInTheDocument();
    });

    it('should display Technical Architecture section', () => {
        renderWithProvider();
        expect(screen.getByText('Technical Architecture')).toBeInTheDocument();
    });

    it('should fetch dev-plans on mount', async () => {
        renderWithProvider();
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/projects/teamspecviewermvp/dev-plans')
            );
        });
    });

    it('should display loading state', () => {
        global.fetch = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
        renderWithProvider();
        
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should display empty state when no dev-plans', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ artifacts: [], count: 0, scope: 'project' })
        });
        
        renderWithProvider();
        
        await waitFor(() => {
            expect(screen.getByText(/No dev-plans found/i)).toBeInTheDocument();
        });
    });
});
```

```typescript
// frontend/src/components/__tests__/SADashboard.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SADashboard } from '../SADashboard';
import { ProductProvider } from '../../contexts/ProductContext';

describe('SADashboard', () => {
    const renderWithProvider = () => {
        return render(
            <ProductProvider value={{ 
                selectedProduct: { id: 'tsv' }, 
                selectedProject: { id: 'teamspecviewermvp' }
            }}>
                <SADashboard />
            </ProductProvider>
        );
    };

    it('should render dashboard title', () => {
        renderWithProvider();
        expect(screen.getByText('Solution Architect Dashboard')).toBeInTheDocument();
    });

    it('should display Product/Project scope chips', () => {
        renderWithProvider();
        
        const productChips = screen.getAllByText('Product');
        const projectChips = screen.getAllByText('Project');
        
        expect(productChips.length).toBe(2); // SD and TA
        expect(projectChips.length).toBe(2); // SDI and TAI
    });

    it('should display all 4 sections', () => {
        renderWithProvider();
        
        expect(screen.getByText('Solution Designs')).toBeInTheDocument();
        expect(screen.getByText('SD Increments')).toBeInTheDocument();
        expect(screen.getByText('Technical Architecture')).toBeInTheDocument();
        expect(screen.getByText('TA Increments')).toBeInTheDocument();
    });
});
```

```typescript
// frontend/src/components/__tests__/QADashboard.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QADashboard } from '../QADashboard';
import { ProductProvider } from '../../contexts/ProductContext';

const mockBugs = [
    { id: 'bug-001', title: 'Bug 1', status: 'Open' },
    { id: 'bug-002', title: 'Bug 2', status: 'Open' },
    { id: 'bug-003', title: 'Bug 3', status: 'Resolved' }
];

describe('QADashboard', () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ artifacts: mockBugs, count: 3, scope: 'project' })
        });
    });

    const renderWithProvider = () => {
        return render(
            <ProductProvider value={{ 
                selectedProduct: { id: 'tsv' }, 
                selectedProject: { id: 'teamspecviewermvp' }
            }}>
                <QADashboard />
            </ProductProvider>
        );
    };

    it('should render dashboard title', () => {
        renderWithProvider();
        expect(screen.getByText('QA Dashboard')).toBeInTheDocument();
    });

    it('should display all 3 sections', () => {
        renderWithProvider();
        
        expect(screen.getByText('Test Cases')).toBeInTheDocument();
        expect(screen.getByText('Regression Tests')).toBeInTheDocument();
        expect(screen.getByText('Bug Reports')).toBeInTheDocument();
    });

    it('should display open bug count badge', async () => {
        renderWithProvider();
        
        await waitFor(() => {
            // Badge should show count of Open bugs (2)
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });
});
```

```typescript
// backend/src/routes/__tests__/role-api.test.ts

import { describe, it, expect } from 'vitest';
import { app } from '../../index';

describe('Role Dashboard API Endpoints', () => {
    describe('DEV endpoints', () => {
        it('GET /api/projects/:projectId/dev-plans returns 200', async () => {
            const res = await app.request('/api/projects/teamspecviewermvp/dev-plans');
            expect(res.status).toBe(200);
            
            const data = await res.json();
            expect(data).toHaveProperty('artifacts');
            expect(data).toHaveProperty('count');
            expect(data.scope).toBe('project');
        });
    });

    describe('SA endpoints', () => {
        it('GET /api/products/:productId/solution-designs returns 200', async () => {
            const res = await app.request('/api/products/teamspec-viewer/solution-designs');
            expect(res.status).toBe(200);
            
            const data = await res.json();
            expect(data.scope).toBe('product');
        });

        it('GET /api/projects/:projectId/sdi returns 200', async () => {
            const res = await app.request('/api/projects/teamspecviewermvp/sdi');
            expect(res.status).toBe(200);
            
            const data = await res.json();
            expect(data.scope).toBe('project');
        });

        it('GET /api/products/:productId/technical-architecture returns 200', async () => {
            const res = await app.request('/api/products/teamspec-viewer/technical-architecture');
            expect(res.status).toBe(200);
        });

        it('GET /api/projects/:projectId/tai returns 200', async () => {
            const res = await app.request('/api/projects/teamspecviewermvp/tai');
            expect(res.status).toBe(200);
        });
    });

    describe('QA endpoints', () => {
        it('GET /api/projects/:projectId/test-cases returns 200', async () => {
            const res = await app.request('/api/projects/teamspecviewermvp/test-cases');
            expect(res.status).toBe(200);
            
            const data = await res.json();
            expect(data.scope).toBe('project');
        });

        it('GET /api/products/:productId/regression-tests returns 200', async () => {
            const res = await app.request('/api/products/teamspec-viewer/regression-tests');
            expect(res.status).toBe(200);
            
            const data = await res.json();
            expect(data.scope).toBe('product');
        });

        it('GET /api/projects/:projectId/bug-reports returns 200', async () => {
            const res = await app.request('/api/projects/teamspecviewermvp/bug-reports');
            expect(res.status).toBe(200);
        });
    });

    describe('Error handling', () => {
        it('returns empty array for non-existent project', async () => {
            const res = await app.request('/api/projects/nonexistent/dev-plans');
            expect(res.status).toBe(200);
            
            const data = await res.json();
            expect(data.artifacts).toEqual([]);
            expect(data.count).toBe(0);
        });
    });
});
```

---

## 3. Testing Strategy

### 3.1 Test Coverage Targets

| Area | Coverage Target |
|------|-----------------|
| RoleSelector | 100% |
| DEVDashboard | 80% |
| SADashboard | 80% |
| QADashboard | 80% |
| Backend APIs | 90% |

### 3.2 Test Execution

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test frontend/src/components/__tests__/DEVDashboard.test.tsx
```

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Flaky tests | Medium | Medium | Use proper waitFor/async patterns |
| Mock complexity | Medium | Low | Keep mocks minimal and focused |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Role selector tests all 5 roles | RoleSelector.test.tsx |
| 2 | DEV dashboard renders sections | DEVDashboard.test.tsx |
| 3 | SA dashboard renders sections | SADashboard.test.tsx |
| 4 | QA dashboard renders sections | QADashboard.test.tsx |
| 5 | API endpoints return 200 | role-api.test.ts |
| 6 | Empty state handling | Empty array tests |
| 7 | Test coverage > 80% | Run pnpm test:coverage |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Dependencies identified
- [x] Prior stories complete (s-e009-001 through s-e009-005)

### Implementation

- [ ] RoleSelector.test.tsx updated
- [ ] DEVDashboard.test.tsx created
- [ ] SADashboard.test.tsx created
- [ ] QADashboard.test.tsx created
- [ ] role-api.test.ts created
- [ ] All tests passing
- [ ] Coverage > 80%

### Post-Implementation

- [ ] Test documentation updated
- [ ] Story marked complete

---

## Change Log

| Date | Author | Status | Summary |
|------|--------|--------|---------|
| 2026-01-17 | DEV Agent | Draft | Initial dev plan |
