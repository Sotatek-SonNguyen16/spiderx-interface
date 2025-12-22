"use client";

import { AIBadge } from "./AIBadge";
import { MetaRow } from "./MetaRow";
import { SourcePreview } from "./SourcePreview";
import { ActionHint } from "./ActionHint";
import type { Todo } from "../../types";

/**
 * CardContent Component
 * Displays task information in the correct order for queue cards
 * Order: AI badge, task title, meta row, source preview, action hint
 * 
 * Requirements: 2.1, 2.3, 2.7
 * Note: NO checkbox elements - Queue is not Todo
 */

interface CardContentProps {
  task: Todo;
}

export const CardContent = ({ task }: CardContentProps) => {
  return (
    <div className="flex flex-col h-full p-6">
      {/* 1. AI Badge - always at top */}
      <AIBadge
        isAIDetected={task.isAiGenerated || false}
        sourceType={task.sourceType}
        sourceName={task.sourceSpaceName}
      />

      {/* 2. Task Title - 18px semibold, max 2 lines */}
      <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2" style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {task.title}
      </h2>

      {/* 3. Meta Row - assignee, due date, priority */}
      <MetaRow
        assigneeName={task.assigneeName}
        dueDate={task.dueDate}
        priority={task.priority}
      />

      {/* 4. Source Preview - max 2 lines of context */}
      <SourcePreview
        preview={task.description}
        sourceType={task.sourceType}
      />

      {/* Spacer to push action hint to bottom */}
      <div className="flex-1" />

      {/* 5. Action Hint - at bottom */}
      <ActionHint />
    </div>
  );
};
