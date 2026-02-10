import React, { useState, useEffect, useRef } from "react";
import {
  Book,
  Wallet,
  CheckSquare,
  StickyNote,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Menu,
  X,
  Shield,
  Zap,
  LayoutDashboard,
  Save,
  Calendar as CalendarIcon,
  Activity,
  Loader2,
  Bot,
  MessageSquare,
  Send,
  Check,
  CheckCircle,
  Circle,
  Clock,
  History,
  PieChart,
  LayoutGrid,
  List,
  Sun,
  Sunset,
  Moon,
  Flame,
  ListTodo,
  Search,
} from "lucide-react";

// --- Configuration & Local Storage Helpers ---
const APP_ID = "lifesync_local_v1";
const API_URL = "http://localhost:3000/chat";

// Helper to simulate real-time updates
const dispatchUpdate = (collection) => {
  window.dispatchEvent(
    new CustomEvent("db-update", { detail: { collection } }),
  );
};

// Mock Database Functions
const db = {
  get: (collection) => {
    const raw = localStorage.getItem(`${APP_ID}_${collection}`);
    return raw ? JSON.parse(raw) : [];
  },
  add: (collection, item) => {
    const data = db.get(collection);
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    data.push(newItem);
    localStorage.setItem(`${APP_ID}_${collection}`, JSON.stringify(data));
    dispatchUpdate(collection);
    return newItem;
  },
  update: (collection, id, updates) => {
    const data = db.get(collection);
    const index = data.findIndex((i) => i.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(`${APP_ID}_${collection}`, JSON.stringify(data));
      dispatchUpdate(collection);
    }
  },
  delete: (collection, id) => {
    const data = db.get(collection);
    const newData = data.filter((i) => i.id !== id);
    localStorage.setItem(`${APP_ID}_${collection}`, JSON.stringify(newData));
    dispatchUpdate(collection);
  },
};

// Custom Hook to listen to LocalStorage changes (Mimics onSnapshot)
const useCollection = (collectionName, sortFn) => {
  const [data, setData] = useState([]);

  const refresh = () => {
    let items = db.get(collectionName);
    if (sortFn) items.sort(sortFn);
    setData(items);
  };

  useEffect(() => {
    refresh();
    const handleUpdate = (e) => {
      if (e.detail.collection === collectionName) refresh();
    };
    window.addEventListener("db-update", handleUpdate);
    return () => window.removeEventListener("db-update", handleUpdate);
  }, [collectionName]);

  return data;
};

// --- Helper Functions ---
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
const getTodayString = () => new Date().toISOString().split("T")[0];
const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// --- Local AI API Call ---
const callAI = async (msg) => {
  try {
    // Equivalent to axios.post("http://localhost:3000/chat", { message: msg })
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    if (!response.ok) throw new Error("Local API Error");

    // Assuming your local API returns data directly or in a specific format
    // Adjust this parsing based on your actual localhost server response structure
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Connection Error:", error);
    return {
      type: "message",
      content:
        "Error: Could not connect to local AI server (localhost:3000). Ensure it is running.",
    };
  }
};

// --- CSS ---
const styles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  .animate-slide-up { animation: slideUp 0.6s ease-out forwards; opacity: 0; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
`;

// --- Sub-Components ---

// 7. TASKS WIDGET
const TasksWidget = () => {
  // Sort by created desc
  const tasks = useCollection(
    "tasks",
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const [filter, setFilter] = useState("pending");
  const [viewMode, setViewMode] = useState("list");
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    db.add("tasks", {
      title: newTask,
      completed: false,
      date: getTodayString(),
    });
    setNewTask("");
  };

  const toggleTask = (task) =>
    db.update("tasks", task.id, { completed: !task.completed });
  const deleteTask = (id) => db.delete("tasks", id);

  const filteredTasks = tasks
    .filter((t) => (filter === "completed" ? t.completed : !t.completed))
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Manager</h2>
          <p className="text-slate-500 text-sm">
            Manage your daily to-dos and view history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "pending" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "completed" ? "bg-green-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filter === "pending" && (
          <form onSubmit={addTask} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Add new task..."
              className="flex-1 p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition px-4"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="bg-slate-800 text-white px-4 rounded-xl hover:bg-slate-700 transition">
              <Plus />
            </button>
          </form>
        )}
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700 flex justify-between">
          <span>
            {filter === "pending" ? "To Do List" : "Completed History"}
          </span>
          <span className="text-xs font-normal bg-slate-200 px-2 py-0.5 rounded-full">
            {filteredTasks.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === "list" ? (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => toggleTask(task)}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300 group-hover:border-blue-400"}`}
                    >
                      {task.completed && <Check size={12} />}
                    </div>
                    <div>
                      <div
                        className={`text-sm font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <CalendarIcon size={10} /> {task.date}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all hover:shadow-md ${task.completed ? "bg-slate-50 border-slate-200 opacity-75" : "bg-white border-slate-200 hover:border-indigo-300"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div
                      onClick={() => toggleTask(task)}
                      className={`cursor-pointer w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300"}`}
                    >
                      {task.completed && <Check size={14} />}
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div
                    className={`font-medium mb-2 ${task.completed ? "text-slate-500 line-through" : "text-slate-800"}`}
                  >
                    {task.title}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <CalendarIcon size={12} /> {task.date}
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredTasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 mt-10">
              <ListTodo size={48} className="opacity-20" />
              <p>No tasks found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. ROUTINE WIDGET
const RoutineWidget = () => {
  const routines = useCollection(
    "routine",
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );
  const [newItem, setNewItem] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Anytime");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const today = getTodayString();
  const yesterday = getYesterdayString();

  const add = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    db.add("routine", {
      title: newItem,
      timeOfDay: timeOfDay,
      lastCompleted: null,
      streak: 0,
    });
    setNewItem("");
  };

  const toggle = (habit) => {
    const isCompletedToday = habit.lastCompleted === today;
    let newStreak = habit.streak || 0;

    if (!isCompletedToday) {
      if (habit.lastCompleted === yesterday) {
        newStreak += 1;
      } else if (habit.lastCompleted !== today) {
        newStreak = 1;
      }
      // Add to history
      db.add("habit_history", {
        habitId: habit.id,
        date: today,
        completed: true,
      });
    } else {
      newStreak = Math.max(0, newStreak - 1);
      // Remove from history (find by habitId and date)
      const history = db.get("habit_history");
      const entry = history.find(
        (h) => h.habitId === habit.id && h.date === today,
      );
      if (entry) db.delete("habit_history", entry.id);
    }

    db.update("routine", habit.id, {
      lastCompleted: isCompletedToday ? null : today,
      streak: newStreak,
    });
  };

  const remove = (id) => db.delete("routine", id);

  const filteredRoutines = routines.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sections = {
    Morning: filteredRoutines.filter((r) => r.timeOfDay === "Morning"),
    Afternoon: filteredRoutines.filter((r) => r.timeOfDay === "Afternoon"),
    Evening: filteredRoutines.filter((r) => r.timeOfDay === "Evening"),
    Anytime: filteredRoutines.filter(
      (r) => !["Morning", "Afternoon", "Evening"].includes(r.timeOfDay),
    ),
  };

  const completedCount = routines.filter(
    (r) => r.lastCompleted === today,
  ).length;
  const totalCount = routines.length;
  const progress = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const getSectionIcon = (type) => {
    switch (type) {
      case "Morning":
        return <Sun size={18} className="text-orange-500" />;
      case "Afternoon":
        return <Sunset size={18} className="text-yellow-600" />;
      case "Evening":
        return <Moon size={18} className="text-indigo-500" />;
      default:
        return <Clock size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Routine</h2>
          <p className="text-slate-500 text-sm">{formatDate(new Date())}</p>
        </div>
        <div className="w-full sm:w-1/2 flex flex-col gap-2">
          <div className="flex justify-end">
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition ${viewMode === "list" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition ${viewMode === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={add} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex gap-2">
            <input
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition"
              placeholder="New habit..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <select
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-600"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
            >
              <option value="Morning">🌅 Morning</option>
              <option value="Afternoon">☀️ Afternoon</option>
              <option value="Evening">🌙 Evening</option>
              <option value="Anytime">🔄 Anytime</option>
            </select>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            Add
          </button>
        </form>
        <div className="relative mt-3">
          <input
            type="text"
            placeholder="Search habits..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border-b border-slate-100 focus:outline-none focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {Object.entries(sections).map(
          ([section, items]) =>
            items.length > 0 && (
              <div key={section} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-3 px-2">
                  {getSectionIcon(section)}
                  <h3 className="font-bold text-slate-700">{section}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>

                <div
                  className={
                    viewMode === "list"
                      ? "space-y-2"
                      : "grid grid-cols-1 sm:grid-cols-2 gap-3"
                  }
                >
                  {items.map((r) => {
                    const done = r.lastCompleted === today;
                    return (
                      <div
                        key={r.id}
                        onClick={() => toggle(r)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 group
                                    ${
                                      done
                                        ? "bg-green-50 border-green-200 shadow-sm"
                                        : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md"
                                    }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                        ${done ? "bg-green-500 border-green-500 text-white scale-110" : "border-slate-300 group-hover:border-indigo-400"}`}
                          >
                            {done && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div>
                            <div
                              className={`font-medium transition-colors ${done ? "text-green-900 line-through opacity-70" : "text-slate-700"}`}
                            >
                              {r.title}
                            </div>
                            {(r.streak > 0 || done) && (
                              <div
                                className={`flex items-center gap-1 text-xs mt-0.5 font-medium ${done ? "text-green-600" : "text-orange-500"}`}
                              >
                                <Flame
                                  size={12}
                                  className={
                                    done
                                      ? "fill-green-600"
                                      : "fill-orange-500 animate-pulse"
                                  }
                                />
                                <span>{r.streak || 0} day streak</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(r.id);
                          }}
                          className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
        )}
        {routines.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            No habits set. Start your journey today!
          </div>
        )}
      </div>
    </div>
  );
};

// 6. CALENDAR VIEW (Adapted for LocalStorage)
const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [activeTab, setActiveTab] = useState("overview");

  // Data Fetching via Hook
  const allExpenses = useCollection("expenses");
  const allDiary = useCollection("diary");
  const allTasks = useCollection("tasks");
  const allHabits = useCollection("routine");
  const allHabitHistory = useCollection("habit_history");

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "Food",
    description: "",
  });
  const [newTask, setNewTask] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [isEditingDiary, setIsEditingDiary] = useState(false);

  // Derived Data
  const expenses = allExpenses.filter((e) => e.date === selectedDate);
  const diaryEntry = allDiary.find((e) => e.date === selectedDate);
  const oneOffTasks = allTasks.filter((t) => t.date === selectedDate);
  const habitStatus = allHabitHistory
    .filter((h) => h.date === selectedDate)
    .reduce((acc, curr) => ({ ...acc, [curr.habitId]: curr.completed }), {});

  // Month Data Aggregation
  const monthData = {};
  [...allExpenses, ...allTasks, ...allDiary, ...allHabitHistory].forEach(
    (item) => {
      if (!item.date) return;
      if (!monthData[item.date])
        monthData[item.date] = {
          hasExpense: false,
          hasTask: false,
          hasDiary: false,
          hasHabit: false,
        };
      // Identify type based on item properties (simple heuristic for local data)
      if (item.amount !== undefined) monthData[item.date].hasExpense = true;
      else if (item.completed !== undefined && item.title)
        monthData[item.date].hasTask = true;
      else if (item.content !== undefined && item.title)
        monthData[item.date].hasDiary = true;
      else if (item.habitId) monthData[item.date].hasHabit = true;
    },
  );

  // Init Diary Content state when entry changes
  useEffect(() => {
    setDiaryContent(diaryEntry?.content || "");
  }, [diaryEntry]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Actions
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.amount) return;
    db.add("expenses", {
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: selectedDate,
    });
    setNewExpense({ amount: "", category: "Food", description: "" });
  };
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    db.add("tasks", { title: newTask, completed: false, date: selectedDate });
    setNewTask("");
  };
  const toggleTask = (task) =>
    db.update("tasks", task.id, { completed: !task.completed });
  const toggleHabitForDate = (habitId) => {
    const isCompleted = !habitStatus[habitId];
    if (isCompleted) {
      db.add("habit_history", { habitId, date: selectedDate, completed: true });
    } else {
      const entry = allHabitHistory.find(
        (h) => h.habitId === habitId && h.date === selectedDate,
      );
      if (entry) db.delete("habit_history", entry.id);
    }
  };
  const saveDiary = () => {
    if (diaryEntry)
      db.update("diary", diaryEntry.id, { content: diaryContent });
    else
      db.add("diary", {
        title: "Daily Entry",
        content: diaryContent,
        date: selectedDate,
      });
    setIsEditingDiary(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)] animate-fade-in overflow-hidden">
      <style>{styles}</style>

      {/* LEFT: Calendar Grid */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="text-indigo-600" />{" "}
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-1 items-center bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1,
                  ),
                )
              }
              className="p-1.5 hover:bg-white rounded-lg text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDate(getTodayString());
              }}
              className="px-3 py-1 text-xs font-bold text-slate-600 uppercase"
            >
              Today
            </button>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1,
                  ),
                )
              }
              className="p-1.5 hover:bg-white rounded-lg text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 mb-1 shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-slate-400 uppercase"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-1 lg:gap-2 h-full min-h-0">
          {[...Array(firstDay).keys()].map((i) => (
            <div key={`empty-${i}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((i) => {
            const day = i + 1;
            const month = (currentDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const dayStr = day.toString().padStart(2, "0");
            const dateStr = `${currentDate.getFullYear()}-${month}-${dayStr}`;
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === getTodayString();
            const data = monthData[dateStr] || {};
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative w-full h-full min-h-[40px] rounded-lg border flex flex-col items-center justify-start pt-1 transition-all hover:border-indigo-300 ${isSelected ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-200 z-10" : "bg-white border-slate-100 text-slate-700"}`}
              >
                <span
                  className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-indigo-600 text-white font-bold" : isSelected ? "font-bold text-indigo-700" : ""}`}
                >
                  {day}
                </span>
                <div className="flex flex-wrap justify-center gap-0.5 px-0.5 mt-1">
                  {data.hasExpense && (
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  )}
                  {data.hasTask && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  )}
                  {data.hasHabit && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  )}
                  {data.hasDiary && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Daily Planner Panel */}
      <div className="w-full lg:w-[380px] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">
            {selectedDate === getTodayString()
              ? "Today"
              : formatDate(selectedDate)}
          </div>
          <h3 className="text-lg font-bold text-slate-800">Daily Overview</h3>
        </div>
        <div className="flex p-1 gap-1 border-b border-slate-100 bg-white shrink-0">
          {["overview", "expenses", "tasks", "diary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white min-h-0">
          {activeTab === "overview" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-center">
                  <div className="text-orange-600 text-[10px] font-bold uppercase mb-1">
                    Spent
                  </div>
                  <div className="text-xl font-bold text-slate-800">
                    ${expenses.reduce((s, e) => s + e.amount, 0).toFixed(0)}
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-center">
                  <div className="text-green-600 text-[10px] font-bold uppercase mb-1">
                    Habits
                  </div>
                  <div className="text-xl font-bold text-slate-800">
                    {Object.values(habitStatus).filter(Boolean).length}/
                    {allHabits.length}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                  <CheckSquare size={14} className="text-indigo-600" /> Habits
                </h4>
                <div className="space-y-2">
                  {allHabits.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => toggleHabitForDate(h.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${habitStatus[h.id] ? "bg-green-50 border-green-200" : "bg-white border-slate-100"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${habitStatus[h.id] ? "bg-green-500 border-green-500 text-white" : "border-slate-300"}`}
                      >
                        {habitStatus[h.id] && <Check size={10} />}
                      </div>
                      <span
                        className={`text-xs font-medium ${habitStatus[h.id] ? "text-green-900 line-through" : "text-slate-700"}`}
                      >
                        {h.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-blue-600" /> Tasks
                </h4>
                <div className="space-y-2">
                  {oneOffTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t)}
                      className="flex items-center gap-2 text-xs text-slate-600 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      {t.completed ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <Circle size={14} className="text-slate-300" />
                      )}
                      <span
                        className={t.completed ? "line-through opacity-50" : ""}
                      >
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "expenses" && (
            <div className="space-y-4 animate-fade-in">
              <form
                onSubmit={handleAddExpense}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="$"
                    className="w-16 p-2 rounded border border-slate-200 text-xs"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="flex-1 p-2 rounded border border-slate-200 text-xs"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold uppercase hover:bg-slate-700"
                >
                  Add
                </button>
              </form>
              <div className="space-y-2">
                {expenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex justify-between items-center p-2 bg-white border border-slate-100 rounded-lg shadow-sm text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">
                        {e.description || "Expense"}
                      </div>
                      <div className="text-slate-400">{e.category}</div>
                    </div>
                    <div className="font-bold text-slate-800">-${e.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "tasks" && (
            <div className="space-y-4 animate-fade-in">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New task..."
                  className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </form>
              <div className="space-y-2">
                {oneOffTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t)}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${t.completed ? "bg-slate-50 border-slate-100" : "bg-white border-blue-100"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${t.completed ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300"}`}
                    >
                      {t.completed && <Check size={10} />}
                    </div>
                    <span
                      className={`text-xs ${t.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                    >
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "diary" && (
            <div className="h-full flex flex-col animate-fade-in">
              {isEditingDiary ? (
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    className="flex-1 w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                    placeholder="Write..."
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingDiary(false)}
                      className="flex-1 py-2 text-slate-600 text-xs font-medium hover:bg-slate-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveDiary}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-3 bg-yellow-50/50 rounded-xl border border-yellow-100 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                    {diaryContent || (
                      <span className="text-slate-400 italic">No entry.</span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingDiary(true)}
                    className="mt-2 w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    {diaryContent ? "Edit" : "Write"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. EXPENSES WIDGET
const ExpensesWidget = () => {
  const expenses = useCollection(
    "expenses",
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    description: "",
  });
  const [view, setView] = useState("add");
  const [viewMode, setViewMode] = useState("list");
  const [historyDate, setHistoryDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!form.amount) return;
    db.add("expenses", {
      ...form,
      amount: parseFloat(form.amount),
      date: getTodayString(),
    });
    setForm({ amount: "", category: "Food", description: "" });
  };

  const remove = (id) => db.delete("expenses", id);

  const currentMonthStr = historyDate.toISOString().slice(0, 7);
  const searchFiltered = expenses.filter(
    (e) =>
      (e.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const historyFiltered = searchFiltered.filter(
    (e) => e.date && e.date.startsWith(currentMonthStr),
  );
  const recentFiltered = searchFiltered.slice(0, 20);
  const monthTotal = historyFiltered.reduce(
    (sum, item) => sum + (item.amount || 0),
    0,
  );
  const totalAllTime = expenses.reduce((s, x) => s + x.amount, 0);
  const changeMonth = (offset) =>
    setHistoryDate(
      new Date(historyDate.getFullYear(), historyDate.getMonth() + offset, 1),
    );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex gap-2">
        <div className="flex-1 flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setView("add")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${view === "add" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Plus size={16} /> Add New
          </button>
          <button
            onClick={() => setView("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${view === "history" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <History size={16} /> Monthly History
          </button>
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-full pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>
      </div>
      {view === "add" ? (
        <div className="flex-1 flex flex-col gap-6 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                Total All Time
              </div>
              <div className="text-4xl font-bold text-slate-800 tracking-tight">
                ${totalAllTime.toFixed(2)}
              </div>
            </div>
            <form
              onSubmit={add}
              className="flex-[2] w-full flex flex-col md:flex-row gap-2"
            >
              <div className="flex gap-2 w-full">
                <input
                  type="number"
                  placeholder="$0.00"
                  className="w-1/3 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  step="0.01"
                />
                <select
                  className="w-1/3 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {[
                    "Food",
                    "Transport",
                    "Utilities",
                    "Shopping",
                    "Fun",
                    "Other",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                Add
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex-1 shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">
              Recent Transactions
            </div>
            <div className="overflow-y-auto flex-1">
              {recentFiltered.map((e) => (
                <div
                  key={e.id}
                  className="p-4 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        {e.description || e.category}
                      </div>
                      <div className="text-xs text-slate-500">
                        {e.date} • {e.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800 text-lg">
                      -${e.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => remove(e.id)}
                      className="text-slate-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {recentFiltered.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                  No expenses found.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6 animate-slide-up">
          <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {monthNames[historyDate.getMonth()]}{" "}
                  {historyDate.getFullYear()}
                </div>
                <div className="text-indigo-200 text-sm">Expense Report</div>
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 w-full max-w-sm">
                <div className="text-indigo-200 text-xs font-medium uppercase mb-1">
                  Total Spent in {monthNames[historyDate.getMonth()]}
                </div>
                <div className="text-4xl font-bold">
                  ${monthTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex-1 shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700 flex justify-between items-center">
              <span>Transactions for {monthNames[historyDate.getMonth()]}</span>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition ${viewMode === "list" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition ${viewMode === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {historyFiltered.length > 0 ? (
                viewMode === "list" ? (
                  historyFiltered.map((e) => (
                    <div
                      key={e.id}
                      className="p-3 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition rounded-lg mb-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <PieChart size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            {e.description || e.category}
                          </div>
                          <div className="text-xs text-slate-500">
                            {e.date} • {e.category}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800">
                        -${e.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {historyFiltered.map((e) => (
                      <div
                        key={e.id}
                        className="p-4 rounded-xl border hover:shadow-md transition bg-white flex flex-col items-center text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                          <PieChart size={24} />
                        </div>
                        <div className="font-bold text-slate-800 mb-1">
                          {e.description || e.category}
                        </div>
                        <div className="text-2xl font-bold text-slate-800 mb-1">
                          -${e.amount.toFixed(0)}
                        </div>
                        <div className="text-xs text-slate-400">{e.date}</div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <CalendarIcon size={40} className="opacity-20" />
                  <p>No matching expenses found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. AI ASSISTANT VIEW (ACTIVE MODE - LocalStorage)
const AiAssistantView = () => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `Hi! I'm your Active AI. I can manage your app. Try saying "Add expense $20 for lunch" or "Create a note to buy milk".`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Context gathering from local DB
  const getContext = () => {
    const expenses = db
      .get("expenses")
      .slice(0, 10)
      .map((e) => ({ id: e.id, desc: e.description, amt: e.amount }));
    const notes = db
      .get("notes")
      .slice(0, 10)
      .map((n) => ({ id: n.id, title: n.title }));
    const routines = db
      .get("routine")
      .map((r) => ({ id: r.id, title: r.title }));
    return JSON.stringify({
      expenses,
      notes,
      routines,
      today: getTodayString(),
    });
  };

  const executeAction = async (action) => {
    const { tool, args } = action;
    try {
      if (tool === "add_expense") {
        db.add("expenses", {
          amount: parseFloat(args.amount),
          category: args.category || "Other",
          description: args.description || "Expense",
          date: getTodayString(),
        });
        return `✅ Added expense: $${args.amount} for ${args.description}`;
      }
      if (tool === "add_note") {
        db.add("notes", {
          title: args.title || "Note",
          content: args.content || "",
          color: "bg-yellow-50",
        });
        return `✅ Created note: "${args.title}"`;
      }
      if (tool === "add_routine") {
        db.add("routine", {
          title: args.title,
          lastCompleted: null,
          streak: 0,
          timeOfDay: "Anytime",
        });
        return `✅ Added habit: "${args.title}"`;
      }
      if (tool === "delete_item") {
        const collectionName =
          args.type === "habit" ? "routine" : args.type + "s";
        db.delete(collectionName, args.id);
        return `🗑️ Deleted ${args.type}.`;
      }
      return "Unknown action.";
    } catch (e) {
      return "❌ Failed to perform action.";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Construct prompt
    const contextStr = getContext();
    const systemPrompt = `You are LifeSync Bot. Current Data Context: ${contextStr}. Respond in JSON. Action: { "type": "action", "tool": "TOOL_NAME", "args": { ... } } Chat: { "type": "message", "content": "..." } Tools: add_expense, add_note, add_routine, delete_item.`;
    const fullPrompt = `${systemPrompt}\nUser: ${input}`;

    try {
      const response = await callAI(fullPrompt);

      // Handle possible structured or unstructured response from local LLM
      // Assuming local LLM returns a JSON object similar to Gemini
      // If your local LLM returns just string text, you might need to try parsing it or adjust callAI

      let aiData = response;
      // Simple heuristic if response is wrapped in 'content' or similar from generic AI response
      if (response.choices && response.choices[0])
        aiData = JSON.parse(response.choices[0].message.content); // OpenAI format example
      else if (typeof response === "string") {
        try {
          aiData = JSON.parse(response);
        } catch (e) {
          aiData = { type: "message", content: response };
        }
      }

      if (aiData.type === "action") {
        const resultMsg = await executeAction(aiData);
        setMessages((prev) => [...prev, { role: "model", text: resultMsg }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: aiData.content || JSON.stringify(aiData) },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Error processing request." },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center gap-3 text-white">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold">Active Assistant</h3>
          <p className="text-xs text-indigo-100 flex items-center gap-1 opacity-90">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>{" "}
            Online (Local)
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-scale-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"}`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <Loader2 className="animate-spin text-indigo-600" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-slate-100 flex gap-2"
      >
        <input
          type="text"
          placeholder="Type a command..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

// 0. DASHBOARD (LocalStorage)
const DashboardView = ({ onChangeTab }) => {
  const expenses = useCollection("expenses");
  const notes = useCollection("notes");
  const expenseTotal = expenses.reduce(
    (sum, item) => sum + (item.amount || 0),
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-2 relative z-10">
          {getGreeting()}, Friend.
        </h2>
        <Activity className="absolute right-0 bottom-0 text-white opacity-10 w-48 h-48 -mr-10 -mb-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onChangeTab("expenses")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <DollarSign size={20} />
            <span className="font-medium text-sm">Total Spent</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            ${expenseTotal.toFixed(2)}
          </div>
        </div>
        <div
          onClick={() => onChangeTab("calendar")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <CalendarIcon size={20} />
            <span className="font-medium text-sm">Plan Day</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">Open Calendar</div>
        </div>
        <div
          onClick={() => onChangeTab("notes")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <StickyNote size={20} />
            <span className="font-medium text-sm">Notes</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {notes.length}
          </div>
        </div>
      </div>
    </div>
  );
};

// 1. NOTES WIDGET (LocalStorage)
const NotesWidget = () => {
  const notes = useCollection(
    "notes",
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const add = (e) => {
    e.preventDefault();
    if (!newNote.title) return;
    db.add("notes", { ...newNote, color: "bg-yellow-50" });
    setNewNote({ title: "", content: "" });
    setIsAdding(false);
  };
  const remove = (id) => db.delete("notes", id);
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 shrink-0">
          Sticky Notes
        </h2>
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition ${viewMode === "list" ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition ${viewMode === "grid" ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shrink-0"
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />} Note
          </button>
        </div>
      </div>
      {isAdding && (
        <form
          onSubmit={add}
          className="bg-white p-4 rounded-xl shadow-lg border"
        >
          <input
            className="w-full font-bold mb-2 border-b outline-none"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            autoFocus
          />
          <textarea
            className="w-full h-24 outline-none resize-none"
            placeholder="Content"
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
          />
          <button className="w-full bg-slate-900 text-white py-2 rounded mt-2">
            Save
          </button>
        </form>
      )}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredNotes.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-xl shadow-sm border bg-yellow-50 relative group hover:-translate-y-1 transition-transform"
            >
              <button
                onClick={() => remove(n.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <h3 className="font-bold mb-2">{n.title}</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {n.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotes.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl shadow-sm border bg-white flex justify-between items-center group"
            >
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{n.title}</h3>
                <p className="text-sm text-slate-500 truncate">{n.content}</p>
              </div>
              <button
                onClick={() => remove(n.id)}
                className="text-slate-300 hover:text-red-500 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {filteredNotes.length === 0 && (
        <div className="text-center text-slate-400 mt-10">No notes found.</div>
      )}
    </div>
  );
};

// 4. DIARY WIDGET (LocalStorage)
const DiaryWidget = () => {
  const entries = useCollection(
    "diary",
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const save = () => {
    db.add("diary", { ...form, date: getTodayString() });
    setEditing(false);
    setForm({ title: "", content: "" });
  };
  const filteredEntries = entries.filter(
    (e) =>
      (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.content || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (viewMode === "grid") {
    return (
      <div className="h-full flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search journal..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition ${viewMode === "list" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition ${viewMode === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <button
              onClick={() => {
                setEditing(true);
                setViewMode("list");
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Entry
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto p-1">
          {filteredEntries.map((e) => (
            <div
              key={e.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition cursor-pointer flex flex-col h-48"
            >
              <div className="font-bold text-lg text-slate-800 mb-1">
                {e.title || "Untitled"}
              </div>
              <div className="text-xs text-slate-400 mb-3">{e.date}</div>
              <div className="text-sm text-slate-600 line-clamp-4 flex-1">
                {e.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] gap-6">
      <div className="w-1/3 bg-white border rounded-2xl flex flex-col overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg text-sm border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none border transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
          </div>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition ${viewMode === "list" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition ${viewMode === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-400"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredEntries.map((e) => (
            <div
              key={e.id}
              className="p-4 border rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="font-bold truncate text-slate-800">{e.title}</div>
              <div className="text-xs text-slate-400">{e.date}</div>
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-center text-slate-400 mt-10 text-sm">
              No entries found.
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 bg-white border rounded-2xl p-6 flex flex-col">
        {editing ? (
          <>
            <input
              className="text-2xl font-bold mb-4 outline-none"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="flex-1 outline-none resize-none"
              placeholder="Write..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <button
              onClick={save}
              className="bg-slate-900 text-white py-2 rounded mt-2"
            >
              Save
            </button>
          </>
        ) : (
          <div
            className="flex-1 flex items-center justify-center text-slate-300 cursor-pointer hover:text-slate-500 transition"
            onClick={() => setEditing(true)}
          >
            <Plus size={48} className="mb-2" /> New Entry
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null); // Just a placeholder now
  const [view, setView] = useState("landing");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate Auth Load
  useEffect(() => {
    setTimeout(() => {
      // Auto login for local demo
      setUser({ uid: "local_user", displayName: "Guest" });
      setLoading(false);
      setView("app");
    }, 1000);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  const handleLogin = () => {
    setUser({ uid: "local_user", displayName: "Guest" });
    setView("app");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600">
        <Loader2 className="animate-spin mr-2" /> Loading Local LifeSync...
      </div>
    );

  if (view === "landing")
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-5xl font-bold mb-4 text-slate-900">LifeSync</h1>
        <p className="text-xl text-slate-500 mb-8 max-w-md">
          Master your day locally. Track expenses, habits, and memories.
        </p>
        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition"
        >
          Enter App
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      <style>{styles}</style>
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div
            className="flex items-center gap-3 mb-8 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">LifeSync</h1>
          </div>
          <nav className="space-y-2 flex-1">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "expenses", icon: Wallet, label: "Expenses" },
              { id: "calendar", icon: CalendarIcon, label: "Calendar" },
              { id: "tasks", icon: ListTodo, label: "Tasks" },
              { id: "diary", icon: Book, label: "Diary" },
              { id: "routine", icon: CheckSquare, label: "Habits" },
              { id: "notes", icon: StickyNote, label: "Notes" },
              {
                id: "ai_assistant",
                icon: MessageSquare,
                label: "AI Assistant",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === item.id ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-500 text-sm font-medium"
          >
            <Shield size={16} /> Exit Demo
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600"
          >
            <Menu />
          </button>
          <span className="font-bold text-slate-800 capitalize">
            {activeTab.replace("_", " ")}
          </span>
          <div className="w-6"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === "dashboard" && (
              <DashboardView onChangeTab={setActiveTab} />
            )}
            {activeTab === "calendar" && <CalendarView />}
            {activeTab === "tasks" && <TasksWidget />}
            {activeTab === "diary" && <DiaryWidget />}
            {activeTab === "expenses" && <ExpensesWidget />}
            {activeTab === "routine" && <RoutineWidget />}
            {activeTab === "notes" && <NotesWidget />}
            {activeTab === "ai_assistant" && <AiAssistantView />}
          </div>
        </main>
      </div>
    </div>
  );
}
