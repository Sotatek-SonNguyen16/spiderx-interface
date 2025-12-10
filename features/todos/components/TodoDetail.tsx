"use client";

import { useCallback } from "react";
import { useTodoDetail } from "../hooks/useTodoDetail";
import { TodoDetailHeader } from "./detail/TodoDetailHeader";
import { TodoDetailInfo } from "./detail/TodoDetailInfo";
import { SubtasksList } from "./detail/SubtasksList";

interface TodoDetailProps {
  todoId: string;
  onBack: () => void;
  onDelete?: () => void;
}

/**
 * TodoDetail - Full detail view for a single todo
 * Displays all fields, subtasks, and allows editing
 */
export const TodoDetail = ({ todoId, onBack, onDelete }: TodoDetailProps) => {
  const {
    todo,
    loading,
    error,
    isEditing,
    editingField,
    updateTodo,
    deleteTodo,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    startEditing,
    cancelEditing,
  } = useTodoDetail(todoId);

  const handleDelete = useCallback(async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      await deleteTodo();
      onDelete?.();
      onBack();
    }
  }, [deleteTodo, onDelete, onBack]);

  if (loading && !todo) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white">
        <p className="text-red-500">{error}</p>
        <button onClick={onBack} className="text-brand-500 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white">
        <p className="text-gray-500">Todo not found</p>
        <button onClick={onBack} className="text-brand-500 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <TodoDetailHeader onBack={onBack} onDelete={handleDelete} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Main Info */}
              <div className="lg:col-span-2 space-y-8">
                 <TodoDetailInfo
                    todo={todo}
                    isEditing={isEditing}
                    editingField={editingField}
                    startEditing={startEditing}
                    cancelEditing={cancelEditing}
                    onUpdate={updateTodo}
                 />
              </div>

              {/* Right Column: Subtasks & Meta */}
              <div className="space-y-8">
                 <SubtasksList
                    todoId={todo.id}
                    todoTitle={todo.title}
                    todoDescription={todo.description || undefined}
                    subtasks={todo.subtasks}
                    onToggle={toggleSubtask}
                    onAdd={addSubtask}
                    onDelete={deleteSubtask}
                 />
                 
                 {/* Timestamps */}
                 <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="text-xs text-gray-400">
                      Created {new Date(todo.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last updated {new Date(todo.updatedAt).toLocaleString()}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;

