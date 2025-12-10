/**
 * Thread Filter Types - Update v1
 * Types for filtering todos by connected Chat Threads
 */

export interface ConnectedThread {
  id: string;
  name: string;
  displayName?: string | null;
}

export interface ThreadFilterState {
  selectedThreadId: string | null;
  threads: ConnectedThread[];
  todoCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
}

export interface ThreadSidebarProps {
  threads: ConnectedThread[];
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string | null) => void;
  todoCounts: Record<string, number>;
  loading?: boolean;
}
