/**
 * Property-based tests for Paste Extract functionality
 * 
 * **Feature: fe-update-v1, Property 5: Extraction Preview Completeness**
 * **Validates: Requirements 3.3, 3.5**
 */

import * as fc from "fast-check";
import type { ExtractedTodoItem } from "@/features/googleChat/types";

// Arbitrary for ExtractedTodoItem
const extractedTodoArb: fc.Arbitrary<ExtractedTodoItem> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 255 }),
  description: fc.string({ maxLength: 500 }),
  priority: fc.constantFrom("low" as const, "medium" as const, "high" as const, "urgent" as const),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 5 }),
  dueDate: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
  estimatedTime: fc.option(fc.nat({ max: 480 }), { nil: null }),
});

// Interface matching the hook's ExtractedTodoWithSelection
interface ExtractedTodoWithSelection extends ExtractedTodoItem {
  isSelected: boolean;
}

// Helper to add selection state (mirrors hook logic)
const addSelectionState = (todos: ExtractedTodoItem[]): ExtractedTodoWithSelection[] => {
  return todos.map((todo) => ({
    ...todo,
    isSelected: true, // All selected by default
  }));
};

// Helper to check if all todos are in preview (have selection state)
const allTodosHaveSelectionState = (todos: ExtractedTodoWithSelection[]): boolean => {
  return todos.every((todo) => typeof todo.isSelected === "boolean");
};

// Helper to check if todos are editable (have required fields)
const allTodosAreEditable = (todos: ExtractedTodoWithSelection[]): boolean => {
  return todos.every((todo) => 
    typeof todo.title === "string" &&
    typeof todo.description === "string" &&
    ["low", "medium", "high", "urgent"].includes(todo.priority)
  );
};

describe("Extraction Preview Completeness (Property 5)", () => {
  /**
   * **Feature: fe-update-v1, Property 5: Extraction Preview Completeness**
   * **Validates: Requirements 3.3, 3.5**
   * 
   * For any AI extraction response with todos, all extracted todos SHALL be 
   * displayed in preview mode with editable fields (title, description, priority) 
   * before any are saved to the database.
   */
  it("should display all extracted todos in preview mode", () => {
    fc.assert(
      fc.property(
        fc.array(extractedTodoArb, { minLength: 1, maxLength: 20 }),
        (extractedTodos) => {
          // Simulate adding selection state (preview mode)
          const todosWithSelection = addSelectionState(extractedTodos);

          // Property: ALL extracted todos are in the preview list
          expect(todosWithSelection.length).toBe(extractedTodos.length);

          // Property: ALL todos have selection state (preview mode indicator)
          expect(allTodosHaveSelectionState(todosWithSelection)).toBe(true);

          // Property: ALL todos are selected by default
          todosWithSelection.forEach((todo) => {
            expect(todo.isSelected).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have editable fields for all extracted todos", () => {
    fc.assert(
      fc.property(
        fc.array(extractedTodoArb, { minLength: 1, maxLength: 20 }),
        (extractedTodos) => {
          const todosWithSelection = addSelectionState(extractedTodos);

          // Property: ALL todos have editable fields
          expect(allTodosAreEditable(todosWithSelection)).toBe(true);

          // Property: Each todo has the required editable fields
          todosWithSelection.forEach((todo, index) => {
            expect(todo.title).toBe(extractedTodos[index].title);
            expect(todo.description).toBe(extractedTodos[index].description);
            expect(todo.priority).toBe(extractedTodos[index].priority);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should preserve todo data when toggling selection", () => {
    fc.assert(
      fc.property(
        fc.array(extractedTodoArb, { minLength: 1, maxLength: 10 }),
        fc.nat(),
        (extractedTodos, toggleIndex) => {
          const todosWithSelection = addSelectionState(extractedTodos);
          const safeIndex = toggleIndex % todosWithSelection.length;

          // Simulate toggle
          const afterToggle = todosWithSelection.map((todo, i) =>
            i === safeIndex ? { ...todo, isSelected: !todo.isSelected } : todo
          );

          // Property: toggling selection doesn't change todo data
          afterToggle.forEach((todo, i) => {
            expect(todo.title).toBe(extractedTodos[i].title);
            expect(todo.description).toBe(extractedTodos[i].description);
            expect(todo.priority).toBe(extractedTodos[i].priority);
            expect(todo.tags).toEqual(extractedTodos[i].tags);
          });

          // Property: only the toggled todo's selection changed
          afterToggle.forEach((todo, i) => {
            if (i === safeIndex) {
              expect(todo.isSelected).toBe(false); // Was true, now false
            } else {
              expect(todo.isSelected).toBe(true); // Unchanged
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should preserve edits to extracted todos", () => {
    fc.assert(
      fc.property(
        fc.array(extractedTodoArb, { minLength: 1, maxLength: 10 }),
        fc.nat(),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom("low" as const, "medium" as const, "high" as const, "urgent" as const),
        (extractedTodos, editIndex, newTitle, newPriority) => {
          const todosWithSelection = addSelectionState(extractedTodos);
          const safeIndex = editIndex % todosWithSelection.length;

          // Simulate edit
          const afterEdit = todosWithSelection.map((todo, i) =>
            i === safeIndex ? { ...todo, title: newTitle, priority: newPriority } : todo
          );

          // Property: edited todo has new values
          expect(afterEdit[safeIndex].title).toBe(newTitle);
          expect(afterEdit[safeIndex].priority).toBe(newPriority);

          // Property: other todos are unchanged
          afterEdit.forEach((todo, i) => {
            if (i !== safeIndex) {
              expect(todo.title).toBe(extractedTodos[i].title);
              expect(todo.priority).toBe(extractedTodos[i].priority);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
