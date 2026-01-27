import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import gsap from "gsap";
import { LayoutGrid, List, ListTodo } from "lucide-react";
import { useSelector } from "react-redux";
import TaskList from "./TaskList";
import TaskGrid from "./TaskGrid";
import { useGSAP } from "@gsap/react";

const TasksPage = () => {
  const layout = localStorage.getItem("layout") || "list";
  const [view, setView] = useState(layout);
  const [taskStatus, setTaskStatus] = useState("pending");
  const containerRef = useRef(null);
  const headRightRef = useRef(null);
  const tasks = useSelector((state) => state.todo.todo);
  const temp = tasks.filter((task) => task.isDone != true);
  const [data, setData] = useState(temp);

  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   gsap.fromTo(
  //     containerRef.current.children,
  //     {
  //       opacity: 0,
  //       y: 20,
  //       scale: 0.95,
  //     },
  //     {
  //       opacity: 1,
  //       y: 0,
  //       scale: 1,
  //       duration: 0.4,
  //       stagger: 0.06,
  //       ease: "power3.out",
  //     }
  //   );
  // }, [view]);
  const handleData = (str) => {
    setTaskStatus(str);
    if (str === "pending") {
      const temp = tasks.filter((task) => task.isDone != true);
      setData(temp);
    } else {
      const temp = tasks.filter((task) => task.isDone == true);
      setData(temp);
    }
  };
  const handleView = (layout) => {
    setView(layout);
    localStorage.setItem("layout", layout);
  };

  const tl = useRef(gsap.timeline());
  // useGSAP(() => {
  //   tl.current.from(
  //     ".taskBody",
  //     {
  //       y: 800,
  //       duration: 0.6,
  //       scale: 0.6,
  //     },
  //     '-=2'
  //   )
  //     .from(".taskHead", {
  //       y: 200,
  //       duration: 0.2,
  //       autoAlpha: 0,
  //     },'-=0.5')

  //     .from(".taskHead h2", {
  //       x: -600,
  //       duration: 0.6,
  //       autoAlpha: 0,
  //     })

  //     .from(
  //       headRightRef.current.children,
  //       {
  //         x: 800,
  //         scale: 0,
  //         autoAlpha: 0,
  //         stagger: 0.15,
  //       },
  //       "<"
  //     );
  // });

  return (
    <div className="px-4 h-[8%] w-full taskBody">
      <div className="h-full w-full rounded-2xl flex flex-col justify-between items-center">
        {/* Header */}
        <div className="taskHead w-full h-20 bg-[#e4e4e4] rounded-t-2xl flex justify-between items-center px-6">
          <h2 className="text-xl font-semibold">
            {taskStatus === "pending" ? "To Do List" : "Completed History"}
          </h2>
          <div
            ref={headRightRef}
            className="bg-100 flex gap-5 justify-between items-center py-1"
          >
            <p className="p-2 bg-gray-300 rounded-full py-1 px-2 font-medium text-lg text-black">
              {data.length}
            </p>

            {/*  */}
            <div className="flex gap-2 bg-gray-300 py-1 px-2 rounded-md">
              <button
                onClick={() => handleData("pending")}
                className={`${
                  taskStatus === "pending"
                    ? "bg-indigo-500  text-white"
                    : "text-gray-400"
                } px-5 py-1 border-2 border-transparent rounded-md cursor-pointer`}
              >
                {" "}
                Pending
              </button>
              <button
                onClick={() => handleData("history")}
                className={`${
                  taskStatus === "history"
                    ? "bg-green-500  text-white"
                    : "text-gray-400"
                } px-5 py-1 border-2 border-transparent rounded-md cursor-pointer`}
              >
                History
              </button>
            </div>

            {/* View */}
            <div className="bg-gray-300 rounded-md flex justify-between gap-2 p-2.5">
              <List
                size={30}
                onClick={() => handleView("list")}
                className={`${
                  view === "list" ? "bg-white" : "text-gray-400"
                } p-1.5 rounded-md cursor-pointer`}
              />
              <LayoutGrid
                size={30}
                onClick={() => handleView("grid")}
                className={`${
                  view === "grid" ? "bg-white" : "text-gray-400"
                } p-1.5 rounded-md cursor-pointer`}
              />
            </div>
          </div>
        </div>
        {/* Body / Empty State */}
        <div className="flex-1 w-full bg-white shadow-2xl rounded-b-2xl overflow-hidden">
          {tasks.length > 0 ? (
            view === "list" ? (
              <TaskList data={data} tl={tl} />
            ) : (
              <TaskGrid data={data} />
            )
          ) : (
            taskStatus && (
              <div className="h-full w-full flex justify-center items-center">
                <h2 className="text-gray-300 flex justify-center items-center flex-wrap">
                  <ListTodo size={40} className="w-full" />
                  <p className="w-full text-center"> No tasks found.</p>
                </h2>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
