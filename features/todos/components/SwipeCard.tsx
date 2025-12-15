"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X, Calendar, Tag, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Todo } from "../types";

interface SwipeCardProps {
  todo: Todo;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isTop?: boolean;
}

export const SwipeCard = ({ todo, onAccept, onReject, isTop = false }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;
  const MAX_ROTATION = 15;

  // Calculate rotation based on drag offset
  const rotation = Math.min(Math.max((dragOffset.x / 300) * MAX_ROTATION, -MAX_ROTATION), MAX_ROTATION);
  
  // Calculate opacity for action indicators
  const acceptOpacity = Math.min(Math.max(dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const rejectOpacity = Math.min(Math.max(-dragOffset.x / SWIPE_THRESHOLD, 0), 1);

  // Handle mouse/touch start
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  // Handle mouse/touch move
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    
    setDragOffset({ x: deltaX, y: deltaY * 0.1 }); // Reduce vertical movement
  };

  // Handle mouse/touch end
  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x > 0) {
        onAccept(todo.id);
      } else {
        onReject(todo.id);
      }
    }
    
    // Reset position
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global event listeners for mouse
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startPos]);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-orange-600 bg-orange-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing
        ${isTop ? 'z-20' : 'z-10'}
        ${isDragging ? 'transition-none' : 'transition-all duration-300 ease-out'}
      `}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: isTop ? 1 : 0.8,
        scale: isTop ? 1 : 0.95,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Accept Indicator */}
      <div
        className="absolute inset-0 bg-green-500 rounded-2xl flex items-center justify-center z-30 pointer-events-none"
        style={{ opacity: acceptOpacity }}
      >
        <div className="text-white text-6xl font-bold flex items-center gap-4">
          <Check className="w-16 h-16" />
          <span>ACCEPT</span>
        </div>
      </div>

      {/* Reject Indicator */}
      <div
        className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-center z-30 pointer-events-none"
        style={{ opacity: rejectOpacity }}
      >
        <div className="text-white text-6xl font-bold flex items-center gap-4">
          <X className="w-16 h-16" />
          <span>REJECT</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getPriorityColor(todo.priority)}`} />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(todo.status)}`}>
                {todo.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            {todo.dueDate && (
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                </span>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
            {todo.title}
          </h2>
          
          {todo.description && (
            <p className="text-gray-600 text-lg leading-relaxed">
              {todo.description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {todo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assignee */}
          {todo.assigneeName && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Assigned to</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {todo.assigneeName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{todo.assigneeName}</span>
              </div>
            </div>
          )}

          {/* Source Info */}
          {todo.sourceType !== 'manual' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Source</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">
                  From {todo.sourceType === 'chat' ? 'Google Chat' : todo.sourceType}
                  {todo.sourceSpaceName && (
                    <span className="block font-medium text-gray-900 mt-1">
                      {todo.sourceSpaceName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subtasks */}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Subtasks ({todo.subtasks.filter(s => s.status === 'completed').length}/{todo.subtasks.length})
                </span>
              </div>
              <div className="space-y-2">
                {todo.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      subtask.status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {subtask.status === 'completed' && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      subtask.status === 'completed' 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900'
                    }`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            {todo.estimatedTime && (
              <div>
                <span className="font-medium">Estimated:</span>
                <div>{todo.estimatedTime}h</div>
              </div>
            )}
            {todo.actualTime && (
              <div>
                <span className="font-medium">Actual:</span>
                <div>{todo.actualTime}h</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">👈 Swipe left to reject • Swipe right to accept 👉</p>
            <p className="text-xs">Created {format(new Date(todo.createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};