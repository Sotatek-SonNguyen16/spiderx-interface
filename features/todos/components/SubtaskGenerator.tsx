"use client";

import { useState, useCallback } from "react";
import { Sparkles, Check, X, Plus, Edit2, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useSubtaskGenerator } from "../hooks/useSubtaskGenerator";

interface SubtaskGeneratorProps {
  todoId: string;
  todoTitle: string;
  todoDescription?: string;
  onSubtasksGenerated: (subtasks: Array<{ title: string; order: number }>) => void;
  onCancel?: () => void;
}

/**
 * SubtaskGenerator - AI-powered subtask generation component
 * Allows generating, previewing, editing, and saving subtasks
 */
export const SubtaskGenerator = ({
  todoId,
  todoTitle,
  todoDescription,
  onSubtasksGenerated,
  onCancel,
}: SubtaskGeneratorProps) => {
  const {
    isGenerating,
    generatedSubtasks,
    error,
    isPreviewMode,
    generateSubtasks,
    toggleSubtaskSelection,
    updateSubtaskTitle,
    addSubtask,
    removeSubtask,
    getSelectedSubtasks,
    clearPreview,
    clearError,
  } = useSubtaskGenerator();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  const handleGenerate = useCallback(async () => {
    console.log("🔵 [SubtaskGenerator] Button clicked - generating subtasks");
    console.log("🔵 [SubtaskGenerator] todoTitle:", todoTitle);
    console.log("🔵 [SubtaskGenerator] todoDescription:", todoDescription);
    const result = await generateSubtasks(todoTitle, todoDescription);
    console.log("🔵 [SubtaskGenerator] Result:", result);
  }, [generateSubtasks, todoTitle, todoDescription]);

  const handleSave = useCallback(() => {
    const selected = getSelectedSubtasks();
    if (selected.length > 0) {
      onSubtasksGenerated(selected);
      clearPreview();
    }
  }, [getSelectedSubtasks, onSubtasksGenerated, clearPreview]);

  const handleCancel = useCallback(() => {
    clearPreview();
    onCancel?.();
  }, [clearPreview, onCancel]);

  const startEditing = useCallback((index: number, title: string) => {
    setEditingIndex(index);
    setEditValue(title);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingIndex !== null && editValue.trim()) {
      updateSubtaskTitle(editingIndex, editValue.trim());
    }
    setEditingIndex(null);
    setEditValue("");
  }, [editingIndex, editValue, updateSubtaskTitle]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue("");
  }, []);

  const handleAddSubtask = useCallback(() => {
    if (newSubtaskTitle.trim()) {
      addSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle("");
      setShowAddInput(false);
    }
  }, [newSubtaskTitle, addSubtask]);

  const selectedCount = generatedSubtasks.filter((s) => s.isSelected).length;

  // Initial state - show generate button
  if (!isPreviewMode && !isGenerating && !error) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleGenerate();
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 
                 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 
                 transition-all shadow-sm hover:shadow-md"
      >
        <Sparkles className="w-4 h-4" />
        Generate Subtasks with AI
      </button>
    );
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          <span className="text-sm text-purple-700 dark:text-purple-300">
            Generating subtasks with AI...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleGenerate();
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Try again
              </button>
              <button
                onClick={clearError}
                className="text-sm text-gray-500 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview mode
  return (
    <div className="border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 border-b border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              AI Generated Subtasks
            </span>
          </div>
          <span className="text-xs text-purple-500">
            {selectedCount} of {generatedSubtasks.length} selected
          </span>
        </div>
      </div>

      {/* Subtask List */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {generatedSubtasks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No subtasks generated. Try again or add manually.
          </p>
        ) : (
          generatedSubtasks.map((subtask, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                subtask.isSelected 
                  ? "bg-purple-50 dark:bg-purple-900/10" 
                  : "bg-gray-50 dark:bg-gray-800/50 opacity-60"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleSubtaskSelection(index)}
                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                  subtask.isSelected
                    ? "border-purple-500 bg-purple-500 text-white"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {subtask.isSelected && <Check className="w-3 h-3" />}
              </button>

              {/* Title */}
              {editingIndex === index ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <button onClick={saveEdit} className="p-1 text-green-500 hover:bg-green-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 text-sm ${
                    subtask.isSelected 
                      ? "text-gray-700 dark:text-gray-300" 
                      : "text-gray-400 line-through"
                  }`}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => startEditing(index, subtask.title)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeSubtask(index)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          ))
        )}

        {/* Add New Subtask */}
        {showAddInput ? (
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Enter subtask title..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSubtask();
                if (e.key === "Escape") {
                  setShowAddInput(false);
                  setNewSubtaskTitle("");
                }
              }}
            />
            <button
              onClick={handleAddSubtask}
              className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddInput(false);
                setNewSubtaskTitle("");
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 pt-2"
          >
            <Plus className="w-4 h-4" />
            Add subtask manually
          </button>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleGenerate();
          }}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          Regenerate
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedCount === 0}
            className="px-4 py-1.5 text-sm bg-purple-500 text-white rounded-lg
                     hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save {selectedCount} Subtask{selectedCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubtaskGenerator;
