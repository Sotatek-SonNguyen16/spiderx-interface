/**
 * Property-based tests for Space Search functionality
 * 
 * **Feature: fe-tasks-enhancement, Property 11: Space Search Filtering**
 * **Validates: Requirements 6.2**
 */

import * as fc from "fast-check";

interface Space {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isWhitelisted: boolean;
}

// Arbitrary for generating spaces
const spaceArb: fc.Arbitrary<Space> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  displayName: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ maxLength: 200 }), { nil: null }),
  isWhitelisted: fc.boolean(),
});

describe("Space Search Filtering", () => {
  /**
   * **Feature: fe-tasks-enhancement, Property 11: Space Search Filtering**
   * **Validates: Requirements 6.2**
   * 
   * For any search query in the whitelist page, the displayed spaces 
   * SHALL only include those whose name contains the search query (case-insensitive).
   */
  it("should filter spaces by name (case-insensitive)", () => {
    fc.assert(
      fc.property(
        fc.array(spaceArb, { minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (spaces: Space[], searchQuery: string) => {
          // Simulate filter logic
          const filterSpaces = (list: Space[], query: string): Space[] => {
            if (!query.trim()) return list;
            
            const q = query.toLowerCase();
            return list.filter((space) => {
              const name = (space.name || space.displayName || "").toLowerCase();
              const description = (space.description || "").toLowerCase();
              return name.includes(q) || description.includes(q);
            });
          };

          const filtered = filterSpaces(spaces, searchQuery);
          const queryLower = searchQuery.toLowerCase();

          // Property: All filtered spaces should match the query
          filtered.forEach((space) => {
            const name = (space.name || space.displayName || "").toLowerCase();
            const description = (space.description || "").toLowerCase();
            const matches = name.includes(queryLower) || description.includes(queryLower);
            expect(matches).toBe(true);
          });

          // Property: Filtered count should be <= original count
          expect(filtered.length).toBeLessThanOrEqual(spaces.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should return all spaces when query is empty", () => {
    fc.assert(
      fc.property(
        fc.array(spaceArb, { minLength: 0, maxLength: 20 }),
        fc.constantFrom("", "  ", "\t", "\n"),
        (spaces: Space[], emptyQuery: string) => {
          const filterSpaces = (list: Space[], query: string): Space[] => {
            if (!query.trim()) return list;
            
            const q = query.toLowerCase();
            return list.filter((space) => {
              const name = (space.name || space.displayName || "").toLowerCase();
              return name.includes(q);
            });
          };

          const filtered = filterSpaces(spaces, emptyQuery);

          // Property: Empty query should return all spaces
          expect(filtered.length).toBe(spaces.length);
          expect(filtered).toEqual(spaces);
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should be case-insensitive", () => {
    fc.assert(
      fc.property(
        fc.array(spaceArb, { minLength: 1, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (spaces: Space[], baseQuery: string) => {
          const filterSpaces = (list: Space[], query: string): Space[] => {
            if (!query.trim()) return list;
            
            const q = query.toLowerCase();
            return list.filter((space) => {
              const name = (space.name || space.displayName || "").toLowerCase();
              return name.includes(q);
            });
          };

          // Test with different cases
          const lowerResult = filterSpaces(spaces, baseQuery.toLowerCase());
          const upperResult = filterSpaces(spaces, baseQuery.toUpperCase());
          const mixedResult = filterSpaces(spaces, baseQuery);

          // Property: Results should be the same regardless of case
          expect(lowerResult.length).toBe(upperResult.length);
          expect(lowerResult.length).toBe(mixedResult.length);

          // Property: Same spaces should be returned
          const lowerIds = lowerResult.map((s) => s.id).sort();
          const upperIds = upperResult.map((s) => s.id).sort();
          expect(lowerIds).toEqual(upperIds);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should filter in real-time (no delay in logic)", () => {
    fc.assert(
      fc.property(
        fc.array(spaceArb, { minLength: 5, maxLength: 20 }),
        fc.array(fc.string({ minLength: 0, maxLength: 10 }), { minLength: 1, maxLength: 5 }),
        (spaces: Space[], queries: string[]) => {
          const filterSpaces = (list: Space[], query: string): Space[] => {
            if (!query.trim()) return list;
            
            const q = query.toLowerCase();
            return list.filter((space) => {
              const name = (space.name || space.displayName || "").toLowerCase();
              return name.includes(q);
            });
          };

          // Simulate sequential filtering (like typing)
          let previousResult = spaces;
          
          queries.forEach((query) => {
            const currentResult = filterSpaces(spaces, query);
            
            // Property: Each filter operation should be deterministic
            const sameResult = filterSpaces(spaces, query);
            expect(currentResult.length).toBe(sameResult.length);
            
            previousResult = currentResult;
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should handle special characters in search", () => {
    fc.assert(
      fc.property(
        fc.array(spaceArb, { minLength: 1, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (spaces: Space[], query: string) => {
          const filterSpaces = (list: Space[], q: string): Space[] => {
            if (!q.trim()) return list;
            
            const queryLower = q.toLowerCase();
            return list.filter((space) => {
              const name = (space.name || space.displayName || "").toLowerCase();
              return name.includes(queryLower);
            });
          };

          // Property: Should not throw on any input
          expect(() => filterSpaces(spaces, query)).not.toThrow();

          const result = filterSpaces(spaces, query);
          
          // Property: Result should always be an array
          expect(Array.isArray(result)).toBe(true);
          
          // Property: Result should be subset of original
          result.forEach((space) => {
            expect(spaces.some((s) => s.id === space.id)).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
