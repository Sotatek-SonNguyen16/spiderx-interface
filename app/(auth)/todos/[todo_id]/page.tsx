"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { TodoDetail } from "@/features/todos/components/TodoDetail";

/**
 * Todo Detail Page
 * Displays full details of a single todo with editing capabilities
 */
export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const todoId = params.todo_id as string;
  
  // Preserve filter state when navigating back
  const handleBack = useCallback(() => {
    // Get previous filter state from URL params if available
    const tab = searchParams.get("tab");
    const returnUrl = tab ? `/todos?tab=${tab}` : "/todos";
    router.push(returnUrl);
  }, [router, searchParams]);

  const handleDelete = useCallback(() => {
    // After deletion, navigate back to list
    router.push("/todos");
  }, [router]);

  if (!todoId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Invalid todo ID</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <TodoDetail 
        todoId={todoId} 
        onBack={handleBack}
        onDelete={handleDelete}
      />
    </div>
  );
}
