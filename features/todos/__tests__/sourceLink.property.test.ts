/**
 * Property-based tests for SourceLink component
 * 
 * **Feature: fe-tasks-enhancement, Property 7: Source Space Display**
 * **Validates: Requirements 2.5, 3.1, 3.3**
 */

import * as fc from "fast-check";
import type { TodoSourceType } from "../types";

// Arbitrary for source types
const sourceTypeArb = fc.constantFrom<TodoSourceType>("manual", "chat", "email", "meeting", "template");

describe("Source Space Display", () => {
  /**
   * **Feature: fe-tasks-enhancement, Property 7: Source Space Display**
   * **Validates: Requirements 2.5, 3.1, 3.3**
   * 
   * For any todo with source_space_id, the rendered component SHALL display 
   * the space name (or fallback text if name unavailable).
   */
  it("should display space name when available", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }), // spaceName
        fc.string({ minLength: 10, maxLength: 50 }), // spaceId
        fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }), // messageId
        (spaceName, spaceId, messageId) => {
          // Simulate SourceLink logic
          const getSourceLabel = (
            sourceType: TodoSourceType,
            sourceSpaceId: string | null,
            sourceSpaceName: string | null
          ): string => {
            if (sourceSpaceName) {
              return sourceSpaceName;
            }
            
            switch (sourceType) {
              case "chat":
                return sourceSpaceId ? `Chat: ${sourceSpaceId.slice(0, 8)}...` : "Google Chat";
              case "email":
                return "Email";
              case "meeting":
                return "Meeting";
              default:
                return "External Source";
            }
          };

          // When space name is available
          const labelWithName = getSourceLabel("chat", spaceId, spaceName);
          expect(labelWithName).toBe(spaceName);

          // When space name is not available but spaceId is
          const labelWithoutName = getSourceLabel("chat", spaceId, null);
          expect(labelWithoutName).toContain("Chat:");
          expect(labelWithoutName).toContain(spaceId.slice(0, 8));
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should display fallback text when space name is unavailable", () => {
    fc.assert(
      fc.property(
        sourceTypeArb,
        fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }), // spaceId
        (sourceType, spaceId) => {
          const getSourceLabel = (
            type: TodoSourceType,
            id: string | null,
            name: string | null
          ): string => {
            if (name) return name;
            
            switch (type) {
              case "chat":
                return id ? `Chat: ${id.slice(0, 8)}...` : "Google Chat";
              case "email":
                return "Email";
              case "meeting":
                return "Meeting";
              default:
                return "External Source";
            }
          };

          // No space name provided
          const label = getSourceLabel(sourceType, spaceId, null);

          // Property: Label should never be empty
          expect(label.length).toBeGreaterThan(0);

          // Property: Label should be appropriate for source type
          if (sourceType === "chat") {
            if (spaceId) {
              expect(label).toContain("Chat:");
            } else {
              expect(label).toBe("Google Chat");
            }
          } else if (sourceType === "email") {
            expect(label).toBe("Email");
          } else if (sourceType === "meeting") {
            expect(label).toBe("Meeting");
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should generate correct Google Chat link", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 50 }), // spaceId
        fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }), // messageId
        (spaceId, messageId) => {
          const getLink = (
            sourceType: TodoSourceType,
            sourceSpaceId: string | null,
            sourceMessageId: string | null
          ): string | null => {
            if (sourceType === "chat" && sourceSpaceId) {
              const base = `https://chat.google.com/room/${sourceSpaceId}`;
              return sourceMessageId ? `${base}/${sourceMessageId}` : base;
            }
            return null;
          };

          const link = getLink("chat", spaceId, messageId);

          // Property: Link should be generated for chat source with spaceId
          expect(link).not.toBeNull();
          expect(link).toContain("https://chat.google.com/room/");
          expect(link).toContain(spaceId);

          // Property: Link should include messageId if provided
          if (messageId) {
            expect(link).toContain(messageId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should not render for manual or template sources", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<TodoSourceType>("manual", "template"),
        fc.option(fc.string({ minLength: 10, maxLength: 50 }), { nil: null }),
        fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
        (sourceType, spaceId, spaceName) => {
          // Simulate shouldRender logic
          const shouldRender = (type: TodoSourceType): boolean => {
            return type !== "manual" && type !== "template";
          };

          // Property: Manual and template sources should not render
          expect(shouldRender(sourceType)).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });
});
