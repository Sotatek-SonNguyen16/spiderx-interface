import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Todo, TodoQueryParams } from "../types";

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
  filters: TodoQueryParams;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface TodoActions {
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  setSelectedTodo: (todo: Todo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: TodoQueryParams) => void;
  setPagination: (page: number, limit: number, total: number, hasMore: boolean) => void;
  reset: () => void;
}

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  loading: false,
  error: null,
  filters: {},
  total: 0,
  page: 1,
  limit: 1000, // Fetch all todos by default
  hasMore: false,
};

export const useTodoStore = create<TodoState & TodoActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setTodos: (todos) =>
        set({ todos, error: null }, false, "setTodos"),

      addTodo: (todo) =>
        set(
          (state) => {
            // Tránh duplicate
            const exists = state.todos.some(t => t.id === todo.id);
            if (exists) return state;
            return { todos: [todo, ...state.todos] };
          },
          false,
          "addTodo"
        ),

      updateTodo: (id, updates) =>
        set(
          (state) => {
            // Chỉ update nếu có thay đổi thực sự
            const todoIndex = state.todos.findIndex(t => t.id === id);
            if (todoIndex === -1) return state;

            const currentTodo = state.todos[todoIndex];
            const hasChanges = Object.keys(updates).some(
              key => currentTodo[key as keyof Todo] !== updates[key as keyof Todo]
            );

            if (!hasChanges) return state;

            const newTodos = [...state.todos];
            newTodos[todoIndex] = { ...currentTodo, ...updates };

            return {
              todos: newTodos,
              selectedTodo:
                state.selectedTodo?.id === id
                  ? { ...state.selectedTodo, ...updates }
                  : state.selectedTodo,
            };
          },
          false,
          "updateTodo"
        ),

      removeTodo: (id) =>
        set(
          (state) => {
            const exists = state.todos.some(t => t.id === id);
            if (!exists) return state;

            return {
              todos: state.todos.filter((todo) => todo.id !== id),
              selectedTodo:
                state.selectedTodo?.id === id ? null : state.selectedTodo,
            };
          },
          false,
          "removeTodo"
        ),

      setSelectedTodo: (todo) =>
        set({ selectedTodo: todo }, false, "setSelectedTodo"),

      setLoading: (loading) =>
        set({ loading }, false, "setLoading"),

      setError: (error) =>
        set({ error }, false, "setError"),

      setFilters: (filters) =>
        set({ filters }, false, "setFilters"),

      setPagination: (page, limit, total, hasMore) =>
        set({ page, limit, total, hasMore }, false, "setPagination"),

      reset: () => set(initialState, false, "reset"),
    }),
    { name: "TodoStore" }
  )
);

