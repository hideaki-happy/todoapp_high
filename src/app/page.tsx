"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main className="min-h-screen flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">
          ToDo
        </h1>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTodo()}
            placeholder="タスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-shadow"
          />
          <button
            onClick={addTodo}
            className="px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-base hover:opacity-80 active:scale-95 transition-all"
          >
            追加
          </button>
        </div>

        {todos.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">
            タスクがありません
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    todo.completed
                      ? "bg-black dark:bg-white border-black dark:border-white"
                      : "border-gray-300 dark:border-gray-500 hover:border-gray-400"
                  }`}
                >
                  {todo.completed && (
                    <svg
                      className="w-3 h-3 text-white dark:text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                <span
                  className={`flex-1 text-base transition-colors ${
                    todo.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                  aria-label="削除"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            {todos.filter((t) => t.completed).length} / {todos.length} 完了
          </p>
        )}
      </div>
    </main>
  );
}
