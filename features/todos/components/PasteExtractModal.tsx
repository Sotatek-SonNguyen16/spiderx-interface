"use client";

import { useState, useCallback } from "react";
import { X, Clipboard, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { usePasteExtract } from "../hooks/usePasteExtract";
import { ExtractedTodoPreview } from "./ExtractedTodoPreview";

interface PasteExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractComplete?: () => void;
}

/**
 * PasteExtractModal - Modal for pasting text and extracting todos
 * **Feature: fe-update-v1, Requirements 3.1, 3.2, 3.6, 3.7**
 */
export const PasteExtractModal = ({
  isOpen,
  onClose,
  onExtractComplete,
}: PasteExtractModalProps) => {
  const [text, setText] = useState("");

  const {
    isExtracting,
    extractedTodos,
    extractError,
    isSaving,
    saveError,
    hasExtractedTodos,
    selectedCount,
    extractFromText,
    toggleTodoSelection,
    updateExtractedTodo,
    saveSelectedTodos,
    clearExtractedTodos,
    clearError,
  } = usePasteExtract();

  const handleExtract = useCallback(async () => {
    const result = await extractFromText(text);
    if (result.success) {
      // Keep text for reference, show preview
    }
  }, [text, extractFromText]);

  const handleSave = useCallback(async () => {
    const result = await saveSelectedTodos();
    if (result.success) {
      setText("");
      onExtractComplete?.();
      onClose();
    }
  }, [saveSelectedTodos, onExtractComplete, onClose]);

  const handleClose = useCallback(() => {
    setText("");
    clearExtractedTodos();
    onClose();
  }, [clearExtractedTodos, onClose]);

  const handleBack = useCallback(() => {
    clearExtractedTodos();
  }, [clearExtractedTodos]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {hasExtractedTodos ? "Review Extracted Todos" : "Extract Todos from Text"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {hasExtractedTodos ? (
              // Preview mode
              <div>
                <button
                  onClick={handleBack}
                  className="text-sm text-blue-500 hover:text-blue-600 mb-4"
                >
                  ← Back to text input
                </button>
                <ExtractedTodoPreview
                  todos={extractedTodos}
                  onToggleSelect={toggleTodoSelection}
                  onUpdateTodo={updateExtractedTodo}
                  onSave={handleSave}
                  onCancel={handleClose}
                  saving={isSaving}
                  selectedCount={selectedCount}
                />
                {saveError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{saveError}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Input mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste your text below
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste meeting notes, emails, chat messages, or any text containing action items..."
                    className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500 resize-none
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Error message */}
                {extractError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm text-red-700 dark:text-red-300">{extractError}</span>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={handleExtract}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Retry
                          </button>
                          <button
                            onClick={clearError}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExtract}
                    disabled={isExtracting || !text.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg
                             hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4" />
                        Extract Todos
                      </>
                    )}
                  </button>
                </div>

                {/* Help text */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  AI will analyze your text and extract actionable items as todos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PasteExtractModal;
