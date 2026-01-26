/**
 * Property Test: Light Mode Only Tokens
 * Feature: design-system-implementation, Property 12: Light Mode Only Tokens
 * Validates: Requirements 11.2
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Light Mode Only Tokens', () => {
  let tokensContent: string;
  let styleContent: string;

  beforeAll(() => {
    const tokensPath = path.join(process.cwd(), 'app/css/tokens.css');
    const stylePath = path.join(process.cwd(), 'app/css/style.css');
    tokensContent = fs.readFileSync(tokensPath, 'utf-8');
    styleContent = fs.readFileSync(stylePath, 'utf-8');
  });

  /**
   * Property 12: Light Mode Only Tokens
   * For any CSS rule in tokens.css, there SHALL be no .dark selector
   * or dark mode media query definitions.
   */
  test('Property 12: tokens.css has no dark mode selectors', () => {
    expect(tokensContent).not.toMatch(/\.dark\s*\{/);
    expect(tokensContent).not.toMatch(/@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/);
  });

  test('Property 12: style.css has no dark mode selectors', () => {
    expect(styleContent).not.toMatch(/\.dark\s*\{/);
  });

  test('Tokens are defined in :root only', () => {
    // Count :root occurrences in tokens.css
    const rootMatches = tokensContent.match(/:root\s*\{/g);
    expect(rootMatches).not.toBeNull();
    expect(rootMatches?.length).toBe(1);
  });

  test('No dark mode media queries in tokens', () => {
    expect(tokensContent).not.toMatch(/prefers-color-scheme/);
  });

  test('No dark: prefix classes referenced in style.css', () => {
    // Check for Tailwind dark: prefix usage
    expect(styleContent).not.toMatch(/dark:/);
  });
});
