import React, { useEffect } from "react";
import Header from "../components/ToDO/Header";
import TasksPage from "../components/ToDO/TasksPage";
import gsap from "gsap";
import { useSelector } from "react-redux";

const ToDo = () => {
  const today = new Date();
  const todo = useSelector((state) => state.todo.todo);
  const todayTasks = todo.filter(
    (task) =>
      task.createdAt.date === today.getDate() &&
      task.createdAt.month === today.getMonth() &&
      task.createdAt.year === today.getFullYear(),
  );
  const completedTasks = todayTasks.filter((task) => task.isDone === true);

  const totalTasks = todayTasks.length;
  const doneTasks = completedTasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const tl = gsap.timeline();
  const addTask = (title, content) => {
    if (title === "" || content === "") return;
    console.log("title", title);
    console.log("content", content);
  };

  useEffect(() => {
    gsap.to(".progress-bar", {
      width: `${progress}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [progress]);
  return (
    <div className="bg-r h-[calc(100vh-4rem)] w-full px-4 flex flex-col justify-between gap-5 py-7">
      <div className="w-full h-3 px-4">
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <div className={`progress-bar h-full bg-indigo-500`}></div>
        </div>
      </div>
      <Header addTask={addTask} />
      <TasksPage tl={tl} />
    </div>
  );
};

export default ToDo;
