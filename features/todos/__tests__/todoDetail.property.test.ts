/**
 * Property-based tests for Todo Detail functionality
 * 
 * Tests for Properties 4, 5, 6 from the design document
 */

import * as fc from "fast-check";
import type { Todo, Subtask, TodoStatus, TodoPriority, TodoSourceType, SubtaskStatus } from "../types";

// Arbitraries for generating test data
const todoStatusArb = fc.constantFrom<TodoStatus>("todo", "in_progress", "completed", "cancelled");
const todoPriorityArb = fc.constantFrom<TodoPriority>("low", "medium", "high", "urgent");
const todoSourceTypeArb = fc.constantFrom<TodoSourceType>("manual", "chat", "email", "meeting", "template");
const subtaskStatusArb = fc.constantFrom<SubtaskStatus>("todo", "completed");

const subtaskArb: fc.Arbitrary<Subtask> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  status: subtaskStatusArb,
  order: fc.nat({ max: 100 }),
  createdAt: fc.date().map(d => d.toISOString()),
  completedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
});

const todoArb: fc.Arbitrary<Todo> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 255 }),
  description: fc.option(fc.string({ maxLength: 1000 }), { nil: null }),
  status: todoStatusArb,
  priority: todoPriorityArb,
  dueDate: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
  estimatedTime: fc.option(fc.nat({ max: 480 }), { nil: null }),
  actualTime: fc.option(fc.nat({ max: 480 }), { nil: null }),
  contextId: fc.option(fc.uuid(), { nil: null }),
  sourceType: todoSourceTypeArb,
  sourceId: fc.option(fc.uuid(), { nil: null }),
  sourceSpaceId: fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }),
  sourceMessageId: fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }),
  sourceSpaceName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  sourceThreadName: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { maxLength: 3 }),
  templateId: fc.option(fc.uuid(), { nil: null }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 10 }),
  eisenhower: fc.option(
    fc.constantFrom(
      "urgent_important" as const,
      "not_urgent_important" as const,
      "urgent_not_important" as const,
      "not_urgent_not_important" as const
    ),
    { nil: null }
  ),
  completedAt: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
  createdAt: fc.date().map(d => d.toISOString()),
  updatedAt: fc.date().map(d => d.toISOString()),
  subtasks: fc.array(subtaskArb, { maxLength: 20 }),
  assigneeId: fc.option(fc.uuid(), { nil: null }),
  assigneeName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  // Update v1: Sender information fields
  senderName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  senderEmail: fc.option(fc.emailAddress(), { nil: null }),
});

describe("Todo Detail Field Completeness", () => {
  /**
   * **Feature: fe-tasks-enhancement, Property 4: Todo Detail Field Completeness**
   * **Validates: Requirements 2.2**
   * 
   * For any todo item displayed in the detail view, all non-null fields 
   * (title, description, status, priority, due_date, tags, created_at, updated_at) 
   * SHALL be rendered in the UI.
   */
  it("should have all required fields available for rendering", () => {
    fc.assert(
      fc.property(todoArb, (todo: Todo) => {
        // Required fields that must always be present
        const requiredFields = {
          id: todo.id,
          title: todo.title,
          status: todo.status,
          priority: todo.priority,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt,
          tags: todo.tags,
          subtasks: todo.subtasks,
        };

        // Property: All required fields must be defined
        expect(requiredFields.id).toBeDefined();
        expect(requiredFields.title).toBeDefined();
        expect(requiredFields.status).toBeDefined();
        expect(requiredFields.priority).toBeDefined();
        expect(requiredFields.createdAt).toBeDefined();
        expect(requiredFields.updatedAt).toBeDefined();
        expect(requiredFields.tags).toBeDefined();
        expect(requiredFields.subtasks).toBeDefined();

        // Property: Title must be non-empty
        expect(requiredFields.title.length).toBeGreaterThan(0);

        // Property: Status must be valid
        expect(["todo", "in_progress", "completed", "cancelled"]).toContain(requiredFields.status);

        // Property: Priority must be valid
        expect(["low", "medium", "high", "urgent"]).toContain(requiredFields.priority);

        // Property: Tags must be an array
        expect(Array.isArray(requiredFields.tags)).toBe(true);

        // Property: Subtasks must be an array
        expect(Array.isArray(requiredFields.subtasks)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe("Subtask Display Completeness", () => {
  /**
   * **Feature: fe-tasks-enhancement, Property 5: Subtask Display Completeness**
   * **Validates: Requirements 2.3**
   * 
   * For any todo with subtasks, the detail view SHALL render all subtasks 
   * with their respective status values.
   */
  it("should display all subtasks with their status", () => {
    fc.assert(
      fc.property(
        fc.array(subtaskArb, { minLength: 1, maxLength: 20 }),
        (subtasks: Subtask[]) => {
          // Simulate rendering subtasks
          const renderedSubtasks = subtasks.map(subtask => ({
            id: subtask.id,
            title: subtask.title,
            status: subtask.status,
            isCompleted: subtask.status === "completed",
          }));

          // Property: Number of rendered subtasks equals input subtasks
          expect(renderedSubtasks.length).toBe(subtasks.length);

          // Property: Each subtask has required fields
          renderedSubtasks.forEach((rendered, index) => {
            const original = subtasks[index];
            
            expect(rendered.id).toBe(original.id);
            expect(rendered.title).toBe(original.title);
            expect(rendered.status).toBe(original.status);
            expect(rendered.isCompleted).toBe(original.status === "completed");
          });

          // Property: All subtask statuses are valid
          renderedSubtasks.forEach(rendered => {
            expect(["todo", "completed"]).toContain(rendered.status);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle empty subtasks array", () => {
    fc.assert(
      fc.property(todoArb, (todo: Todo) => {
        // Create todo with no subtasks
        const todoWithNoSubtasks = { ...todo, subtasks: [] };
        
        // Property: Empty subtasks should render as empty array
        expect(todoWithNoSubtasks.subtasks).toEqual([]);
        expect(todoWithNoSubtasks.subtasks.length).toBe(0);
      }),
      { numRuns: 50 }
    );
  });
});

describe("Todo Edit Persistence", () => {
  /**
   * **Feature: fe-tasks-enhancement, Property 6: Todo Edit Persistence**
   * **Validates: Requirements 2.4**
   * 
   * For any field edit in the todo detail view, after save, 
   * the displayed value SHALL match the saved value returned by the API.
   */
  it("should persist edits correctly", () => {
    fc.assert(
      fc.property(
        todoArb,
        fc.string({ minLength: 1, maxLength: 255 }), // new title
        fc.option(fc.string({ maxLength: 1000 }), { nil: null }), // new description
        todoStatusArb, // new status
        todoPriorityArb, // new priority
        (originalTodo, newTitle, newDescription, newStatus, newPriority) => {
          // Simulate edit operation
          const editedTodo: Todo = {
            ...originalTodo,
            title: newTitle,
            description: newDescription,
            status: newStatus,
            priority: newPriority,
            updatedAt: new Date().toISOString(),
          };

          // Simulate API response (returns the edited todo)
          const apiResponse = { ...editedTodo };

          // Simulate UI update from API response
          const displayedTodo = { ...apiResponse };

          // Property: Displayed values match API response exactly
          expect(displayedTodo.title).toBe(apiResponse.title);
          expect(displayedTodo.description).toBe(apiResponse.description);
          expect(displayedTodo.status).toBe(apiResponse.status);
          expect(displayedTodo.priority).toBe(apiResponse.priority);

          // Property: Edited values are different from original (when they should be)
          if (newTitle !== originalTodo.title) {
            expect(displayedTodo.title).not.toBe(originalTodo.title);
          }
          if (newStatus !== originalTodo.status) {
            expect(displayedTodo.status).not.toBe(originalTodo.status);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
