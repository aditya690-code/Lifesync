import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import AddTask from "./AddTask";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Header = ({ addTask }) => {
  const [showForm, setShowForm] = useState(false);
  // const [tasks, setTasks] = useState("pending");
  // const [view, setView] = useState("list");
  const formRef = useRef(null);

  const toggleForm = () => {
    if (!showForm) {
      setShowForm(true);
      const tl = gsap.timeline();
      tl.fromTo(
        formRef.current,
        { height: 0, opacity: 0, y: -10 },
        { height: "auto", opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    } else {
      gsap.to(formRef.current, {
        height: 0,
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setShowForm(false),
      });
    }
  };
  const tl = gsap.timeline();
  useEffect(() => {
    if (!showForm) return;

    tl.from(formRef.current.children, {
      x: 1200,
      autoAlpha: 0,
      duration: 0.6,
      scale: 0,
      stagger: 0.12,
    });
  }, [showForm]);

  const handleTaskForm = (title, content) => {
    if (title == "" || content == "") return;
    addTask(title, content);
  };

  useGSAP(() => {
    tl.from(
      ".add-contianer",
      {
        x: 200,
        y: 50,
        duration: 0.6,
        autoAlpha: 0,
        scale: 0,
      },
      "+=1"
    );
  });

  return (
    <div className="w-full flex flex-col gap-3 px-4">
      {/* Top Bar */}

      {/* Add Task Section */}
      <div className="flex justify-end w-full relative h-16 ">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 py-0 max-w-full min-w-17 flex justify-between items-center add-contianer">
          {/* Animated Form */}
          {showForm && (
            <AddTask
              handleTaskForm={handleTaskForm}
              formRef={formRef}
              addTask={addTask}
            />
          )}
          <div className="flex justify-between items-center w-fit absolute right-4">
            <button
              onClick={toggleForm}
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition my-2 cursor-pointer shadow shadow-2xl"
            >
              {showForm ? (
                <X size={18} />
              ) : (
                <Plus className="plusBtn" size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;