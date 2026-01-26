/**
 * Property Test: Tailwind Theme Mapping Completeness
 * Feature: design-system-implementation, Property 2: Tailwind Theme Mapping
 * Validates: Requirements 1.5
 */
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Required Tailwind theme mappings
const REQUIRED_COLOR_MAPPINGS = [
  'color-bg', 'color-surface', 'color-surface2', 'color-border',
  'color-ink', 'color-ink2', 'color-ink3',
  'color-primary', 'color-primaryHover', 'color-primaryPressed', 'color-primarySoft',
  'color-ai', 'color-aiSoft',
  'color-success', 'color-successSoft',
  'color-warning', 'color-warningSoft',
  'color-danger', 'color-dangerSoft',
  'color-gold', 'color-goldSoft'
];

const REQUIRED_SHADOW_MAPPINGS = ['shadow-s1', 'shadow-s2'];
const REQUIRED_RADIUS_MAPPINGS = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'];
const REQUIRED_FONT_MAPPINGS = ['font-heading', 'font-body'];

const ALL_REQUIRED_MAPPINGS = [
  ...REQUIRED_COLOR_MAPPINGS,
  ...REQUIRED_SHADOW_MAPPINGS,
  ...REQUIRED_RADIUS_MAPPINGS,
  ...REQUIRED_FONT_MAPPINGS
];


describe('Tailwind Theme Mapping', () => {
  let styleContent: string;

  beforeAll(() => {
    const stylePath = path.join(process.cwd(), 'app/css/style.css');
    styleContent = fs.readFileSync(stylePath, 'utf-8');
  });

  /**
   * Property 2: Tailwind Theme Mapping Completeness
   * For any CSS variable defined in tokens.css, the Tailwind @theme block
   * SHALL contain a corresponding mapping to enable utility class usage.
   */
  test('Property 2: All required theme mappings exist in style.css', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_REQUIRED_MAPPINGS),
        (mappingName) => {
          const pattern = new RegExp(`--${mappingName}\\s*:`);
          const mappingExists = pattern.test(styleContent);
          expect(mappingExists).toBe(true);
          return mappingExists;
        }
      ),
      { numRuns: ALL_REQUIRED_MAPPINGS.length }
    );
  });

  test('All color mappings reference CSS variables', () => {
    REQUIRED_COLOR_MAPPINGS.forEach((mapping) => {
      const pattern = new RegExp(`--${mapping}\\s*:\\s*var\\(--`);
      expect(styleContent).toMatch(pattern);
    });
  });

  test('Shadow mappings reference CSS variables', () => {
    REQUIRED_SHADOW_MAPPINGS.forEach((mapping) => {
      const pattern = new RegExp(`--${mapping}\\s*:\\s*var\\(--`);
      expect(styleContent).toMatch(pattern);
    });
  });

  test('Radius mappings reference CSS variables', () => {
    REQUIRED_RADIUS_MAPPINGS.forEach((mapping) => {
      const pattern = new RegExp(`--${mapping}\\s*:\\s*var\\(--`);
      expect(styleContent).toMatch(pattern);
    });
  });

  test('Font mappings are defined', () => {
    REQUIRED_FONT_MAPPINGS.forEach((mapping) => {
      const pattern = new RegExp(`--${mapping}\\s*:`);
      expect(styleContent).toMatch(pattern);
    });
  });

  test('Tokens.css is imported', () => {
    expect(styleContent).toMatch(/@import\s+["']\.\/tokens\.css["']/);
  });
});
