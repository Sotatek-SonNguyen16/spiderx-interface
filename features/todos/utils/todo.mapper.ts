import type {
  Todo,
  TodoApiModel,
  CreateTodoDto,
  UpdateTodoDto,
  Subtask,
  TodoApiQueryParams,
  TodoQueryParams,
  CreateTodoApiPayload,
  UpdateTodoApiPayload,
} from "../types";

const toCamelCaseSubtask = (subtask: TodoApiModel["subtasks"][number]): Subtask => ({
  id: subtask.subtask_id,
  title: subtask.title,
  status: subtask.status,
  order: subtask.order,
  createdAt: subtask.created_at,
  completedAt: subtask.completed_at,
});

export const mapTodoFromApi = (data: TodoApiModel): Todo => ({
  id: data.todo_id,
  title: data.title,
  description: data.description,
  status: data.status,
  priority: data.priority,
  dueDate: data.due_date,
  estimatedTime: data.estimated_time,
  actualTime: data.actual_time,
  contextId: data.context_id,
  sourceType: data.source_type,
  sourceId: data.source_id,
  sourceSpaceId: data.source_space_id,
  sourceMessageId: data.source_message_id,
  templateId: data.template_id,
  tags: data.tags || [],
  eisenhower: data.eisenhower,
  completedAt: data.completed_at,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  subtasks: data.subtasks ? data.subtasks.map(toCamelCaseSubtask) : [],
});

export const mapCreateTodoToApi = (payload: CreateTodoDto): CreateTodoApiPayload => ({
  title: payload.title,
  description: payload.description ?? null,
  status: payload.status ?? "todo",
  priority: payload.priority ?? "medium",
  due_date: payload.dueDate ?? null,
  estimated_time: payload.estimatedTime ?? null,
  context_id: payload.contextId ?? null,
  tags: payload.tags ?? null,
  eisenhower: payload.eisenhower ?? null,
});

export const mapUpdateTodoToApi = (payload: UpdateTodoDto): UpdateTodoApiPayload => ({
  ...(payload.title !== undefined && { title: payload.title }),
  ...(payload.description !== undefined && { description: payload.description ?? null }),
  ...(payload.status !== undefined && { status: payload.status }),
  ...(payload.priority !== undefined && { priority: payload.priority }),
  ...(payload.dueDate !== undefined && { due_date: payload.dueDate ?? null }),
  ...(payload.estimatedTime !== undefined && { estimated_time: payload.estimatedTime ?? null }),
  ...(payload.contextId !== undefined && { context_id: payload.contextId ?? null }),
  ...(payload.tags !== undefined && { tags: payload.tags ?? null }),
  ...(payload.eisenhower !== undefined && { eisenhower: payload.eisenhower ?? null }),
});

export const mapFiltersToApiQuery = ({
  page = 1,
  limit = 10,
  statusFilter,
  contextId,
  search,
}: TodoQueryParams): TodoApiQueryParams => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
    ...(statusFilter && { status_filter: statusFilter }),
    ...(contextId && { context_id: contextId }),
    ...(search && { keyword: search }),
  };
};

