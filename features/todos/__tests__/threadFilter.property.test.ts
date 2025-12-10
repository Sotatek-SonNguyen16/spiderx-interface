/**
 * Property-based tests for Thread Filter functionality
 * 
 * **Feature: fe-update-v1, Properties 1, 2, 3**
 * **Validates: Requirements 1.2, 1.3, 1.5**
 */

import * as fc from "fast-check";
import type { Todo, TodoStatus, TodoPriority, TodoSourceType } from "../types";
import type { ConnectedThread } from "../types/thread";

// Arbitraries for generating test data
const todoStatusArb = fc.constantFrom<TodoStatus>("todo", "in_progress", "completed", "cancelled");
const todoPriorityArb = fc.constantFrom<TodoPriority>("low", "medium", "high", "urgent");
const todoSourceTypeArb = fc.constantFrom<TodoSourceType>("manual", "chat", "email", "meeting", "template");

const threadArb: fc.Arbitrary<ConnectedThread> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  displayName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
});

// Generate a todo with optional sourceSpaceId from a list of thread IDs
const todoWithThreadArb = (threadIds: string[]): fc.Arbitrary<Todo> => {
  const sourceSpaceIdArb = threadIds.length > 0
    ? fc.option(fc.constantFrom(...threadIds), { nil: null })
    : fc.constant(null);

  return fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 255 }),
    description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
    status: todoStatusArb,
    priority: todoPriorityArb,
    dueDate: fc.option(fc.date().map(d => d.toISOString()), { nil: null }),
    estimatedTime: fc.option(fc.nat({ max: 480 }), { nil: null }),
    actualTime: fc.option(fc.nat({ max: 480 }), { nil: null }),
    contextId: fc.option(fc.uuid(), { nil: null }),
    sourceType: todoSourceTypeArb,
    sourceId: fc.option(fc.uuid(), { nil: null }),
    sourceSpaceId: sourceSpaceIdArb,
    sourceMessageId: fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }),
    sourceSpaceName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    sourceThreadName: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { maxLength: 3 }),
    templateId: fc.option(fc.uuid(), { nil: null }),
    tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 5 }),
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
    subtasks: fc.constant([]),
    assigneeId: fc.option(fc.uuid(), { nil: null }),
    assigneeName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    senderName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    senderEmail: fc.option(fc.emailAddress(), { nil: null }),
  });
};

// Helper function to filter todos by thread (mirrors hook logic)
const filterTodosByThread = (todos: Todo[], threadId: string | null): Todo[] => {
  if (!threadId) return todos;
  return todos.filter((todo) => todo.sourceSpaceId === threadId);
};

// Helper function to calculate todo counts per thread
const calculateTodoCounts = (todos: Todo[], threads: ConnectedThread[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  threads.forEach((thread) => { counts[thread.id] = 0; });
  todos.forEach((todo) => {
    if (todo.sourceSpaceId && counts[todo.sourceSpaceId] !== undefined) {
      counts[todo.sourceSpaceId]++;
    }
  });
  return counts;
};

describe("Thread Filter Correctness (Property 1)", () => {
  /**
   * **Feature: fe-update-v1, Property 1: Thread Filter Correctness**
   * **Validates: Requirements 1.2**
   * 
   * For any selected thread ID and todo list, all displayed todos 
   * SHALL have a sourceSpaceId matching the selected thread ID.
   */
  it("should only show todos matching the selected thread", () => {
    fc.assert(
      fc.property(
        // Generate 1-5 threads
        fc.array(threadArb, { minLength: 1, maxLength: 5 }),
        (threads) => {
          // Generate todos with sourceSpaceIds from the thread list
          const threadIds = threads.map(t => t.id);
          
          return fc.assert(
            fc.property(
              fc.array(todoWithThreadArb(threadIds), { minLength: 0, maxLength: 20 }),
              fc.constantFrom(...threadIds),
              (todos, selectedThreadId) => {
                const filtered = filterTodosByThread(todos, selectedThreadId);
                
                // Property: ALL filtered todos have sourceSpaceId === selectedThreadId
                filtered.forEach((todo) => {
                  expect(todo.sourceSpaceId).toBe(selectedThreadId);
                });
              }
            ),
            { numRuns: 50 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe("Thread Filter Clear (Property 2)", () => {
  /**
   * **Feature: fe-update-v1, Property 2: Thread Filter Clear**
   * **Validates: Requirements 1.3**
   * 
   * For any todo list, when no thread filter is applied (selectedThreadId is null),
   * the displayed todos SHALL equal the complete unfiltered todo list.
   */
  it("should show all todos when filter is cleared", () => {
    fc.assert(
      fc.property(
        fc.array(threadArb, { minLength: 0, maxLength: 5 }),
        (threads) => {
          const threadIds = threads.map(t => t.id);
          
          return fc.assert(
            fc.property(
              fc.array(todoWithThreadArb(threadIds), { minLength: 0, maxLength: 20 }),
              (todos) => {
                const filtered = filterTodosByThread(todos, null);
                
                // Property: filtered list equals original list
                expect(filtered).toEqual(todos);
                expect(filtered.length).toBe(todos.length);
              }
            ),
            { numRuns: 50 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe("Thread Todo Count Accuracy (Property 3)", () => {
  /**
   * **Feature: fe-update-v1, Property 3: Thread Todo Count Accuracy**
   * **Validates: Requirements 1.5**
   * 
   * For any connected thread displayed in the sidebar, the shown todo count 
   * SHALL equal the actual count of todos with sourceSpaceId matching that thread's ID.
   */
  it("should calculate accurate todo counts per thread", () => {
    fc.assert(
      fc.property(
        fc.array(threadArb, { minLength: 1, maxLength: 5 }),
        (threads) => {
          const threadIds = threads.map(t => t.id);
          
          return fc.assert(
            fc.property(
              fc.array(todoWithThreadArb(threadIds), { minLength: 0, maxLength: 30 }),
              (todos) => {
                const counts = calculateTodoCounts(todos, threads);
                
                // Property: each count matches actual filtered count
                threads.forEach((thread) => {
                  const actualCount = todos.filter(t => t.sourceSpaceId === thread.id).length;
                  expect(counts[thread.id]).toBe(actualCount);
                });
              }
            ),
            { numRuns: 50 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should handle threads with zero todos", () => {
    fc.assert(
      fc.property(
        fc.array(threadArb, { minLength: 2, maxLength: 5 }),
        (threads) => {
          // Only use first thread for todos, others should have 0
          const firstThreadId = threads[0].id;
          
          return fc.assert(
            fc.property(
              fc.array(todoWithThreadArb([firstThreadId]), { minLength: 1, maxLength: 10 }),
              (todos) => {
                const counts = calculateTodoCounts(todos, threads);
                
                // Property: threads without todos have count 0
                threads.slice(1).forEach((thread) => {
                  expect(counts[thread.id]).toBe(0);
                });
              }
            ),
            { numRuns: 30 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });
});
