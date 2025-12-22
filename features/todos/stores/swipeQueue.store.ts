import { create } from 'zustand';
import type { Todo } from '../types';

/**
 * Swipe Queue Store
 * Manages queue state, history, and actions
 * 
 * Requirements: 4.4, 5.3, 7.4
 */

interface SwipeAction {
  taskId: string;
  task: Todo;
  action: 'accept' | 'skip';
  timestamp: Date;
}

interface ToastState {
  visible: boolean;
  message: string;
  taskId: string | null;
}

interface SwipeQueueState {
  // Queue state
  queue: Todo[];
  currentIndex: number;
  isAnimating: boolean;
  
  // History for undo
  history: SwipeAction[];
  
  // Toast state
  toast: ToastState;
  
  // Statistics
  acceptedCount: number;
  skippedCount: number;
  
  // Actions
  setQueue: (todos: Todo[]) => void;
  acceptTask: (taskId: string) => void;
  skipTask: (taskId: string) => void;
  undoLastAction: () => void;
  setAnimating: (isAnimating: boolean) => void;
  showToast: (message: string, taskId: string) => void;
  hideToast: () => void;
  reset: () => void;
}

const initialToastState: ToastState = {
  visible: false,
  message: '',
  taskId: null,
};

export const useSwipeQueueStore = create<SwipeQueueState>((set, get) => ({
  // Initial state
  queue: [],
  currentIndex: 0,
  isAnimating: false,
  history: [],
  toast: initialToastState,
  acceptedCount: 0,
  skippedCount: 0,

  // Set queue from external source
  setQueue: (todos) => set({
    queue: todos,
    currentIndex: 0,
    history: [],
    acceptedCount: 0,
    skippedCount: 0,
  }),

  // Accept task (swipe right)
  acceptTask: (taskId) => {
    const { queue, currentIndex, history } = get();
    const task = queue.find(t => t.id === taskId);
    
    if (!task) return;

    const action: SwipeAction = {
      taskId,
      task,
      action: 'accept',
      timestamp: new Date(),
    };

    set({
      currentIndex: currentIndex + 1,
      history: [...history, action],
      acceptedCount: get().acceptedCount + 1,
    });

    // Show toast
    get().showToast('Task added to your list', taskId);
  },

  // Skip task (swipe left)
  skipTask: (taskId) => {
    const { queue, currentIndex, history } = get();
    const task = queue.find(t => t.id === taskId);
    
    if (!task) return;

    const action: SwipeAction = {
      taskId,
      task,
      action: 'skip',
      timestamp: new Date(),
    };

    set({
      currentIndex: currentIndex + 1,
      history: [...history, action],
      skippedCount: get().skippedCount + 1,
    });

    // Show toast
    get().showToast('Task skipped. You can find it later in Trash.', taskId);
  },

  // Undo last action
  undoLastAction: () => {
    const { history, currentIndex, acceptedCount, skippedCount } = get();
    
    if (history.length === 0 || currentIndex === 0) return;

    const lastAction = history[history.length - 1];
    
    set({
      currentIndex: currentIndex - 1,
      history: history.slice(0, -1),
      acceptedCount: lastAction.action === 'accept' ? acceptedCount - 1 : acceptedCount,
      skippedCount: lastAction.action === 'skip' ? skippedCount - 1 : skippedCount,
      toast: initialToastState,
    });
  },

  // Set animating state
  setAnimating: (isAnimating) => set({ isAnimating }),

  // Show toast
  showToast: (message, taskId) => set({
    toast: {
      visible: true,
      message,
      taskId,
    },
  }),

  // Hide toast
  hideToast: () => set({ toast: initialToastState }),

  // Reset store
  reset: () => set({
    queue: [],
    currentIndex: 0,
    isAnimating: false,
    history: [],
    toast: initialToastState,
    acceptedCount: 0,
    skippedCount: 0,
  }),
}));
