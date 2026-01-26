/**
 * Property Test: Token Completeness
 * Feature: design-system-implementation, Property 1: Token Completeness
 * Validates: Requirements 1.1, 1.2, 1.3
 */
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Required tokens as per design spec
const REQUIRED_COLOR_TOKENS = [
  'bg', 'surface', 'surface2', 'border',
  'ink', 'ink2', 'ink3',
  'primary', 'primaryHover', 'primaryPressed', 'primarySoft',
  'ai', 'aiSoft',
  'success', 'successSoft',
  'warning', 'warningSoft',
  'danger', 'dangerSoft',
  'gold', 'goldSoft'
];

const REQUIRED_SHADOW_TOKENS = ['shadow1', 'shadow2'];

const REQUIRED_RADIUS_TOKENS = ['rSm', 'rMd', 'rLg', 'rXl'];

const ALL_REQUIRED_TOKENS = [
  ...REQUIRED_COLOR_TOKENS,
  ...REQUIRED_SHADOW_TOKENS,
  ...REQUIRED_RADIUS_TOKENS
];


describe('Design System Tokens', () => {
  let tokensContent: string;

  beforeAll(() => {
    const tokensPath = path.join(process.cwd(), 'app/css/tokens.css');
    tokensContent = fs.readFileSync(tokensPath, 'utf-8');
  });

  /**
   * Property 1: Token Completeness
   * For any required design token, the tokens.css file SHALL contain
   * a CSS custom property definition for that token.
   */
  test('Property 1: All required tokens are defined in tokens.css', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_REQUIRED_TOKENS),
        (tokenName) => {
          const pattern = new RegExp(`--${tokenName}\\s*:`);
          const tokenExists = pattern.test(tokensContent);
          expect(tokenExists).toBe(true);
          return tokenExists;
        }
      ),
      { numRuns: ALL_REQUIRED_TOKENS.length }
    );
  });

  test('All color tokens are defined', () => {
    REQUIRED_COLOR_TOKENS.forEach((token) => {
      const pattern = new RegExp(`--${token}\\s*:`);
      expect(tokensContent).toMatch(pattern);
    });
  });

  test('All shadow tokens are defined', () => {
    REQUIRED_SHADOW_TOKENS.forEach((token) => {
      const pattern = new RegExp(`--${token}\\s*:`);
      expect(tokensContent).toMatch(pattern);
    });
  });

  test('All radius tokens are defined', () => {
    REQUIRED_RADIUS_TOKENS.forEach((token) => {
      const pattern = new RegExp(`--${token}\\s*:`);
      expect(tokensContent).toMatch(pattern);
    });
  });

  test('Tokens are defined within :root selector', () => {
    expect(tokensContent).toMatch(/:root\s*\{/);
  });
});
