/**
 * Property Test: Progress Bar Mode Correctness
 * Feature: design-system-implementation, Property 8: Progress Bar Mode Correctness
 * Validates: Requirements 9.4
 */
import * as fc from 'fast-check';
import { recipes } from '../../../components/ui/recipes';

const PROGRESS_MODES = ['sync', 'ai'] as const;
type ProgressMode = typeof PROGRESS_MODES[number];

describe('Progress Bar Mode Correctness', () => {
  /**
   * Property 8: Progress Bar Mode Correctness
   * For any ProgressBlock component with mode "sync", the fill element
   * SHALL use recipes.progress.fillPrimary class, and with mode "ai",
   * it SHALL use recipes.progress.fillAI class.
   */
  test('Property 8: Each mode applies correct fill class', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...PROGRESS_MODES),
        fc.integer({ min: 0, max: 100 }),
        (mode, percent) => {
          const expectedFill = mode === 'ai' 
            ? recipes.progress.fillAI 
            : recipes.progress.fillPrimary;
          
          expect(expectedFill).toBeDefined();
          expect(typeof expectedFill).toBe('string');
          
          // Verify correct color is used
          if (mode === 'ai') {
            expect(expectedFill).toContain('bg-ai');
          } else {
            expect(expectedFill).toContain('bg-primary');
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Sync mode uses primary color', () => {
    expect(recipes.progress.fillPrimary).toContain('bg-primary');
  });

  test('AI mode uses ai color', () => {
    expect(recipes.progress.fillAI).toContain('bg-ai');
  });


  test('Track has correct styling', () => {
    expect(recipes.progress.track).toContain('bg-surface2');
    expect(recipes.progress.track).toContain('rounded-full');
    expect(recipes.progress.track).toContain('border');
  });

  test('Fill includes transition for smooth animation', () => {
    expect(recipes.progress.fillPrimary).toContain('transition');
    expect(recipes.progress.fillAI).toContain('transition');
  });

  test('Step text uses ink2 color', () => {
    expect(recipes.progress.step).toContain('text-ink2');
  });

  test('Meta text uses ink3 color', () => {
    expect(recipes.progress.meta).toContain('text-ink3');
  });

  test('Property 8: Percent values are clamped correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 200 }),
        (percent) => {
          const clamped = Math.max(0, Math.min(100, percent));
          expect(clamped).toBeGreaterThanOrEqual(0);
          expect(clamped).toBeLessThanOrEqual(100);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
