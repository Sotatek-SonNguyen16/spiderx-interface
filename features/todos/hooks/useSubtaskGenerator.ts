"use client";

import { useState, useCallback } from "react";
import { googleChatApi } from "@/features/googleChat/api/googleChat.api";

interface GeneratedSubtask {
  title: string;
  order: number;
  isSelected: boolean;
}

interface SubtaskGeneratorState {
  isGenerating: boolean;
  generatedSubtasks: GeneratedSubtask[];
  error: string | null;
  isPreviewMode: boolean;
}

/**
 * Hook for AI-powered subtask generation
 * Uses the extract-from-text endpoint to break down tasks into subtasks
 */
export const useSubtaskGenerator = () => {
  const [state, setState] = useState<SubtaskGeneratorState>({
    isGenerating: false,
    generatedSubtasks: [],
    error: null,
    isPreviewMode: false,
  });

  /**
   * Generate subtasks using AI based on todo title and description
   */
  const generateSubtasks = useCallback(async (
    todoTitle: string,
    todoDescription?: string
  ): Promise<{ success: boolean; subtasks?: GeneratedSubtask[]; error?: string }> => {
    // Validate input
    if (!todoTitle || todoTitle.trim() === "") {
      console.error("🤖 [SubtaskGenerator] Error: todoTitle is empty");
      setState((prev) => ({
        ...prev,
        error: "Task title is required to generate subtasks.",
        isPreviewMode: false,
      }));
      return { success: false, error: "Task title is required" };
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      generatedSubtasks: [],
      isPreviewMode: false,
    }));

    try {
      // Construct prompt for AI - ask for subtask breakdown
      const prompt = todoDescription 
        ? `Break down this task into actionable subtasks (return each subtask as a separate todo item):\n\nTask: ${todoTitle}\n\nDescription: ${todoDescription}`
        : `Break down this task into actionable subtasks (return each subtask as a separate todo item):\n\nTask: ${todoTitle}`;

      console.log("🤖 [SubtaskGenerator] Generating subtasks for:", todoTitle);
      console.log("🤖 [SubtaskGenerator] Prompt:", prompt);
      console.log("🤖 [SubtaskGenerator] API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

      // Call AI extract endpoint: POST /api/v1/ai/extract
      const response = await googleChatApi.extractTodosFromText({
        text: prompt,
        auto_save: false,
        source_type: "chat",
      });

      console.log("🤖 [SubtaskGenerator] Raw API Response:", response);
      console.log("🤖 [SubtaskGenerator] Response type:", typeof response);

      // Handle response - có thể là direct response hoặc wrapped trong data
      let todos: any[] = [];
      
      if (response && typeof response === 'object') {
        // Direct response: { todos: [...], confidence: ..., summary: ... }
        if (Array.isArray(response.todos)) {
          todos = response.todos;
        }
        // Wrapped response: { data: { todos: [...] } }
        else if ((response as any)?.data?.todos && Array.isArray((response as any).data.todos)) {
          todos = (response as any).data.todos;
        }
      }

      console.log("🤖 [SubtaskGenerator] Parsed todos:", todos);
      console.log("🤖 [SubtaskGenerator] Todos count:", todos.length);

      // Check if we have todos in the response
      if (!todos || todos.length === 0) {
        console.warn("🤖 [SubtaskGenerator] No subtasks returned from API");
        setState({
          isGenerating: false,
          generatedSubtasks: [],
          error: "Không thể tạo subtasks. Hãy thử thêm chi tiết cho task.",
          isPreviewMode: false,
        });
        return { success: false, error: "No subtasks generated" };
      }

      console.log("🤖 [SubtaskGenerator] Generated", todos.length, "subtasks");

      // Map AI response to subtasks
      const subtasks: GeneratedSubtask[] = todos.map((todo: any, index: number) => ({
        title: todo.title || todo.name || "Subtask không có tiêu đề",
        order: index,
        isSelected: true, // Selected by default
      }));

      setState({
        isGenerating: false,
        generatedSubtasks: subtasks,
        error: null,
        isPreviewMode: true,
      });

      return { success: true, subtasks };
    } catch (error: any) {
      // Enhanced error logging
      console.error("🤖 [SubtaskGenerator] Error:", error);
      console.error("🤖 [SubtaskGenerator] Error type:", typeof error);
      console.error("🤖 [SubtaskGenerator] Error details:", {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        data: error?.response?.data,
        name: error?.name,
        stack: error?.stack,
      });
      
      // Extract meaningful error message
      let errorMessage = "Không thể tạo subtasks. Vui lòng thử lại.";
      const status = error?.status || error?.response?.status;
      
      if (status === 404) {
        errorMessage = "API endpoint không tồn tại. Vui lòng liên hệ hỗ trợ.";
        console.error("🤖 [SubtaskGenerator] 404 - Endpoint /api/v1/ai/extract not found");
      } else if (status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      } else if (status === 403) {
        errorMessage = "Bạn không có quyền sử dụng tính năng này.";
      } else if (status === 422) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        // Log validation errors
        if (error?.response?.data?.detail) {
          console.error("🤖 [SubtaskGenerator] Validation errors:", error.response.data.detail);
        }
      } else if (status === 429) {
        errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
      } else if (status >= 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.detail) {
        errorMessage = typeof error.response.data.detail === 'string' 
          ? error.response.data.detail 
          : JSON.stringify(error.response.data.detail);
      } else if (error?.message && error.message !== "[object Object]") {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        isPreviewMode: false,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);


  /**
   * Toggle selection of a generated subtask
   */
  const toggleSubtaskSelection = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      generatedSubtasks: prev.generatedSubtasks.map((subtask, i) =>
        i === index ? { ...subtask, isSelected: !subtask.isSelected } : subtask
      ),
    }));
  }, []);

  /**
   * Update a subtask title
   */
  const updateSubtaskTitle = useCallback((index: number, title: string) => {
    setState((prev) => ({
      ...prev,
      generatedSubtasks: prev.generatedSubtasks.map((subtask, i) =>
        i === index ? { ...subtask, title } : subtask
      ),
    }));
  }, []);

  /**
   * Add a new subtask to the preview
   */
  const addSubtask = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      generatedSubtasks: [
        ...prev.generatedSubtasks,
        {
          title,
          order: prev.generatedSubtasks.length,
          isSelected: true,
        },
      ],
    }));
  }, []);

  /**
   * Remove a subtask from the preview
   */
  const removeSubtask = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      generatedSubtasks: prev.generatedSubtasks
        .filter((_, i) => i !== index)
        .map((subtask, i) => ({ ...subtask, order: i })),
    }));
  }, []);

  /**
   * Get selected subtasks for saving
   */
  const getSelectedSubtasks = useCallback(() => {
    return state.generatedSubtasks
      .filter((subtask) => subtask.isSelected)
      .map((subtask) => ({
        title: subtask.title,
        order: subtask.order,
      }));
  }, [state.generatedSubtasks]);

  /**
   * Clear generated subtasks and exit preview mode
   */
  const clearPreview = useCallback(() => {
    setState({
      isGenerating: false,
      generatedSubtasks: [],
      error: null,
      isPreviewMode: false,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    isGenerating: state.isGenerating,
    generatedSubtasks: state.generatedSubtasks,
    error: state.error,
    isPreviewMode: state.isPreviewMode,

    // Actions
    generateSubtasks,
    toggleSubtaskSelection,
    updateSubtaskTitle,
    addSubtask,
    removeSubtask,
    getSelectedSubtasks,
    clearPreview,
    clearError,
  };
};
