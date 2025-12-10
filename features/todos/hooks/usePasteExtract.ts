"use client";

import { useState, useCallback } from "react";
import { googleChatApi } from "@/features/googleChat/api/googleChat.api";
import { todoService } from "../services/todo.service";
import type { ExtractedTodoItem } from "@/features/googleChat/types";
import type { CreateTodoDto } from "../types";

export interface ExtractedTodoWithSelection extends ExtractedTodoItem {
  isSelected: boolean;
}

interface PasteExtractState {
  isExtracting: boolean;
  extractedTodos: ExtractedTodoWithSelection[];
  extractError: string | null;
  isSaving: boolean;
  saveError: string | null;
}

/**
 * Hook for extracting todos from pasted text
 * **Feature: fe-update-v1, Requirements 3.2, 3.3, 3.4, 3.5**
 */
export const usePasteExtract = () => {
  const [state, setState] = useState<PasteExtractState>({
    isExtracting: false,
    extractedTodos: [],
    extractError: null,
    isSaving: false,
    saveError: null,
  });

  /**
   * Extract todos from text
   * **Property 5: Extraction Preview Completeness**
   */
  const extractFromText = useCallback(async (text: string): Promise<{
    success: boolean;
    todos?: ExtractedTodoWithSelection[];
    error?: string;
  }> => {
    if (!text.trim()) {
      return { success: false, error: "Please paste some text to extract todos." };
    }

    setState((prev) => ({
      ...prev,
      isExtracting: true,
      extractError: null,
      extractedTodos: [],
    }));

    try {
      const response = await googleChatApi.extractTodosFromText({
        text,
        auto_save: false, // Don't auto-save, show preview first
      });

      if (response.todos.length === 0) {
        setState((prev) => ({
          ...prev,
          isExtracting: false,
          extractError: "No action items found in the text.",
        }));
        return { success: false, error: "No action items found in the text." };
      }

      // Add selection state to each todo (all selected by default)
      const todosWithSelection: ExtractedTodoWithSelection[] = response.todos.map((todo) => ({
        ...todo,
        isSelected: true,
      }));

      setState((prev) => ({
        ...prev,
        isExtracting: false,
        extractedTodos: todosWithSelection,
      }));

      return { success: true, todos: todosWithSelection };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to extract todos";
      setState((prev) => ({
        ...prev,
        isExtracting: false,
        extractError: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Toggle selection of an extracted todo
   */
  const toggleTodoSelection = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      extractedTodos: prev.extractedTodos.map((todo, i) =>
        i === index ? { ...todo, isSelected: !todo.isSelected } : todo
      ),
    }));
  }, []);

  /**
   * Update an extracted todo
   */
  const updateExtractedTodo = useCallback((index: number, updates: Partial<ExtractedTodoItem>) => {
    setState((prev) => ({
      ...prev,
      extractedTodos: prev.extractedTodos.map((todo, i) =>
        i === index ? { ...todo, ...updates } : todo
      ),
    }));
  }, []);

  /**
   * Save selected todos
   */
  const saveSelectedTodos = useCallback(async (): Promise<{
    success: boolean;
    savedCount?: number;
    error?: string;
  }> => {
    const selectedTodos = state.extractedTodos.filter((todo) => todo.isSelected);
    
    if (selectedTodos.length === 0) {
      return { success: false, error: "No todos selected to save." };
    }

    setState((prev) => ({
      ...prev,
      isSaving: true,
      saveError: null,
    }));

    try {
      // Save each selected todo
      let savedCount = 0;
      for (const todo of selectedTodos) {
        const createDto: CreateTodoDto = {
          title: todo.title,
          description: todo.description || null,
          priority: todo.priority,
          tags: todo.tags,
          dueDate: todo.dueDate || null,
          estimatedTime: todo.estimatedTime || null,
        };

        const result = await todoService.createTodo(createDto);
        if (!result.error) {
          savedCount++;
        }
      }

      setState((prev) => ({
        ...prev,
        isSaving: false,
        extractedTodos: [], // Clear after save
      }));

      return { success: true, savedCount };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save todos";
      setState((prev) => ({
        ...prev,
        isSaving: false,
        saveError: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [state.extractedTodos]);

  /**
   * Clear extracted todos
   */
  const clearExtractedTodos = useCallback(() => {
    setState({
      isExtracting: false,
      extractedTodos: [],
      extractError: null,
      isSaving: false,
      saveError: null,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      extractError: null,
      saveError: null,
    }));
  }, []);

  return {
    // State
    ...state,
    hasExtractedTodos: state.extractedTodos.length > 0,
    selectedCount: state.extractedTodos.filter((t) => t.isSelected).length,

    // Actions
    extractFromText,
    toggleTodoSelection,
    updateExtractedTodo,
    saveSelectedTodos,
    clearExtractedTodos,
    clearError,
  };
};
