// UI Data Models for Todo List Interface

// ============================================================================
// 1. App State (Root)
// ============================================================================

export interface AppState {
  sidebar: SidebarData;
  todayView: TodayViewData;
}

// ============================================================================
// 2. Sidebar Data Models
// ============================================================================

export interface SidebarData {
  appName: string; // "SpiderX"
  showAddProjectButton: boolean; // có nút tròn vàng "+"
  searchPlaceholder: string; // "Search"
  smartInbox: SmartInboxSectionData;
}

export type InboxTab = "inbox" | "accepted" | "rejected";

export interface SmartInboxSectionData {
  activeTab: InboxTab; // Tab hiện tại
  inboxCount: number; // Số item trong inbox
  acceptedCount: number; // Số item đã accepted
  rejectedCount: number; // Số item đã rejected
  items: SmartInboxItemData[];
}

export type DueType = "today" | "tomorrow" | "overdue" | "none";
export type Priority = "high" | "medium" | "low" | "none";

export interface SmartInboxItemData {
  id: string;
  title: string; // "Review quarterly reports and prepare presentation"
  dueType: DueType; // "today" | "tomorrow" | "overdue" | "none"
  sourceLabel?: string; // "From Google Chat"
  sourceIcon?: string; // Icon name hoặc ReactNode
  isSelected: boolean; // nếu item đang được chọn/hightlight
  tab?: InboxTab; // Tab mà item này thuộc về
}

// ============================================================================
// 3. Today View Data Models
// ============================================================================

export type TaskStatus = "active" | "completed";

export interface BaseTaskData {
  id: string;
  title: string; // text hàng 1
  status: TaskStatus; // active: circle rỗng; completed: circle vàng + gạch ngang
  dueType: DueType; // "today" | "tomorrow" | "overdue" | "none"
  dueLabel?: string; // "Today" / "Tomorrow" / "Overdue" - để hiển thị pill
  priority?: Priority; // "high" | "medium" | "low" | "none"
  dueDate?: Date; // Actual due date for filtering
}

// Task thường
export interface SimpleTaskData extends BaseTaskData {
  type: "simple";
}

// Meeting Meta Field
export interface MeetingMetaField {
  label: string; // "Sender" / "Source" / "Priority" / "Tag"
  value: string; // "thuy.la" / "High" / ...
  valueType?: "text" | "link" | "tag" | "priority";
  href?: string; // nếu là link (Source)
  tone?: "default" | "danger"; // "High" => danger (màu đỏ)
}

// Sub Task
export interface SubTaskData {
  id: string;
  title: string; // "Sub-task1"
  status: TaskStatus; // circle rỗng / completed
}

// Task Meeting Bot (card vàng có meta + sub task)
export interface MeetingTaskData extends BaseTaskData {
  type: "meeting";
  dateLabel: string; // "31/11/2025"
  hasInlineDetails: boolean; // true: hiển thị inline, false: dùng drawer
  isExpanded?: boolean; // card đang mở hay đóng (nếu inline)
  meta: MeetingMetaField[]; // Sender / Source / Priority / Tag
  subtasks: SubTaskData[]; // list sub-task
}

// Union Task
export type TodayTaskData = SimpleTaskData | MeetingTaskData;

// Completed Summary
export interface CompletedSummaryData {
  label: string; // "1 Completed"
  isExpanded: boolean;
  items: TodayTaskData[]; // các task completed hiển thị khi expand
}

// Task Group theo thời gian
export interface TaskGroup {
  label: string; // "Today" / "Tomorrow" / "Next 7 days"
  count: number;
  tasks: TodayTaskData[];
}

// Today View Data
export interface TodayViewData {
  title: string; // "Today"
  description?: string; // "Tasks you've accepted from Inbox."
  remainingLabel: string; // "3 tasks remaining"
  addTaskPlaceholder: string; // "Add a task..."
  taskGroups: TaskGroup[]; // Group tasks theo thời gian
  completedSummary: CompletedSummaryData;
  highlightedTaskId?: string; // ID của task mới được highlight (animation)
}

// ============================================================================
// 4. Component Props
// ============================================================================

export interface SidebarProps {
  data: SidebarData;
  onSearchChange?: (value: string) => void;
  onAddProjectClick?: () => void;
  onInboxTabChange?: (tab: InboxTab) => void;
  onSmartInboxItemClick?: (id: string) => void;
  onSmartInboxItemAccept?: (id: string) => void; // click tick xanh - "Add to Today"
  onSmartInboxItemReject?: (id: string) => void; // click X đỏ - "Dismiss"
}

export interface TodayViewProps {
  data: TodayViewData;
  // event cho ô "Add a task..."
  onAddTaskClick?: () => void;
  onAddTaskSubmit?: (title: string, dueType?: DueType, priority?: Priority, dueDate?: Date) => void;
  onAddTaskCancel?: () => void;
  onTaskUpdate?: (id: string, updates: { dueType?: DueType; priority?: Priority; dueDate?: Date }) => void;
  // event cho task thường
  onTaskToggleStatus?: (id: string) => void; // click circle
  onTaskClick?: (id: string) => void; // click vào vùng text
  // event riêng cho Meeting task
  onMeetingToggleExpand?: (id: string) => void;
  onMeetingOpenDrawer?: (id: string) => void; // Mở drawer chi tiết
  onSubTaskToggleStatus?: (taskId: string, subTaskId: string) => void;
  onGenerateSubtasks?: (taskId: string) => void;
  // Completed summary
  onToggleCompletedSummary?: () => void;
}

