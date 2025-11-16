import TodoList from "@/features/todos/components/TodoList";

export const metadata = {
  title: "Todos - SpiderX Interface",
  description: "Manage your todos",
};

export default function TodosPage() {
  return (
    <div className="h-screen overflow-hidden">
      <TodoList />
    </div>
  );
}

