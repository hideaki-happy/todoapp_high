"use client";

import { useState, useRef, useCallback } from "react";

type Priority = "high" | "medium" | "low";
type Category = "work" | "private" | "other";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string;
  removing?: boolean;
  justCompleted?: boolean;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string; dot: string }> = {
  high: { label: "高", badge: "bg-rose-100 text-rose-600 border-rose-200", dot: "bg-rose-400" },
  medium: { label: "中", badge: "bg-amber-100 text-amber-600 border-amber-200", dot: "bg-amber-400" },
  low: { label: "低", badge: "bg-sky-100 text-sky-600 border-sky-200", dot: "bg-sky-400" },
};

const CATEGORY_CONFIG: Record<Category, { label: string; emoji: string; badge: string }> = {
  work: { label: "仕事", emoji: "💼", badge: "bg-indigo-100 text-indigo-600 border-indigo-200" },
  private: { label: "プライベート", emoji: "🏠", badge: "bg-pink-100 text-pink-600 border-pink-200" },
  other: { label: "その他", emoji: "📌", badge: "bg-slate-100 text-slate-600 border-slate-200" },
};

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-700">{percentage}%</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-slate-700">完了率</p>
        <p className="text-xs text-slate-500">
          {completed} / {total} タスク完了
        </p>
        <div className="w-32 h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out animate-progress-grow"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [dueDate, setDueDate] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: Date.now(), text: trimmed, completed: false, priority, category, dueDate },
      ...prev,
    ]);
    setInput("");
    setDueDate("");
    inputRef.current?.focus();
  }, [input, priority, category, dueDate]);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;
        const nowCompleted = !todo.completed;
        if (nowCompleted) {
          setTimeout(() => {
            setTodos((p) => p.map((t) => (t.id === id ? { ...t, justCompleted: false } : t)));
          }, 400);
          return { ...todo, completed: true, justCompleted: true };
        }
        return { ...todo, completed: false, justCompleted: false };
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterPriority !== "all" && todo.priority !== filterPriority) return false;
    if (filterCategory !== "all" && todo.category !== filterCategory) return false;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  const isOverdue = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date(new Date().toDateString());
  };

  const PRIORITY_BUTTON_STYLES: Record<Priority, { active: string; inactive: string }> = {
    high: { active: "bg-rose-500 text-white shadow-sm", inactive: "bg-white text-rose-500 hover:bg-rose-50" },
    medium: { active: "bg-amber-500 text-white shadow-sm", inactive: "bg-white text-amber-500 hover:bg-amber-50" },
    low: { active: "bg-sky-500 text-white shadow-sm", inactive: "bg-white text-sky-500 hover:bg-sky-50" },
  };

  return (
    <main className="min-h-screen flex items-start justify-center pt-10 pb-20 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center justify-center gap-2.5">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}
            />
            TaskFlow
          </h1>
          <p className="text-sm text-slate-400 mt-1">スマートなタスク管理</p>
        </div>

        {/* Progress */}
        {todos.length > 0 && (
          <div className="mb-6">
            <ProgressRing completed={completedCount} total={todos.length} />
          </div>
        )}

        {/* Add Task */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTodo()}
              onFocus={() => setIsFormOpen(true)}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-base outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition-all placeholder:text-slate-400"
            />
            <button
              onClick={addTodo}
              className="px-5 py-3 text-white rounded-xl font-medium text-base hover:opacity-90 active:scale-95 transition-all shadow-sm"
              style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}
            >
              追加
            </button>
          </div>

          {isFormOpen && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-x-5 gap-y-3 items-center animate-slide-in">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">優先度</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200">
                  {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.high][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setPriority(key)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                        priority === key ? PRIORITY_BUTTON_STYLES[key].active : PRIORITY_BUTTON_STYLES[key].inactive
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">カテゴリ</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-cyan-300"
                >
                  {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG.work][]).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.emoji} {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">締切</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              <button
                onClick={() => setIsFormOpen(false)}
                className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                ▲ 閉じる
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        {todos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 items-center bg-white/60 rounded-xl px-4 py-2.5 border border-slate-200/60">
            <span className="text-xs font-semibold text-slate-500 mr-1">フィルター</span>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <option value="all">すべてのカテゴリ</option>
              {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG.work][]).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.emoji} {cfg.label}
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <option value="all">すべての優先度</option>
              {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.high][]).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>

            {(filterCategory !== "all" || filterPriority !== "all") && (
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setFilterPriority("all");
                }}
                className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                リセット
              </button>
            )}
          </div>
        )}

        {/* Task List */}
        {filteredTodos.length === 0 ? (
          <p className="text-center text-slate-400 text-sm mt-16">
            {todos.length === 0 ? "タスクがありません" : "該当するタスクがありません"}
          </p>
        ) : (
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`group flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-sm transition-all ${
                  todo.removing ? "animate-fade-out" : "animate-slide-in"
                } ${
                  todo.completed
                    ? "bg-slate-50 border-slate-200"
                    : isOverdue(todo.dueDate)
                      ? "bg-white border-rose-200"
                      : "bg-white border-slate-200"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    todo.justCompleted ? "animate-check-pop" : ""
                  } ${
                    todo.completed
                      ? "border-cyan-500 bg-cyan-500"
                      : "border-slate-300 hover:border-cyan-400"
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-base block transition-colors ${
                      todo.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md border ${CATEGORY_CONFIG[todo.category].badge}`}>
                      {CATEGORY_CONFIG[todo.category].emoji} {CATEGORY_CONFIG[todo.category].label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md border ${PRIORITY_CONFIG[todo.priority].badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[todo.priority].dot}`} />
                      {PRIORITY_CONFIG[todo.priority].label}
                    </span>
                    {todo.dueDate && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                          isOverdue(todo.dueDate) && !todo.completed
                            ? "bg-rose-100 text-rose-600 border-rose-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        📅 {todo.dueDate}
                        {isOverdue(todo.dueDate) && !todo.completed && " (期限切れ)"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1 mt-0.5"
                  aria-label="削除"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
