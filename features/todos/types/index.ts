export type TodoStatus = "todo" | "in_progress" | "completed" | "cancelled";
export type TodoPriority = "low" | "medium" | "high" | "urgent";
export type TodoSourceType = "manual" | "chat" | "email" | "meeting" | "template";
export type TodoEisenhower =
  | "urgent_important"
  | "not_urgent_important"
  | "urgent_not_important"
  | "not_urgent_not_important";

export type SubtaskStatus = "todo" | "completed";

export interface SubtaskApiModel {
  subtask_id: string;
  todo_id: string;
  title: string;
  status: SubtaskStatus;
  order: number;
  created_at: string;
  completed_at: string | null;
}

export interface TodoApiModel {
  todo_id: string;
  user_id: string;
  context_id: string | null;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  due_date: string | null;
  estimated_time: number | null;
  actual_time: number | null;
  source_type: TodoSourceType;
  source_id: string | null;
  source_space_id: string | null;
  source_message_id: string | null;
  source_space_name?: string | null;
  source_thread_name?: string[] | null;
  template_id: string | null;
  tags: string[] | null;
  eisenhower: TodoEisenhower | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  subtasks: SubtaskApiModel[];
  // Assignee field - can be string (name) or null
  assignee?: string | null;
  assignee_id?: string | null;
  assignee_name?: string | null;
  // Update v1: Sender information from chat.memberships.readonly scope
  sender_name?: string | null;
  sender_email?: string | null;
}

export interface Subtask {
  id: string;
  title: string;
  status: SubtaskStatus;
  order: number;
  createdAt: string;
  completedAt: string | null;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  estimatedTime: number | null;
  actualTime: number | null;
  contextId: string | null;
  sourceType: TodoSourceType;
  sourceId: string | null;
  sourceSpaceId: string | null;
  sourceMessageId: string | null;
  sourceSpaceName: string | null;
  sourceThreadName: string[];
  templateId: string | null;
  tags: string[];
  eisenhower: TodoEisenhower | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  assigneeId: string | null;
  assigneeName: string | null;
  // Update v1: Sender information
  senderName: string | null;
  senderEmail: string | null;
}

export interface CreateTodoDto {
  title: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
  estimatedTime?: number | null;
  contextId?: string | null;
  tags?: string[];
  eisenhower?: TodoEisenhower | null;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string | null;
  estimatedTime?: number | null;
  contextId?: string | null;
  tags?: string[];
  eisenhower?: TodoEisenhower | null;
}

export interface CreateTodoApiPayload {
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  due_date: string | null;
  estimated_time: number | null;
  context_id: string | null;
  tags: string[] | null;
  eisenhower: TodoEisenhower | null;
}

export type UpdateTodoApiPayload = Partial<CreateTodoApiPayload>;

export interface TodoFilters {
  statusFilter?: TodoStatus;
  contextId?: string;
  search?: string;
}

export interface TodoQueryParams extends TodoFilters {
  page?: number;
  limit?: number;
}

export interface TodoApiQueryParams {
  status_filter?: TodoStatus;
  context_id?: string;
  skip?: number;
  limit?: number;
  keyword?: string;
}

// =============================================================================
// SUBTASK API TYPES - Theo OpenAPI spec
// =============================================================================

/**
 * SubTaskCreate - Schema for creating a subtask
 * POST /api/v1/todos/{todo_id}/subtasks
 */
export interface SubtaskCreatePayload {
  title: string; // required, 1-255 chars
  status?: SubtaskStatus; // default: "todo"
  order?: number; // default: 0
}

/**
 * SubTaskUpdate - Schema for updating a subtask
 * PUT /api/v1/todos/{todo_id}/subtasks/{subtask_id}
 */
export interface SubtaskUpdatePayload {
  title?: string; // optional, 1-255 chars
  status?: SubtaskStatus; // optional
  order?: number; // optional
}

