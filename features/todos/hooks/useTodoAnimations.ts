"use client";

import { useState, useCallback } from "react";

export type AnimationType = "accept" | "reject" | "complete" | null;

export const useTodoAnimations = (
  refreshTodos: () => void,
  updateTodoApi: (id: string, updates: any) => Promise<any>,
  toggleTodoApi: (id: string) => Promise<any>
) => {
  const [animatingTodoId, setAnimatingTodoId] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<AnimationType>(null);

  const handleToggleTodo = useCallback(async (id: string) => {
    setAnimatingTodoId(id);
    setAnimationType("complete");
    
    // Wait for animation
    setTimeout(async () => {
      await toggleTodoApi(id);
      refreshTodos();
      setAnimatingTodoId(null);
      setAnimationType(null);
    }, 300);
  }, [toggleTodoApi, refreshTodos]);

  const handleAcceptQueue = useCallback(async (id: string) => {
    setAnimatingTodoId(id);
    setAnimationType("accept");
    
    // Wait for animation
    setTimeout(async () => {
      await updateTodoApi(id, { status: "in_progress" });
      refreshTodos();
      setAnimatingTodoId(null);
      setAnimationType(null);
    }, 300);
  }, [updateTodoApi, refreshTodos]);

  const handleRejectQueue = useCallback(async (id: string) => {
    setAnimatingTodoId(id);
    setAnimationType("reject");
    
    // Wait for animation
    setTimeout(async () => {
      await updateTodoApi(id, { status: "cancelled" });
      refreshTodos();
      setAnimatingTodoId(null);
      setAnimationType(null);
    }, 300);
  }, [updateTodoApi, refreshTodos]);

  return {
    animatingTodoId,
    animationType,
    handleToggleTodo,
    handleAcceptQueue,
    handleRejectQueue
  };
};
