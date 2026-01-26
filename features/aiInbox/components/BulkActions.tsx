/**
 * BulkActions Component
 * Bulk selection and actions toolbar
 */

"use client";

import React, { useState } from "react";
import { useAiInbox } from "../hooks/useAiInbox";

export function BulkActions() {
  const {
    selectedCount,
    selectAll,
    clearSelection,
    bulkAccept,
    bulkReject,
    suggestions,
  } = useAiInbox();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>("not_a_task");
  const [rejectComment, setRejectComment] = useState("");
  const [processing, setProcessing] = useState(false);

  const allSelected =
    selectedCount === suggestions.length && suggestions.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  const handleBulkAccept = async () => {
    setProcessing(true);
    try {
      await bulkAccept();
      // Success toast could be shown here
    } catch (error) {
      console.error("Bulk accept failed", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    setProcessing(true);
    try {
      await bulkReject({
        reason_code: rejectReason as any,
        comment: rejectComment || undefined,
      });
      setShowRejectDialog(false);
      setRejectComment("");
    } catch (error) {
      console.error("Bulk reject failed", error);
    } finally {
      setProcessing(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              {selectedCount} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkAccept}
              disabled={processing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              ✓ Accept All
            </button>

            <button
              onClick={() => setShowRejectDialog(true)}
              disabled={processing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              ✕ Reject All
            </button>

            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Reject {selectedCount} Suggestions
            </h3>

            <div className="space-y-3">
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
                  <option value="incorrect_extraction">
                    Incorrect Extraction
                  </option>
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
                  rows={3}
                  placeholder="Add additional context..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBulkReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                {processing ? "Rejecting..." : "Confirm Reject All"}
              </button>
              <button
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
