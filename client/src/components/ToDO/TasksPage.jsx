import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LayoutGrid,
  List,
  ListTodo,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import TaskList from "./TaskList";
import TaskGrid from "./TaskGrid";

gsap.registerPlugin(useGSAP);

const TasksPage = () => {
  /* 🔹 State */
  const [view, setView] = useState(
    () => localStorage.getItem("layout") || "list",
  );
  const [taskStatus, setTaskStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(false);

  /* 🔹 Redux */
  const tasks = useSelector((state) => state.todo.todo);

  /* 🔹 Derived data */
  const data = tasks.filter((task) =>
    taskStatus === "pending" ? !task.isDone : task.isDone,
  );

  /* 🔹 Refs */
  const containerRef = useRef(null);
  const taskCon = useRef(null);
  const taskConNav = useRef(null);
  const headRightRef = useRef(null);

  /* 🔹 Timeline (created once) */
  const introTL = useRef(null);
  if (!introTL.current) introTL.current = gsap.timeline();

  /* 🔹 Intro animation */
  useGSAP(
    () => {
      introTL.current.clear();

      introTL.current
        .fromTo(
          taskCon.current,
          { y: 400, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5 },
        )
        .from(taskConNav.current, {
          y: 300,
          autoAlpha: 0,
          duration: 0.4,
        })
        .from(".task-nav-h2", {
          y: 200,
          autoAlpha: 0,
          duration: 0.4,
        })
        .from(headRightRef.current.children, {
          y: 200,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.14,
        });
    },
    { scope: containerRef, dependencies: [] },
  );

  /* 🔹 Handlers */
  const handleView = (layout) => {
    setView(layout);
    localStorage.setItem("layout", layout);
  };

  return (
    <div ref={containerRef} className="px-4 h-[86%] w-full taskBody">
      <div ref={taskCon} className="h-full w-full rounded-2xl flex flex-col">
        {/* Header */}
        <div
          ref={taskConNav}
          className="w-full h-20 bg-[#e4e4e4] rounded-t-2xl flex justify-between items-center px-6"
        >
          <h2 className="text-xl font-semibold task-nav-h2">
            {taskStatus === "pending" ? "To Do List" : "Completed History"}
          </h2>

          <div ref={headRightRef} className="flex gap-5 items-center">
            {taskStatus === "history" && (
              <button
                className="text-red-500 hover:text-red-600 active:scale-90 transition"
                aria-label="Clear history"
              >
                <Trash2 size={20} />
              </button>
            )}

            <button
              onClick={() => setIsLoading((p) => !p)}
              className="bg-[#ca5fe725] text-[#9565e7] px-2 py-2 rounded-full"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Sparkles size={15} />
              )}
            </button>

            <p className="bg-gray-300 rounded-full px-3 py-1 font-medium">
              {data.length}
            </p>

            {/* Status */}
            <div className="flex gap-2 bg-gray-300 p-1 rounded-md">
              <button
                onClick={() => setTaskStatus("pending")}
                className={`px-4 py-1 rounded-md cursor-pointer ${
                  taskStatus === "pending"
                    ? "bg-indigo-500 text-white"
                    : "text-gray-400"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setTaskStatus("history")}
                className={`px-4 py-1 rounded-md cursor-pointer ${
                  taskStatus === "history"
                    ? "bg-green-500 text-white"
                    : "text-gray-400"
                }`}
              >
                History
              </button>
            </div>

            {/* View */}
            <div className="bg-gray-300 rounded-md flex gap-2 p-1">
              <List
                size={28}
                role="button"
                tabIndex={0}
                aria-label="List view"
                onClick={() => handleView("list")}
                className={`cursor-pointer p-1.5 rounded-md ${
                  view === "list" ? "bg-white" : "text-gray-400"
                }`}
              />
              <LayoutGrid
                size={28}
                role="button"
                tabIndex={0}
                aria-label="Grid view"
                onClick={() => handleView("grid")}
                className={`cursor-pointer p-1.5 rounded-md ${
                  view === "grid" ? "bg-white" : "text-gray-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 w-full bg-white shadow-2xl rounded-b-2xl overflow-hidden">
          {tasks.length > 0 ? (
            view === "list" ? (
              <TaskList data={data} />
            ) : (
              <TaskGrid data={data} />
            )
          ) : (
            <div className="h-full w-full flex justify-center items-center text-gray-300">
              <div className="text-center">
                <ListTodo size={40} className="mx-auto" />
                <p>No tasks found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
