import { 
  Calendar, 
  Clock, 
  Tag, 
  Edit2, 
  Check, 
  X,
  AlignLeft,
  Layout
} from "lucide-react";
import type { Todo, TodoStatus, TodoPriority, UpdateTodoDto } from "../../types";
import { useState } from "react";

interface TodoDetailInfoProps {
  todo: Todo;
  isEditing: boolean;
  editingField: string | null;
  startEditing: (field: string) => void;
  cancelEditing: () => void;
  onUpdate: (data: UpdateTodoDto) => Promise<any>;
}

const STATUS_OPTIONS: { value: TodoStatus; label: string; color: string }[] = [
  { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "completed", label: "Completed", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200" },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string; color: string }[] = [
  { value: "low", label: "Low Priority", color: "text-gray-600 bg-gray-50 border-gray-200" },
  { value: "medium", label: "Medium Priority", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  { value: "high", label: "High Priority", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "urgent", label: "Urgent", color: "text-red-700 bg-red-50 border-red-200" },
];

export const TodoDetailInfo = ({ 
  todo, 
  isEditing, 
  editingField, 
  startEditing, 
  cancelEditing, 
  onUpdate 
}: TodoDetailInfoProps) => {
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (field: string, value: string) => {
    setEditValue(value);
    startEditing(field);
  };

  const handleSave = async (field: string) => {
    await onUpdate({ [field]: editValue });
    cancelEditing();
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOption = STATUS_OPTIONS.find((s) => s.value === todo.status);
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.value === todo.priority);

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="relative group">
        {editingField === "title" ? (
          <div className="flex gap-2 items-start animate-in fade-in duration-200">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 text-2xl font-bold px-3 py-2 border-2 border-brand-500 rounded-lg bg-white text-gray-900 focus:outline-none shadow-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave("title");
                if (e.key === "Escape") cancelEditing();
              }}
            />
            <button onClick={() => handleSave("title")} className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={cancelEditing} className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <h2 
              onClick={() => handleStartEdit("title", todo.title)}
              className="text-2xl font-bold text-gray-900 flex-1 hover:text-brand-600 cursor-pointer transition-colors"
            >
              {todo.title}
            </h2>
            <button
              onClick={() => handleStartEdit("title", todo.title)}
              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-brand-600"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Status & Priority Grid */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={todo.status}
            onChange={(e) => onUpdate({ status: e.target.value as TodoStatus })}
            className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium cursor-pointer border hover:shadow-sm transition-all focus:ring-2 focus:ring-brand-500 focus:outline-none ${statusOption?.color}`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={todo.priority}
            onChange={(e) => onUpdate({ priority: e.target.value as TodoPriority })}
            className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium cursor-pointer border hover:shadow-sm transition-all focus:ring-2 focus:ring-brand-500 focus:outline-none ${priorityOption?.color}`}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <AlignLeft className="w-4 h-4 text-gray-500" />
          Description
        </label>
        
        {editingField === "description" ? (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border-2 border-brand-500 rounded-xl bg-white text-gray-900 focus:outline-none resize-none shadow-sm leading-relaxed"
              autoFocus
              placeholder="Add a detailed description..."
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={cancelEditing} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSave("description")} 
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => handleStartEdit("description", todo.description || "")}
            className={`group p-4 rounded-xl border border-transparent transition-all cursor-pointer ${
              todo.description 
                ? "bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm" 
                : "bg-gray-50 border-dashed border-gray-200 hover:border-brand-300 hover:bg-brand-50/30"
            }`}
          >
            {todo.description ? (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{todo.description}</p>
            ) : (
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Click to add a description...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
            <Layout className="w-4 h-4 text-brand-500" />
            Context Logic
          </div>
          <div className="space-y-3 text-sm">
             {/* Deadline Picker */}
             <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Deadline</span>
                <input
                  type="datetime-local"
                  value={todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value).toISOString() : null;
                    onUpdate({ dueDate: newDate });
                  }}
                  className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer hover:bg-gray-100 transition-colors"
                />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Estimate</span>
                <span className="font-medium text-gray-700">{todo.estimatedTime ? `${todo.estimatedTime} min` : "—"}</span>
             </div>
          </div>
        </div>
      </div>

        {/* Tags */}
        {todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 
                         text-gray-700 rounded-full text-sm font-medium border border-gray-200"
              >
                <Tag className="w-3 h-3 text-gray-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
    </div>
  );
};
