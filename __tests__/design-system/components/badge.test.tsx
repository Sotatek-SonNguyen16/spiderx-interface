/**
 * Property Test: Badge Variant Correctness
 * Feature: design-system-implementation, Property 5: Badge Variant Correctness
 * Validates: Requirements 3.5
 */
import * as fc from 'fast-check';
import { recipes } from '../../../components/ui/recipes';

const BADGE_VARIANTS = ['default', 'ai', 'success', 'warning', 'danger', 'gold'] as const;
type BadgeVariant = typeof BADGE_VARIANTS[number];

// Expected background colors for each variant
const EXPECTED_BG: Record<BadgeVariant, string> = {
  default: 'bg-surface2',
  ai: 'bg-aiSoft',
  success: 'bg-successSoft',
  warning: 'bg-warningSoft',
  danger: 'bg-dangerSoft',
  gold: 'bg-goldSoft',
};

// Expected text colors for each variant
const EXPECTED_TEXT: Record<BadgeVariant, string> = {
  default: 'text-ink2',
  ai: 'text-ai',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  gold: 'text-gold',
};

describe('Badge Variant Correctness', () => {
  /**
   * Property 5: Badge Variant Correctness
   * For any valid Badge variant, rendering the Badge with that variant
   * SHALL apply exactly the classes defined in recipes.badge.base and
   * recipes.badge[variant].
   */
  test('Property 5: Each variant applies correct background color', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...BADGE_VARIANTS),
        (variant) => {
          const variantClasses = recipes.badge[variant];
          const expectedBg = EXPECTED_BG[variant];
          expect(variantClasses).toContain(expectedBg);
          return variantClasses.includes(expectedBg);
        }
      ),
      { numRuns: BADGE_VARIANTS.length * 15 }
    );
  });


  test('Property 5: Each variant applies correct text color', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...BADGE_VARIANTS),
        (variant) => {
          const variantClasses = recipes.badge[variant];
          const expectedText = EXPECTED_TEXT[variant];
          expect(variantClasses).toContain(expectedText);
          return variantClasses.includes(expectedText);
        }
      ),
      { numRuns: BADGE_VARIANTS.length * 15 }
    );
  });

  test('Base badge includes rounded-full and border', () => {
    expect(recipes.badge.base).toContain('rounded-full');
    expect(recipes.badge.base).toContain('border');
    expect(recipes.badge.base).toContain('text-xs');
    expect(recipes.badge.base).toContain('font-semibold');
  });

  test('AI badge uses lavender colors', () => {
    expect(recipes.badge.ai).toContain('bg-aiSoft');
    expect(recipes.badge.ai).toContain('text-ai');
  });

  test('Gold badge for pricing highlights', () => {
    expect(recipes.badge.gold).toContain('bg-goldSoft');
    expect(recipes.badge.gold).toContain('text-gold');
  });

  test('Status badges use soft backgrounds', () => {
    expect(recipes.badge.success).toContain('Soft');
    expect(recipes.badge.warning).toContain('Soft');
    expect(recipes.badge.danger).toContain('Soft');
  });
});
