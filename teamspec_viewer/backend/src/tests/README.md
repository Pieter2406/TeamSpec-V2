# TeamSpec Viewer - Unit Tests

This directory contains automated unit tests for the TeamSpec Viewer backend API, based on the QA test cases defined in the project.

## Test Coverage

### Test Files

| Test File | Test Case | Feature-Increment | Scenarios |
|-----------|-----------|-------------------|-----------|
| `tc-fi-TSV-001.test.ts` | BA/FA Role Dashboards | fi-TSV-001 | 5 scenarios: BA artifacts, FA features, read-only, TBD markers, navigation |
| `tc-fi-TSV-002.test.ts` | FI Navigation | fi-TSV-002 | 4 scenarios: AS-IS/TO-BE sections, navigation, metadata, multiple FIs |
| `tc-fi-TSV-003.test.ts` | Artifact Search | fi-TSV-003 | 4 scenarios: search matching, role filtering, empty results, type filtering |
| `tc-fi-TSV-006.test.ts` | Inline Status Editing | fi-TSV-006 | 6 scenarios: dropdown options, update success, validation, persistence, feedback, concurrency |
| `tc-fi-TSV-007.test.ts` | Dashboard Filtering | fi-TSV-007 | 8 scenarios: default visibility, toggle hiding, terminal states, persistence, ordering, priorities |
| `tc-fi-TSV-008.test.ts` | TBD Warnings | fi-TSV-008 | 5 scenarios: TBD detection, indicators, propagation, tooltips, counting |

### Test Framework

- **Framework**: Vitest
- **Test Style**: Behavioral (describe/it blocks)
- **Assertion Library**: Vitest expect API
- **Test Environment**: Node.js with Hono app instance

## Running Tests

### Run All Tests
```bash
cd backend
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Specific Test File
```bash
pnpm test tc-fi-TSV-001.test.ts
```

### Run with Coverage
```bash
pnpm test --coverage
```

## Test Structure

Each test file follows this pattern:

```typescript
describe('TC-fi-TSV-XXX: Feature Name', () => {
    describe('TC-001: Scenario Name', () => {
        it('should verify specific behavior', async () => {
            // Arrange
            const res = await app.request('/api/endpoint');
            
            // Act
            const json = await res.json();
            
            // Assert
            expect(json).toHaveProperty('field');
        });
    });
});
```

## API Endpoints Tested

### Features
- `GET /api/features?product={id}` - List features
- `GET /api/features/{id}/relationships` - Feature relationships

### Business Analysis
- `GET /api/business-analysis?product={id}` - List BA artifacts
- `GET /api/business-analysis/{id}/relationships` - BA relationships

### Artifacts
- `GET /api/artifact/content?path={path}` - Get artifact content
- `PUT /api/artifact/status` - Update artifact status

### Search
- `GET /api/search?product={id}&query={text}` - Search artifacts
- `GET /api/search?product={id}&types={types}` - Filter by type

### Status
- `GET /api/status-options?type={artifactType}` - Get valid status options

## Test Data Requirements

Tests use the `teamspec-viewer` product as test data:
- **Product ID**: `teamspec-viewer`
- **Features**: Expected in `products/teamspec-viewer/features/`
- **Business Analysis**: Expected in `products/teamspec-viewer/business-analysis/`
- **Projects**: Expected in `projects/*/`

## Assertions Covered

### Functional Requirements
- ✅ Dashboard artifact display
- ✅ Feature-Increment navigation
- ✅ AS-IS/TO-BE section parsing
- ✅ Search functionality
- ✅ Status dropdown options
- ✅ Status update validation
- ✅ Filtering by completion state
- ✅ Artifact ordering by priority
- ✅ TBD marker detection

### Non-Functional Requirements
- ✅ API response times (< 1 second)
- ✅ Concurrent update handling
- ✅ Error handling (invalid inputs)
- ✅ Case-insensitive search

## Known Limitations

1. **Frontend Testing**: These tests cover backend API only. Frontend component tests would require React Testing Library or Playwright.
2. **State Persistence**: Tests may modify artifact files during status updates. Original state is restored when possible.
3. **Test Data Dependency**: Tests assume `teamspec-viewer` product exists with valid artifacts.

## Adding New Tests

To add tests for a new test case:

1. Create `tc-fi-TSV-XXX.test.ts` in this directory
2. Follow the naming pattern: `TC-XXX: Scenario Name`
3. Import test utilities: `import { describe, it, expect } from 'vitest'`
4. Import app: `import app from '../index'`
5. Use async/await for API calls
6. Document which test case and feature-increment is being tested

## Continuous Integration

These tests should run on:
- Every commit (pre-commit hook)
- Pull request CI pipeline
- Pre-deployment validation

## Related Documentation

- **Test Cases**: `projects/teamspecviewermvp/qa/test-cases/tc-fi-TSV-*.md`
- **Bug Reports**: `projects/teamspecviewermvp/qa/bug-reports/bug-*.md`
- **Feature-Increments**: `projects/teamspecviewermvp/feature-increments/fi-TSV-*.md`
- **QA Role**: `.teamspec/agents/AGENT_QA.md`

---

**Last Updated**: 2026-01-17  
**Test Coverage**: 6/8 feature-increments (75%)  
**Total Test Scenarios**: 32+
