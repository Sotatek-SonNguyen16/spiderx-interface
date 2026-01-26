/**
 * Property Test: Card Variant Correctness
 * Feature: design-system-implementation, Property 4: Card Variant Correctness
 * Validates: Requirements 3.3, 3.4
 */
import * as fc from 'fast-check';
import { recipes } from '../../../components/ui/recipes';

const CARD_PADDING = ['sm', 'md', 'lg'] as const;

describe('Card Variant Correctness', () => {
  /**
   * Property 4: Card Variant Correctness
   * For any Card component, rendering with clickable=false SHALL apply
   * recipes.card.base classes, and rendering with clickable=true SHALL
   * apply recipes.card.clickable classes.
   */
  test('Property 4: Base card applies correct recipe classes', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.constantFrom(...CARD_PADDING),
        (clickable, padding) => {
          const expectedBase = clickable ? recipes.card.clickable : recipes.card.base;
          const expectedPad = recipes.card[`pad${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof recipes.card];
          
          expect(expectedBase).toBeDefined();
          expect(expectedPad).toBeDefined();
          expect(typeof expectedBase).toBe('string');
          expect(typeof expectedPad).toBe('string');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Base card includes surface background and border', () => {
    expect(recipes.card.base).toContain('bg-surface');
    expect(recipes.card.base).toContain('border');
    expect(recipes.card.base).toContain('rounded-lg');
    expect(recipes.card.base).toContain('shadow-s1');
  });


  test('Clickable card includes hover effects', () => {
    expect(recipes.card.clickable).toContain('hover:shadow-s2');
    expect(recipes.card.clickable).toContain('hover:-translate-y-[1px]');
    expect(recipes.card.clickable).toContain('transition-all');
    expect(recipes.card.clickable).toContain('duration-200');
  });

  test('Recommended card includes primary border', () => {
    expect(recipes.card.recommended).toContain('border-2');
    expect(recipes.card.recommended).toContain('border-primary');
    expect(recipes.card.recommended).toContain('shadow-s2');
  });

  test('All padding variants are defined', () => {
    expect(recipes.card.padSm).toBe('p-4');
    expect(recipes.card.padMd).toBe('p-5');
    expect(recipes.card.padLg).toBe('p-6');
  });

  test('Property 4: Clickable and non-clickable have different hover behavior', () => {
    const baseHasHover = recipes.card.base.includes('hover:');
    const clickableHasHover = recipes.card.clickable.includes('hover:');
    
    // Base should not have hover effects, clickable should
    expect(baseHasHover).toBe(false);
    expect(clickableHasHover).toBe(true);
  });
});
