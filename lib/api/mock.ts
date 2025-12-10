"use client";

import MockAdapter from "axios-mock-adapter";
import { apiClient } from "./client";
import { mockQueueTodos } from "@/features/todos/__tests__/mockQueueTodos";

let mockInstance: MockAdapter | null = null;

/**
 * Initialize mock handlers for API testing
 * Only runs when NEXT_PUBLIC_API_MOCKING=enabled
 */
export const initializeMocks = () => {
  if (typeof window === "undefined") return;

  const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

  if (!isMockingEnabled) {
    console.log("🔌 API Mocking DISABLED - using real backend");
    return;
  }

  if (mockInstance) {
    console.log("⚠️ Mock already initialized");
    return;
  }

  console.log("🔥 API Mocking ENABLED - using mock data");

  const axiosInstance = apiClient.getInstance();
  mockInstance = new MockAdapter(axiosInstance, { delayResponse: 300 });

  // ============================================
  // TODO ENDPOINTS
  // ============================================

  // GET /api/v1/todos - List all todos
  mockInstance.onGet(/\/api\/v1\/todos(\?.*)?$/).reply((config) => {
    console.log("📋 [MOCK] GET /api/v1/todos", config.params);

    return [
      200,
      {
        data: {
          todos: mockQueueTodos.map((todo) => ({
            todo_id: todo.id,
            user_id: "mock-user-001",
            context_id: todo.contextId,
            title: todo.title,
            description: todo.description,
            status: todo.status,
            priority: todo.priority,
            due_date: todo.dueDate,
            estimated_time: todo.estimatedTime,
            actual_time: todo.actualTime,
            source_type: todo.sourceType,
            source_id: todo.sourceId,
            source_space_id: todo.sourceSpaceId,
            source_message_id: todo.sourceMessageId,
            source_space_name: todo.sourceSpaceName,
            source_thread_name: todo.sourceThreadName,
            template_id: todo.templateId,
            tags: todo.tags,
            eisenhower: todo.eisenhower,
            completed_at: todo.completedAt,
            created_at: todo.createdAt,
            updated_at: todo.updatedAt,
            subtasks: todo.subtasks.map((st) => ({
              subtask_id: st.id,
              todo_id: todo.id,
              title: st.title,
              status: st.status,
              order: st.order,
              created_at: st.createdAt,
              completed_at: st.completedAt,
            })),
            assignee_id: todo.assigneeId,
            assignee_name: todo.assigneeName,
            sender_name: todo.senderName,
            sender_email: todo.senderEmail,
          })),
          page: 1,
          limit: 50,
          total: mockQueueTodos.length,
        },
      },
    ];
  });

  // GET /api/v1/todos/:id - Get single todo
  mockInstance.onGet(/\/api\/v1\/todos\/[^/]+$/).reply((config) => {
    const id = config.url?.split("/").pop();
    console.log("📋 [MOCK] GET /api/v1/todos/:id", id);

    const todo = mockQueueTodos.find((t) => t.id === id);
    if (!todo) {
      return [404, { message: "Todo not found" }];
    }

    return [
      200,
      {
        todo_id: todo.id,
        user_id: "mock-user-001",
        context_id: todo.contextId,
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        due_date: todo.dueDate,
        estimated_time: todo.estimatedTime,
        actual_time: todo.actualTime,
        source_type: todo.sourceType,
        source_id: todo.sourceId,
        source_space_id: todo.sourceSpaceId,
        source_message_id: todo.sourceMessageId,
        source_space_name: todo.sourceSpaceName,
        source_thread_name: todo.sourceThreadName,
        template_id: todo.templateId,
        tags: todo.tags,
        eisenhower: todo.eisenhower,
        completed_at: todo.completedAt,
        created_at: todo.createdAt,
        updated_at: todo.updatedAt,
        subtasks: [],
        assignee_id: todo.assigneeId,
        assignee_name: todo.assigneeName,
        sender_name: todo.senderName,
        sender_email: todo.senderEmail,
      },
    ];
  });

  // PATCH /api/v1/todos/:id - Update todo
  mockInstance.onPatch(/\/api\/v1\/todos\/[^/]+$/).reply((config) => {
    const id = config.url?.split("/").pop();
    console.log("📋 [MOCK] PATCH /api/v1/todos/:id", id, config.data);

    const todo = mockQueueTodos.find((t) => t.id === id);
    if (!todo) {
      return [404, { message: "Todo not found" }];
    }

    const updates = JSON.parse(config.data || "{}");
    const updatedTodo = { ...todo, ...updates };

    return [
      200,
      {
        todo_id: updatedTodo.id,
        user_id: "mock-user-001",
        title: updatedTodo.title,
        description: updatedTodo.description,
        status: updatedTodo.status,
        priority: updatedTodo.priority,
        due_date: updatedTodo.dueDate,
        estimated_time: updatedTodo.estimatedTime,
        source_type: updatedTodo.sourceType,
        tags: updatedTodo.tags,
        created_at: updatedTodo.createdAt,
        updated_at: new Date().toISOString(),
        subtasks: [],
      },
    ];
  });

  // ============================================
  // AI EXTRACT ENDPOINT - For subtask generation
  // ============================================

  // POST /api/v1/todos/extract-from-text - Extract todos/subtasks from text
  mockInstance.onPost("/api/v1/todos/extract-from-text").reply((config) => {
    console.log("🤖 [MOCK] POST /api/v1/todos/extract-from-text");
    const payload = JSON.parse(config.data || "{}");
    console.log("🤖 [MOCK] Payload:", payload);

    // Generate mock subtasks based on the input text
    const mockSubtasks = [
      {
        title: "Research and gather requirements",
        description: "Collect all necessary information and requirements for the task",
        priority: "high" as const,
        tags: ["planning"],
      },
      {
        title: "Create initial draft or prototype",
        description: "Develop the first version or proof of concept",
        priority: "medium" as const,
        tags: ["development"],
      },
      {
        title: "Review and get feedback",
        description: "Share with stakeholders and collect feedback",
        priority: "medium" as const,
        tags: ["review"],
      },
      {
        title: "Make revisions based on feedback",
        description: "Implement changes based on the feedback received",
        priority: "medium" as const,
        tags: ["development"],
      },
      {
        title: "Final review and completion",
        description: "Do a final check and mark as complete",
        priority: "low" as const,
        tags: ["completion"],
      },
    ];

    return [
      200,
      {
        todos: mockSubtasks,
        summary: `Generated ${mockSubtasks.length} subtasks for the given task`,
      },
    ];
  });

  // ============================================
  // AUTH ENDPOINTS (for testing)
  // ============================================

  // GET /api/v1/auth/me - Current user
  mockInstance.onGet("/api/v1/auth/me").reply(() => {
    console.log("👤 [MOCK] GET /api/v1/auth/me");
    return [
      200,
      {
        user_id: "mock-user-001",
        username: "testuser",
        email: "test@example.com",
        full_name: "Test User",
      },
    ];
  });

  // ============================================
  // GOOGLE CHAT ENDPOINTS
  // ============================================

  // GET /api/v1/integration/spaces - List spaces
  mockInstance.onGet("/api/v1/integration/spaces").reply(() => {
    console.log("💬 [MOCK] GET /api/v1/integration/spaces");
    return [
      200,
      [
        {
          id: "space-dev-team",
          name: "spaces/dev-team",
          display_name: "Development Team",
          is_whitelisted: true,
        },
        {
          id: "space-ops",
          name: "spaces/ops",
          display_name: "Operations",
          is_whitelisted: true,
        },
        {
          id: "space-qa",
          name: "spaces/qa",
          display_name: "QA Team",
          is_whitelisted: true,
        },
      ],
    ];
  });

  console.log("✅ Mock handlers initialized successfully");
};

/**
 * Reset mock adapter (useful for testing)
 */
export const resetMocks = () => {
  if (mockInstance) {
    mockInstance.reset();
  }
};

/**
 * Restore original axios behavior
 */
export const restoreMocks = () => {
  if (mockInstance) {
    mockInstance.restore();
    mockInstance = null;
  }
};
