"use client";

import { useState } from "react";
import { Check, X, Edit2, Save, Loader2 } from "lucide-react";
import type { ExtractedTodoWithSelection } from "../hooks/usePasteExtract";
import type { TodoPriority } from "../types";

interface ExtractedTodoPreviewProps {
  todos: ExtractedTodoWithSelection[];
  onToggleSelect: (index: number) => void;
  onUpdateTodo: (index: number, updates: Partial<ExtractedTodoWithSelection>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  selectedCount: number;
}

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

/**
 * ExtractedTodoPreview - Preview and edit extracted todos before saving
 * **Feature: fe-update-v1, Requirements 3.3, 3.4, 3.5**
 */
export const ExtractedTodoPreview = ({
  todos,
  onToggleSelect,
  onUpdateTodo,
  onSave,
  onCancel,
  saving = false,
  selectedCount,
}: ExtractedTodoPreviewProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    priority: TodoPriority;
  }>({ title: "", description: "", priority: "medium" });

  const startEditing = (index: number) => {
    const todo = todos[index];
    setEditForm({
      title: todo.title,
      description: todo.description ?? "",
      priority: todo.priority,
    });
    setEditingIndex(index);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      onUpdateTodo(editingIndex, editForm);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Extracted Todos ({todos.length})
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {selectedCount} selected
        </span>
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {todos.map((todo, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-colors ${
              todo.isSelected
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
            }`}
          >
            {editingIndex === index ? (
              // Edit mode
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Title"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={2}
                  placeholder="Description"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as TodoPriority })}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="flex-1" />
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg
                             hover:bg-blue-600 text-sm"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleSelect(index)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                            transition-colors ${
                              todo.isSelected
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                >
                  {todo.isSelected && <Check className="w-3 h-3 text-white" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {todo.title}
                  </h4>
                  {todo.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {todo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex gap-1">
                        {todo.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 
                                     text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => startEditing(index)}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 
                           dark:hover:text-gray-300 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 
                   dark:hover:text-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving || selectedCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg
                   hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save {selectedCount} Todo{selectedCount !== 1 ? "s" : ""}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExtractedTodoPreview;
