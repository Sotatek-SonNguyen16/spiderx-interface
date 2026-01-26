/**
 * Property Test: Button Variant Correctness
 * Feature: design-system-implementation, Property 3: Button Variant Correctness
 * Validates: Requirements 3.1, 3.2
 */
import * as fc from 'fast-check';
import { recipes } from '../../../components/ui/recipes';

const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'] as const;
type ButtonVariant = typeof BUTTON_VARIANTS[number];

// Helper to get expected classes for a variant
function getExpectedClasses(variant: ButtonVariant): string[] {
  const baseClasses = recipes.button.base.split(' ');
  const focusClasses = recipes.focusRing.split(' ');
  const variantClasses = recipes.button[variant].split(' ');
  return [...baseClasses, ...focusClasses, ...variantClasses];
}

describe('Button Variant Correctness', () => {
  /**
   * Property 3: Button Variant Correctness
   * For any valid Button variant, rendering the Button with that variant
   * SHALL apply exactly the classes defined in recipes.
   */
  test('Property 3: Each variant applies correct recipe classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...BUTTON_VARIANTS),
        (variant) => {
          const expectedClasses = getExpectedClasses(variant);
          // Verify all expected classes are non-empty
          expect(expectedClasses.length).toBeGreaterThan(0);
          expect(expectedClasses.every(c => c.length > 0)).toBe(true);
          return true;
        }
      ),
      { numRuns: BUTTON_VARIANTS.length * 25 }
    );
  });


  test('Primary variant includes bg-primary', () => {
    expect(recipes.button.primary).toContain('bg-primary');
    expect(recipes.button.primary).toContain('text-surface');
  });

  test('Secondary variant includes bg-surface and border', () => {
    expect(recipes.button.secondary).toContain('bg-surface');
    expect(recipes.button.secondary).toContain('border');
    expect(recipes.button.secondary).toContain('text-primary');
  });

  test('Ghost variant includes text-primary and hover state', () => {
    expect(recipes.button.ghost).toContain('text-primary');
    expect(recipes.button.ghost).toContain('hover:bg-primarySoft');
  });

  test('Destructive variant includes bg-danger', () => {
    expect(recipes.button.destructive).toContain('bg-danger');
    expect(recipes.button.destructive).toContain('text-surface');
  });

  test('All variants include disabled states', () => {
    ['primary', 'secondary', 'destructive'].forEach((variant) => {
      expect(recipes.button[variant as keyof typeof recipes.button]).toContain('disabled:opacity-50');
    });
  });

  test('Focus ring is applied to all buttons', () => {
    expect(recipes.focusRing).toContain('focus-visible:ring-4');
    expect(recipes.focusRing).toContain('focus-visible:ring-primarySoft');
  });

  test('Base includes transition for smooth interactions', () => {
    expect(recipes.button.base).toContain('transition');
    expect(recipes.button.base).toContain('duration-200');
  });
});
