import { ArrowLeft, Trash2 } from "lucide-react";

interface TodoDetailHeaderProps {
  onBack: () => void;
  onDelete: () => void;
}

export const TodoDetailHeader = ({ onBack, onDelete }: TodoDetailHeaderProps) => {
  return (
    <div className="flex items-center gap-4 border-b border-gray-200 p-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <button
        onClick={onBack}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        title="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <h1 className="flex-1 text-lg font-semibold text-gray-900 truncate">
        Todo Details
      </h1>
      
      <button
        onClick={onDelete}
        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete todo"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
