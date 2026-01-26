/**
 * SuggestionActions Component
 * Action buttons for accepting, editing, and rejecting suggestions
 */

"use client";

import React, { useState } from "react";
import type { SuggestionWithConfidenceLevel } from "../types";
import { useSuggestion } from "../hooks/useSuggestion";

interface SuggestionActionsProps {
  suggestion: SuggestionWithConfidenceLevel;
}

export function SuggestionActions({ suggestion }: SuggestionActionsProps) {
  const { accept, reject, isAccepting, isRejecting } = useSuggestion(
    suggestion.suggestion_id
  );

  const [showEditForm, setShowEditForm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [edits, setEdits] = useState({
    title: suggestion.title,
    description: suggestion.description || "",
    priority: suggestion.priority,
    due_date: suggestion.due_date || "",
  });
  const [rejectReason, setRejectReason] = useState<string>("not_a_task");
  const [rejectComment, setRejectComment] = useState("");

  const handleAccept = async () => {
    const success = await accept();
    if (success) {
      // Success feedback could be handled here
      console.log("Suggestion accepted successfully");
    }
  };

  const handleAcceptWithEdits = async () => {
    const success = await accept(edits);
    if (success) {
      setShowEditForm(false);
    }
  };

  const handleReject = async () => {
    const success = await reject({
      reason_code: rejectReason as any,
      comment: rejectComment || undefined,
    });
    if (success) {
      setShowRejectDialog(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Actions */}
      {!showEditForm && !showRejectDialog && (
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isAccepting ? "Accepting..." : "✓ Accept"}
          </button>

          <button
            onClick={() => setShowEditForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ✎ Edit
          </button>

          <button
            onClick={() => setShowRejectDialog(true)}
            disabled={isRejecting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isRejecting ? "Rejecting..." : "✕ Reject"}
          </button>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <h4 className="font-semibold text-gray-900">Edit Before Accepting</h4>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={edits.title}
              onChange={(e) => setEdits({ ...edits, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={edits.description}
              onChange={(e) =>
                setEdits({ ...edits, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={edits.priority}
                onChange={(e) =>
                  setEdits({ ...edits, priority: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={
                  edits.due_date
                    ? new Date(edits.due_date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEdits({
                    ...edits,
                    due_date: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAcceptWithEdits}
              disabled={isAccepting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isAccepting ? "Accepting..." : "Accept with Changes"}
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="bg-red-50 rounded-lg p-4 space-y-3 border border-red-200">
          <h4 className="font-semibold text-gray-900">Reject Suggestion</h4>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="not_a_task">Not a Task</option>
              <option value="duplicate">Duplicate</option>
              <option value="already_done">Already Done</option>
              <option value="not_relevant">Not Relevant</option>
              <option value="incorrect_extraction">Incorrect Extraction</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Comment (Optional)
            </label>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              rows={2}
              placeholder="Add additional context..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isRejecting ? "Rejecting..." : "Confirm Reject"}
            </button>
            <button
              onClick={() => setShowRejectDialog(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
