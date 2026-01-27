import {
  CalculatorIcon,
  Calendar,
  FileText,
  IndianRupee,
  Info,
  Notebook,
  Trash2,
} from "lucide-react";
import React, { useState, useRef } from "react";
import "../.././index.css";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useSelector } from "react-redux";
import { isTaskDue } from "../../services/function";
import Time from "../Common/Time";

const HomeBottom = ({ tl, expenses, tasks, notes }) => {
  let diaries = useSelector((state) => state.diary.entry);
  diaries = diaries.slice(0, 5);
  notes = notes.slice(0, 5);
  // Journal State
  const [activeJournal, setActiveJournal] = useState();
  const [moreNotes, setMoreNotes] = useState(false);
  const [moreJournal, setMoreJournal] = useState(false);
  const [moreExpenses, setMoreExpenses] = useState(false);

  // Toggle Task Completion
  const toggleTask = () => {};

  // Animation for the upper section
  const upperRef = useRef();
  const lowerRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();
  const journalRef = useRef();

  // Animations
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(
        upperRef.current,
        {
          y: 500,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: "power4.out",
        },
        "+=0.3",
      );

      tl.from(
        ".upper-section .left",
        {
          x: -400,
          opacity: 0,
          duration: 1,
          backgroundColor: "#e6e6e6",
          ease: "power4.out",
        },
        "-=0.5",
      );

      tl.from(
        ".upper-section .right",
        {
          x: 400,
          opacity: 0,
          backgroundColor: "#e6e6e6",
          duration: 1,
          ease: "power4.out",
        },
        "-=0.5",
      );

      tl.from(
        ".upper-section .left .header",
        {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.7",
      );

      tl.from(
        ".upper-section .right .header",
        {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.7",
      );

      tl.from(
        ".upper-section .left .list .item",
        {
          x: -50,
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=0.6",
      );

      tl.from(
        ".upper-section .right .list .item",
        {
          x: 50,
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "<",
      );
    },
    { scope: upperRef, currentTimeline: tl },
  );
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".upper-section",
          scroll: "body",
          start: "top 80%",
          once: true,
          // markers: true,
        },
      });

      tl2
        .from(
          ".lower-section",
          {
            y: 600,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
          },
          "-=0.2",
        )

        .from(".lower-section .header", {
          y: -300,
          opacity: 0,
        })

        .from(".lower-section .header .left", {
          x: -400,
          opacity: 0,
          duration: 0.4,
        })

        .from(
          ".lower-section .header .right",
          {
            x: 400,
            opacity: 0,
            duration: 0.4,
          },
          "<",
        )

        .from(".lower-section .body", {
          y: 400,
          opacity: 0,
        })

        .from(".lower-section .body .left", {
          x: -400,
          duration: 0.5,
          opacity: 0,
        })

        .from(
          ".lower-section .body .right",
          {
            x: 400,
            duration: 0.5,
            opacity: 0,
          },
          "<",
        )

        .to(
          leftRef.current.children,
          {
            x: -200,
            y: 30,
            opacity: 0,
            delay: 0.1,
            scale: 0,
          },
          "-=5",
        )

        .to(
          rightRef.current.children,
          {
            x: 200,
            y: 30,
            opacity: 0,
            delay: 0.1,
            scale: 0,
          },
          "<",
        )

        .to(leftRef.current.children, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 0.6,
        })

        .to(
          rightRef.current.children,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.2,
            duration: 0.6,
          },
          "<",
        );

      tl2.pause();
    },
    { scope: lowerRef.current },
  );
  useGSAP(
    () => {
      if (!journalRef.current) return;
      if (!journalRef.current.children.length) return;

      gsap.from(journalRef.current.children, {
        y: 300,
        autoAlpha: 0,
        stagger: 0.15,
      });
    },
    { scope: journalRef, dependencies: [activeJournal] },
  );

  return (
    <>
      {/* Recent Transactions and Tasks Section  */}
      <div
        ref={upperRef} //h-100 h-128
        className="
        upper-section
        w-full
        h-100
      bg-white
        flex
        items-center
        justify-between 
        rounded-xl p-5"
      >
        {/* Recent Transactions Section */}
        <div
          className="
          left 
          w-[48%] 
          h-full 
          rounded-xl
          border
        border-gray-100
          "
        >
          {/* Recent Transactions Header Section  */}
          <div className="header flex justify-between items-center p-5 bg-[#e4e4e4] rounded-xl rounded-b-none">
            <h2 className="text-center text-xl font-bold">
              Recent Transactions
            </h2>
            <a
              href="/expenses"
              className="text-blue-600 hover:text-blue-900 font-medium text-sm"
            >
              VIEW ALL
            </a>
          </div>
          {/* Recent Transactions List */}
          <div className="list bg-white h-[calc(100%-4.28rem)] rounded-xl rounded-t-none overflow-y-auto no-scrollbar">
            {/* Expense List */}
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="item w-full flex items-center bg-white text-black hover:bg-[#f1f3f6] cursor-pointer group"
              >
                {/* Icon */}
                <div className="icon bg-[#F1F5F9] p-3 rounded-4xl ml-5">
                  <IndianRupee size={20} />
                </div>
                {/* Transaction Details*/}
                <div className="middle flex-1 px-4 py-4">
                  <p className="font-medium">{expense.content}</p>
                  <p className="text-xs opacity-40 flex items-center gap-2 mt-0.5">
                    <span className="flex gap-0.5 items-center">
                      <Time time={expense.createdAt} size={11} />
                    </span>
                    <span>{expense.title}</span>
                  </p>
                </div>
                {/* Transaction Amount */}
                <div className="mr-5">-{expense.amount}</div>
                <button className="text-red-500 mr-5 opacity-0 cursor-pointer active:scale-90 transition-all duration-300 group-hover:opacity-100 ">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {/* Load More Button */}
            {moreExpenses && (
              <div className="flex items-center justify-center my-6">
                <button
                  className="px-12 py-3 rounded-lg cursor-pointer text-[12px] font-bold active:scale-95 bg-[#f0f0f0] hover:bg-[#e0e0e0]"
                  onClick={() => setMoreExpenses(false)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div
          className="          
        right
        w-[48%] 
        h-full 
        border
        border-gray-100
        rounded-xl"
        >
          {/* Tasks Header Section  */}
          <div className="header flex justify-between items-center p-5 bg-[#e4e4e4] rounded-xl rounded-b-none">
            <h2 className="text-center text-xl font-bold">Tasks</h2>
            <a
              href="/routines"
              className="text-blue-600 hover:text-blue-900 font-medium text-sm"
            >
              VIEW ALL
            </a>
          </div>
          {/* Routine List */}
          <div className="list bg-white h-[calc(100%-4.28rem)] rounded-xl rounded-t-none overflow-y-auto no-scrollbar">
            {/* Routine Items */}
            {tasks && tasks.length > 0 ? (
              tasks.map((task, i) => (
                <div
                  key={i}
                  className="item w-full flex items-center bg-white text-black hover:bg-[#f1f3f6] cursor-pointer group"
                >
                  {/* Input */}
                  <div className="icon bg-[#F1F5F9] p-2.5 rounded-4xl ml-5 flex items-center justify-center">
                    <input
                      onChange={() => toggleTask(task.id)}
                      checked={task.isDone}
                      type="checkbox"
                      className="
                      w-4 h-4
                      rounded-full
                      cursor-pointer
                      appearance-none
                      border-0
                      outline-none
                    bg-gray-300
                    checked:bg-indigo-600
                      transition-all  
                      duration-50
                      ease-out
                      checked:scale-110
                      focus:ring-0"
                    />
                  </div>
                  {/* Task Details */}
                  <div className="middle flex-1 px-4 py-4">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-400 flex gap-2 items-center mt-0.5">
                      <span
                        className={`${isTaskDue(task.createdAt) ? "text-red-400" : ""} flex  items-center gap-0.5`}
                      >
                        <Time size={11} time={task.createdAt} />
                      </span>
                      <span>{task.content}</span>
                    </p>
                  </div>
                  {/* Delete Button */}
                  <button className="mr-5">
                    <Trash2
                      size={20}
                      className="text-red-400 cursor-pointer active:scale-95 transition-colors opacity-0 group-hover:opacity-100"
                    />
                  </button>
                </div>
              ))
            ) : (
              // No Pending Routines Message
              <div className="p-5 h-full w-full flex items-center justify-center text-green-600">
                No pending tasks!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest Journal and Notes Section */}
      <div
        className="
      lower-section
      w-full
      h-120
      flex
      flex-col
      rounded-xl
      mb-12
      mt-8
    bg-white"
      >
        {/* Latest Journal Header */}
        <div className="header flex justify-between items-center p-5 py-6 bg-[#e4e4e4] rounded-xl rounded-b-none overflow-hidden">
          <a
            href="/diary"
            className="text-center text-xl font-bold 
                        left
                        relative
                        after:absolute 
                        after:top-full
                        after:right-0
                        after:opacity-0
                        after:text-xs           
                        after:transition-opacity 
                        after:duration-300 
                        hover:after:opacity-30
                        after:content-[''] 
                        hover:after:content-['OPEN_JOURNAL']
                      hover:after:text-gray-600
            "
          >
            Latest Journal
          </a>

          <a
            href="/notes"
            className="text-center text-xl font-bold 
                        right                        
                        relative
                        after:absolute 
                        after:top-full
                        after:right-12 
                        after:opacity-0
                        after:text-xs           
                        after:transition-opacity 
                        after:duration-300 
                        hover:after:opacity-30
                        after:content-[''] 
                        hover:after:content-['OPEN_NOTES']
                      hover:after:text-gray-600
                      pr-12
            "
          >
            Latest Notes
          </a>
        </div>
        {/* Latest Journal and Notes Content */}
        <div
          className="
          body
          w-full
          h-[calc(100%-4.28rem)]
          flex
          overflow-hidden
          justify-between
          "
        >
          {/* Latest Journal List */}
          <div
            ref={leftRef}
            className="left h-full w-[15%] overflow-y-scroll no-scrollbar"
          >
            {/* Latest Items */}
            {diaries.map((entry, index) => (
              <div
                key={index}
                className="item p-3.5 w-10/11 bg-[#f0f0f0] cursor-pointer m-2 flex items-center justify-between rounded-lg transition-all duration-200 group"
              >
                <div
                  className="info flex-1 mr-1 active:scale-95"
                  onClick={() => {
                    setActiveJournal(entry);
                  }}
                >
                  <h2 className="font-semibold">{entry.title}</h2>
                  <p className="opacity-40 text-xs ml-1">
                    <Time size={11} time={entry.createdAt} />
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100">
                  {" "}
                  <Trash2
                    size={20}
                    className="text-red-400 cursor-pointer active:scale-95 transition-colors"
                  />
                </button>
              </div>
            ))}
            {/* Load More Button */}
            {moreJournal && (
              <div className="flex items-center justify-center my-6">
                <button
                  className="px-5 py-3 rounded-lg cursor-pointer text-[12px] font-bold active:scale-95 bg-[#f0f0f0] hover:bg-[#e0e0e0]"
                  onClick={() => setMoreJournal(false)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
          {/* Latest Journal and Notes Content */}
          <div className="middle flex-1 h-full w-10/12 overflow-y-auto no-scrollbar p-5 bg-[#fafafa]">
            {activeJournal ? (
              <div ref={journalRef}>
                <h2 className="text-xl font-bold p-2 w-full">
                  {activeJournal.title}
                </h2>
                <p className="pl-3">{activeJournal.content}</p>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-600">
                Select a journal entry to read.
              </div>
            )}
          </div>
          {/* Latest Notes List */}
          <div
            ref={rightRef}
            className="right h-full w-[15%] overflow-y-scroll no-scrollbar"
          >
            {/* Latest Items */}
            {notes.map((note, index) => (
              <div
                key={index}
                className="item p-3.5 w-10/11 bg-[#f0f0f0] cursor-pointer m-2 flex items-center justify-between rounded-lg transition-all duration-200 group"
              >
                <div
                  className="info flex-1 mr-1 active:scale-95"
                  onClick={() => {
                    setActiveJournal(note);
                  }}
                >
                  <h2 className="font-semibold">{note.title}</h2>
                  <p className="opacity-40 text-xs ml-1">
                    <Time size={11} time={note.createdAt} />
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100">
                  {" "}
                  <Trash2
                    size={20}
                    className="text-red-400 cursor-pointer active:scale-95 transition-colors"
                  />
                </button>
              </div>
            ))}
            {/* Load More Button */}
            {moreNotes && (
              <div className="flex items-center justify-center my-6">
                <button
                  className="px-5 py-3 rounded-lg cursor-pointer text-[12px] font-bold active:scale-95 bg-[#f0f0f0] hover:bg-[#e0e0e0]"
                  onClick={() => setMoreNotes(false)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBottom;
