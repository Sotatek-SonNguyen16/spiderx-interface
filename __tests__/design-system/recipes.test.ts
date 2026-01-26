/**
 * Property Test: Recipe Structure Validity
 * Feature: design-system-implementation, Property 7: Recipe Structure Validity
 * Validates: Requirements 4.1, 4.2
 */
import * as fc from 'fast-check';
import { recipes } from '../../components/ui/recipes';

// Required recipe categories
const REQUIRED_CATEGORIES = ['focusRing', 'button', 'card', 'input', 'badge', 'progress', 'chip', 'toast'];

// Required keys per category
const REQUIRED_KEYS: Record<string, string[]> = {
  button: ['base', 'primary', 'secondary', 'ghost', 'destructive'],
  card: ['base', 'clickable', 'padSm', 'padMd', 'padLg', 'recommended'],
  input: ['base', 'error', 'label', 'helper', 'errorText'],
  badge: ['base', 'default', 'ai', 'success', 'warning', 'danger', 'gold'],
  progress: ['track', 'fillPrimary', 'fillAI', 'step', 'meta'],
  chip: ['container', 'title', 'meta', 'iconBtn'],
  toast: ['base', 'title', 'body'],
};

describe('Recipe Structure Validity', () => {
  /**
   * Property 7: Recipe Structure Validity
   * For any recipe category, the recipes object SHALL contain
   * all required variant keys as defined in the RecipeDefinition schema.
   */
  test('Property 7: All required recipe categories exist', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...REQUIRED_CATEGORIES),
        (category) => {
          const exists = category in recipes;
          expect(exists).toBe(true);
          return exists;
        }
      ),
      { numRuns: REQUIRED_CATEGORIES.length }
    );
  });


  test('Property 7: All required keys exist in each category', () => {
    Object.entries(REQUIRED_KEYS).forEach(([category, keys]) => {
      fc.assert(
        fc.property(
          fc.constantFrom(...keys),
          (key) => {
            const categoryObj = recipes[category as keyof typeof recipes];
            const keyExists = typeof categoryObj === 'object' && key in categoryObj;
            expect(keyExists).toBe(true);
            return keyExists;
          }
        ),
        { numRuns: keys.length }
      );
    });
  });

  test('focusRing is a string', () => {
    expect(typeof recipes.focusRing).toBe('string');
    expect(recipes.focusRing.length).toBeGreaterThan(0);
  });

  test('All recipe values are non-empty strings', () => {
    const checkRecipeValues = (obj: Record<string, unknown>, path: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = `${path}.${key}`;
        if (typeof value === 'object' && value !== null) {
          checkRecipeValues(value as Record<string, unknown>, currentPath);
        } else {
          expect(typeof value).toBe('string');
          expect((value as string).length).toBeGreaterThan(0);
        }
      });
    };
    checkRecipeValues(recipes as unknown as Record<string, unknown>, 'recipes');
  });

  test('Button recipes contain Tailwind classes', () => {
    expect(recipes.button.base).toContain('inline-flex');
    expect(recipes.button.primary).toContain('bg-primary');
    expect(recipes.button.secondary).toContain('bg-surface');
    expect(recipes.button.ghost).toContain('text-primary');
    expect(recipes.button.destructive).toContain('bg-danger');
  });

  test('Card recipes contain Tailwind classes', () => {
    expect(recipes.card.base).toContain('bg-surface');
    expect(recipes.card.clickable).toContain('hover:shadow-s2');
    expect(recipes.card.recommended).toContain('border-primary');
  });

  test('Badge recipes contain Tailwind classes', () => {
    expect(recipes.badge.base).toContain('rounded-full');
    expect(recipes.badge.ai).toContain('bg-aiSoft');
    expect(recipes.badge.success).toContain('bg-successSoft');
  });
});
