import { useState } from "react";
import { Plus, CheckCircle2, Circle, Trash2, CheckCircle, Wand2 } from "lucide-react";
import type { Subtask } from "../../types";
import { SubtaskGenerator } from "../SubtaskGenerator";

interface SubtasksListProps {
  todoId: string;
  todoTitle: string;
  todoDescription?: string;
  subtasks: Subtask[];
  onToggle: (id: string) => Promise<any>;
  onAdd: (title: string) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export const SubtasksList = ({ 
  todoId, 
  todoTitle, 
  todoDescription,
  subtasks, 
  onToggle, 
  onAdd, 
  onDelete 
}: SubtasksListProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = async () => {
    if (!newSubtaskTitle.trim()) return;
    await onAdd(newSubtaskTitle.trim());
    setNewSubtaskTitle("");
    setShowAdd(false);
  };

  const handleGenerate = async (items: { title: string }[]) => {
      for (const item of items) {
          await onAdd(item.title);
      }
  };

  const completedCount = subtasks.filter(s => s.status === 'completed').length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
           <CheckCircle className="w-5 h-5 text-brand-500" />
           Subtasks 
           <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
             {completedCount}/{totalCount}
           </span>
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors border border-brand-200"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
             <div 
               className="bg-brand-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
               style={{ width: `${progress}%` }} 
             />
          </div>
      )}

      {/* AI Generator */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2 text-violet-800 font-medium text-sm">
            <Wand2 className="w-4 h-4" />
            AI Assistant
        </div>
        <SubtaskGenerator
            todoId={todoId}
            todoTitle={todoTitle}
            todoDescription={todoDescription}
            onSubtasksGenerated={async (generatedSubtasks) => {
                await handleGenerate(generatedSubtasks);
            }}
        />
      </div>

      {/* Add Subtask Input */}
      {showAdd && (
        <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2.5 border border-brand-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button onClick={handleAdd} className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">
            Add
          </button>
          <button 
            onClick={() => { setShowAdd(false); setNewSubtaskTitle(""); }}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {subtasks.length === 0 && !showAdd ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-400">No subtasks yet. Add one manually or use AI to generate.</p>
          </div>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <button 
                onClick={() => onToggle(subtask.id)}
                className="text-gray-400 hover:text-brand-600 transition-colors"
              >
                {subtask.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              
              <span className={`flex-1 text-sm ${
                subtask.status === "completed" 
                  ? "text-gray-400 line-through decoration-gray-300" 
                  : "text-gray-700 font-medium"
              }`}>
                {subtask.title}
              </span>
              
              <button
                onClick={() => onDelete(subtask.id)}
                className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete subtask"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
