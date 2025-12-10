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
  TodoStatus,
  TodoPriority,
} from "../types";
import type {
  TodayTaskData,
  SimpleTaskData,
  MeetingTaskData,
  SmartInboxItemData,
  TaskGroup,
  DueType,
  Priority as UIPriority,
  TaskStatus,
  MeetingMetaField,
  SubTaskData,
} from "../types/ui.types";

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
  sourceSpaceName: data.source_space_name ?? null,
  sourceThreadName: data.source_thread_name ?? [],
  templateId: data.template_id,
  tags: data.tags || [],
  eisenhower: data.eisenhower,
  completedAt: data.completed_at,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  subtasks: data.subtasks ? data.subtasks.map(toCamelCaseSubtask) : [],
  assigneeId: data.assignee_id ?? null,
  assigneeName: data.assignee_name ?? null,
  // Update v1: Sender information
  senderName: data.sender_name ?? null,
  senderEmail: data.sender_email ?? null,
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

// ============================================================================
// UI Mapping Functions - Map Todo to UI Data Models
// ============================================================================

/**
 * Convert Todo status to UI TaskStatus
 */
const mapTodoStatusToUI = (status: TodoStatus): TaskStatus => {
  return status === "completed" ? "completed" : "active";
};

/**
 * Convert Todo priority to UI Priority
 */
const mapTodoPriorityToUI = (priority: TodoPriority): UIPriority => {
  switch (priority) {
    case "urgent":
      return "high";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "none";
  }
};

/**
 * Determine DueType based on due date
 */
const getDueType = (dueDate: string | null): DueType => {
  if (!dueDate) return "none";

  const now = new Date();
  const due = new Date(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  if (dueDateOnly < today) {
    return "overdue";
  } else if (dueDateOnly.getTime() === today.getTime()) {
    return "today";
  } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
    return "tomorrow";
  } else {
    return "none";
  }
};

/**
 * Get due label for display
 */
const getDueLabel = (dueType: DueType, dueDate: string | null): string | undefined => {
  if (dueType === "none" && dueDate) {
    const date = new Date(dueDate);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
  }
  switch (dueType) {
    case "today":
      return "Due today";
    case "tomorrow":
      return "Due tomorrow";
    case "overdue":
      return "Overdue";
    default:
      return undefined;
  }
};

/**
 * Map Todo subtasks to UI SubTaskData
 */
const mapSubtasksToUI = (subtasks: Todo["subtasks"]): SubTaskData[] => {
  return subtasks.map((subtask) => ({
    id: subtask.id,
    title: subtask.title,
    status: subtask.status === "completed" ? "completed" : "active",
  }));
};

/**
 * Map Todo to TodayTaskData (Simple or Meeting)
 */
export const mapTodoToTodayTaskData = (todo: Todo): TodayTaskData => {
  const dueType = getDueType(todo.dueDate);
  const dueLabel = getDueLabel(dueType, todo.dueDate);
  const status = mapTodoStatusToUI(todo.status);
  const priority = mapTodoPriorityToUI(todo.priority);

  // If todo has source (from Google Chat, email, etc.) and has subtasks, treat as meeting task
  const isMeetingTask = todo.sourceType !== "manual" && todo.subtasks.length > 0;

  if (isMeetingTask) {
    const meta: MeetingMetaField[] = [];

    // Add source info if available
    if (todo.sourceType === "chat" && todo.sourceSpaceId) {
      meta.push({
        label: "Source",
        value: "Google Chat",
        valueType: "text",
      });
    }

    // Add priority if not none
    if (priority !== "none") {
      meta.push({
        label: "Priority",
        value: priority.charAt(0).toUpperCase() + priority.slice(1),
        valueType: "priority",
        tone: priority === "high" ? "danger" : "default",
      });
    }

    // Add tags if available
    if (todo.tags && todo.tags.length > 0) {
      todo.tags.forEach((tag) => {
        meta.push({
          label: "Tag",
          value: tag,
          valueType: "tag",
        });
      });
    }

    const meetingTask: MeetingTaskData = {
      id: todo.id,
      type: "meeting",
      title: todo.title,
      status,
      dueType,
      dueLabel,
      priority,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      dateLabel: todo.dueDate
        ? new Date(todo.dueDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      hasInlineDetails: true,
      isExpanded: false,
      meta,
      subtasks: mapSubtasksToUI(todo.subtasks),
    };

    return meetingTask;
  }

  // Simple task
  const simpleTask: SimpleTaskData = {
    id: todo.id,
    type: "simple",
    title: todo.title,
    status,
    dueType,
    dueLabel,
    priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
  };

  return simpleTask;
};

/**
 * Map Todo to SmartInboxItemData
 */
export const mapTodoToInboxItem = (todo: Todo): SmartInboxItemData => {
  const dueType = getDueType(todo.dueDate);
  let sourceLabel: string | undefined;

  switch (todo.sourceType) {
    case "chat":
      sourceLabel = "From Google Chat";
      break;
    case "email":
      sourceLabel = "From Email";
      break;
    case "meeting":
      sourceLabel = "From Meeting";
      break;
    default:
      sourceLabel = undefined;
  }

  return {
    id: todo.id,
    title: todo.title,
    dueType,
    sourceLabel,
    isSelected: false,
    tab: "inbox",
  };
};

/**
 * Group todos by due date into TaskGroups
 */
export const groupTodosByDueDate = (todos: Todo[]): TaskGroup[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const groups: Map<string, TodayTaskData[]> = new Map();
  groups.set("Today", []);
  groups.set("Tomorrow", []);
  groups.set("Next 7 days", []);

  todos.forEach((todo) => {
    const taskData = mapTodoToTodayTaskData(todo);
    const dueType = taskData.dueType;

    if (dueType === "today" || dueType === "overdue") {
      groups.get("Today")!.push(taskData);
    } else if (dueType === "tomorrow") {
      groups.get("Tomorrow")!.push(taskData);
    } else if (taskData.dueDate) {
      const dueDate = new Date(taskData.dueDate);
      if (dueDate <= nextWeek) {
        groups.get("Next 7 days")!.push(taskData);
      } else {
        // For todos beyond next week, add to "Next 7 days" or create a new group
        groups.get("Next 7 days")!.push(taskData);
      }
    } else {
      // No due date, add to "Next 7 days"
      groups.get("Next 7 days")!.push(taskData);
    }
  });

  // Convert to TaskGroup array
  const taskGroups: TaskGroup[] = [];
  ["Today", "Tomorrow", "Next 7 days"].forEach((label) => {
    const tasks = groups.get(label) || [];
    if (tasks.length > 0) {
      taskGroups.push({
        label,
        count: tasks.length,
        tasks,
      });
    }
  });

  return taskGroups;
};

