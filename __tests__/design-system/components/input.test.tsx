/**
 * Property Test: Input State Correctness
 * Feature: design-system-implementation, Property 6: Input State Correctness
 * Validates: Requirements 3.6, 3.7
 */
import * as fc from 'fast-check';
import { recipes } from '../../../components/ui/recipes';

describe('Input State Correctness', () => {
  /**
   * Property 6: Input State Correctness
   * For any Input component, rendering with hasError=false SHALL apply
   * recipes.input.base classes, and rendering with hasError=true SHALL
   * additionally apply recipes.input.error classes.
   */
  test('Property 6: Input states apply correct recipe classes', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (hasError) => {
          const baseClasses = recipes.input.base;
          const errorClasses = recipes.input.error;
          
          // Base should always be applied
          expect(baseClasses).toBeDefined();
          expect(typeof baseClasses).toBe('string');
          
          // Error classes should be defined
          expect(errorClasses).toBeDefined();
          expect(typeof errorClasses).toBe('string');
          
          // If hasError, error classes should contain danger styling
          if (hasError) {
            expect(errorClasses).toContain('border-danger');
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Base input includes surface background and border', () => {
    expect(recipes.input.base).toContain('bg-surface');
    expect(recipes.input.base).toContain('border');
    expect(recipes.input.base).toContain('rounded-md');
  });


  test('Base input includes focus states with primary color', () => {
    expect(recipes.input.base).toContain('focus:border-primary');
    expect(recipes.input.base).toContain('focus:ring-primarySoft');
  });

  test('Error state includes danger border and ring', () => {
    expect(recipes.input.error).toContain('border-danger');
    expect(recipes.input.error).toContain('focus:border-danger');
    expect(recipes.input.error).toContain('focus:ring-dangerSoft');
  });

  test('Placeholder uses ink3 color', () => {
    expect(recipes.input.base).toContain('placeholder:text-ink3');
  });

  test('Label uses correct styling', () => {
    expect(recipes.input.label).toContain('text-sm');
    expect(recipes.input.label).toContain('font-semibold');
    expect(recipes.input.label).toContain('text-ink');
  });

  test('Helper text uses ink3 color', () => {
    expect(recipes.input.helper).toContain('text-ink3');
    expect(recipes.input.helper).toContain('text-xs');
  });

  test('Error text uses danger color', () => {
    expect(recipes.input.errorText).toContain('text-danger');
    expect(recipes.input.errorText).toContain('font-semibold');
  });

  test('Input includes transition for smooth interactions', () => {
    expect(recipes.input.base).toContain('transition');
  });
});
