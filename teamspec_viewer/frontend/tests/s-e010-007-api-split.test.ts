/**
 * TDD Tests for s-e010-007: API split & cleanup
 * 
 * Validates that the monolithic artifacts.ts has been split into
 * domain-specific modules with proper barrel exports.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const API_DIR = path.join(FRONTEND_ROOT, 'src/api');

describe('s-e010-007: API split & cleanup', () => {
  describe('API domain modules exist', () => {
    it('should have products.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'products.ts'))).toBe(true);
    });

    it('should have features.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'features.ts'))).toBe(true);
    });

    it('should have stories.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'stories.ts'))).toBe(true);
    });

    it('should have business.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'business.ts'))).toBe(true);
    });

    it('should have solution.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'solution.ts'))).toBe(true);
    });

    it('should have qa.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'qa.ts'))).toBe(true);
    });

    it('should have search.ts', () => {
      expect(fs.existsSync(path.join(API_DIR, 'search.ts'))).toBe(true);
    });

    it('should have common.ts (shared types)', () => {
      expect(fs.existsSync(path.join(API_DIR, 'common.ts'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(API_DIR, 'index.ts'))).toBe(true);
    });
  });

  describe('Products API module', () => {
    it('should export getProducts', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'products.ts'), 'utf-8');
      expect(content).toContain('export async function getProducts');
    });

    it('should export getProductById', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'products.ts'), 'utf-8');
      expect(content).toContain('export async function getProductById');
    });

    it('should export getProjectsForProduct', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'products.ts'), 'utf-8');
      expect(content).toContain('export async function getProjectsForProduct');
    });

    it('should export Product interface', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'products.ts'), 'utf-8');
      expect(content).toContain('export interface Product');
    });
  });

  describe('Features API module', () => {
    it('should export getFeatures', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getFeatures');
    });

    it('should export getFeatureIncrements', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getFeatureIncrements');
    });

    it('should export getFeatureRelationships', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getFeatureRelationships');
    });

    it('should export getFeatureFICounts', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getFeatureFICounts');
    });

    it('should export getFeatureIncrementsForFeature', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getFeatureIncrementsForFeature');
    });

    it('should export getFISections', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getFISections');
    });

    it('should export getLinkedStories', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'features.ts'), 'utf-8');
      expect(content).toContain('export async function getLinkedStories');
    });
  });

  describe('Stories API module', () => {
    it('should export getEpics', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'stories.ts'), 'utf-8');
      expect(content).toContain('export async function getEpics');
    });

    it('should export getStories', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'stories.ts'), 'utf-8');
      expect(content).toContain('export async function getStories');
    });

    it('should export getDevPlans', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'stories.ts'), 'utf-8');
      expect(content).toContain('export async function getDevPlans');
    });
  });

  describe('Business API module', () => {
    it('should export getBusinessAnalysis', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'business.ts'), 'utf-8');
      expect(content).toContain('export async function getBusinessAnalysis');
    });

    it('should export getBusinessAnalysisIncrements', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'business.ts'), 'utf-8');
      expect(content).toContain('export async function getBusinessAnalysisIncrements');
    });

    it('should export getBARelationships', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'business.ts'), 'utf-8');
      expect(content).toContain('export async function getBARelationships');
    });

    it('should export getBABAICounts', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'business.ts'), 'utf-8');
      expect(content).toContain('export async function getBABAICounts');
    });
  });

  describe('Solution API module', () => {
    it('should export getTechnicalArchitecture', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'solution.ts'), 'utf-8');
      expect(content).toContain('export async function getTechnicalArchitecture');
    });

    it('should export getTAIncrements', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'solution.ts'), 'utf-8');
      expect(content).toContain('export async function getTAIncrements');
    });

    it('should export getSolutionDesigns', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'solution.ts'), 'utf-8');
      expect(content).toContain('export async function getSolutionDesigns');
    });

    it('should export getSDIncrements', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'solution.ts'), 'utf-8');
      expect(content).toContain('export async function getSDIncrements');
    });
  });

  describe('QA API module', () => {
    it('should export getTestCases', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'qa.ts'), 'utf-8');
      expect(content).toContain('export async function getTestCases');
    });

    it('should export getRegressionTests', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'qa.ts'), 'utf-8');
      expect(content).toContain('export async function getRegressionTests');
    });

    it('should export getBugReports', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'qa.ts'), 'utf-8');
      expect(content).toContain('export async function getBugReports');
    });
  });

  describe('Search API module', () => {
    it('should export searchArtifacts', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'search.ts'), 'utf-8');
      expect(content).toContain('export async function searchArtifacts');
    });

    it('should export SearchResult interface', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'search.ts'), 'utf-8');
      expect(content).toContain('export interface SearchResult');
    });
  });

  describe('Common API module', () => {
    it('should export Artifact interface', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'common.ts'), 'utf-8');
      expect(content).toContain('export interface Artifact');
    });

    it('should export getArtifactContent', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'common.ts'), 'utf-8');
      expect(content).toContain('export async function getArtifactContent');
    });

    it('should export updateArtifactStatus', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'common.ts'), 'utf-8');
      expect(content).toContain('export async function updateArtifactStatus');
    });

    it('should export API_BASE constant', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'common.ts'), 'utf-8');
      expect(content).toContain('API_BASE');
    });
  });

  describe('Barrel export (index.ts)', () => {
    it('should re-export all domain modules', () => {
      const content = fs.readFileSync(path.join(API_DIR, 'index.ts'), 'utf-8');
      expect(content).toContain("export * from './common'");
      expect(content).toContain("export * from './products'");
      expect(content).toContain("export * from './features'");
      expect(content).toContain("export * from './stories'");
      expect(content).toContain("export * from './business'");
      expect(content).toContain("export * from './solution'");
      expect(content).toContain("export * from './qa'");
      expect(content).toContain("export * from './search'");
    });
  });

  describe('Old artifacts.ts removed', () => {
    it('should not have artifacts.ts (monolithic file)', () => {
      expect(fs.existsSync(path.join(API_DIR, 'artifacts.ts'))).toBe(false);
    });
  });

  describe('Cleanup - empty folders removed', () => {
    const srcDir = path.join(FRONTEND_ROOT, 'src');

    it('src/contexts/ should not exist (moved to shared/contexts/)', () => {
      const contextsDir = path.join(srcDir, 'contexts');
      // If exists, should be empty or only contain deprecation re-exports
      if (fs.existsSync(contextsDir)) {
        const files = fs.readdirSync(contextsDir);
        // Check each file is a deprecation re-export
        for (const file of files) {
          const content = fs.readFileSync(path.join(contextsDir, file), 'utf-8');
          expect(content).toContain('@deprecated');
        }
      }
    });

    it('src/hooks/ should not exist (moved to shared/hooks/)', () => {
      const hooksDir = path.join(srcDir, 'hooks');
      if (fs.existsSync(hooksDir)) {
        const files = fs.readdirSync(hooksDir);
        for (const file of files) {
          const content = fs.readFileSync(path.join(hooksDir, file), 'utf-8');
          expect(content).toContain('@deprecated');
        }
      }
    });

    it('src/utils/ should not exist (moved to shared/utils/)', () => {
      const utilsDir = path.join(srcDir, 'utils');
      if (fs.existsSync(utilsDir)) {
        const files = fs.readdirSync(utilsDir);
        for (const file of files) {
          const content = fs.readFileSync(path.join(utilsDir, file), 'utf-8');
          expect(content).toContain('@deprecated');
        }
      }
    });

    it('src/constants/ should not exist (moved to shared/constants/)', () => {
      const constantsDir = path.join(srcDir, 'constants');
      if (fs.existsSync(constantsDir)) {
        const files = fs.readdirSync(constantsDir);
        for (const file of files) {
          const content = fs.readFileSync(path.join(constantsDir, file), 'utf-8');
          expect(content).toContain('@deprecated');
        }
      }
    });
  });
});
