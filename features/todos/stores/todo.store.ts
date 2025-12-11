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
  setPagination: (page: number, limit: number, total: number) => void;
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
  limit: 1000, // Fetch all todos, pagination handled on frontend
};

export const useTodoStore = create<TodoState & TodoActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setTodos: (todos) =>
        set({ todos, error: null }, false, "setTodos"),

      addTodo: (todo) =>
        set(
          (state) => ({ todos: [todo, ...state.todos] }),
          false,
          "addTodo"
        ),

      updateTodo: (id, updates) =>
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            ),
            selectedTodo:
              state.selectedTodo?.id === id
                ? { ...state.selectedTodo, ...updates }
                : state.selectedTodo,
          }),
          false,
          "updateTodo"
        ),

      removeTodo: (id) =>
        set(
          (state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
            selectedTodo:
              state.selectedTodo?.id === id ? null : state.selectedTodo,
          }),
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

      setPagination: (page, limit, total) =>
        set({ page, limit, total }, false, "setPagination"),

      reset: () => set(initialState, false, "reset"),
    }),
    { name: "TodoStore" }
  )
);

