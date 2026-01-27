import { IndianRupee, Trash2, Edit } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ExpenseBottom = ({ expenses }) => {
  // const currUser = {
  //   name: "Aditya",
  //   budget: 25000,
  // };

  // const currentMonth = 12;
  // const currentYear = 2025;

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".tb",
        start: "top 60%",
        once: true,
      },
    });
    tl.from(".tableBox", {
      y: 1000,
      scale: 0,
      autoAlpha: 0,
      duration: 0.7,
    })
      .from(".tableBox h4", {
        y: -700,
        autoAlpha: 0,
        duration: 0.7,
      })
      .from(".tableBox h4 span", {
        x: -700,
        autoAlpha: 0,
        duration: 0.7,
      })
      .from(".tableContent", {
        scale: 0,
        y: 1000,
        duration: 0.8,
        autoAlpha: 0,
      })

      .from(".cont", {
        x: 400,
        autoAlpha: 0,
        scale: 0,
        duration: 0.7,
        stagger: 0.18,
      });

    tl.pause();
  });

  return (
    <div className="tb w-full">
      {/* ===== Expense Table ===== */}
      <div className="tableBox bg-white rounded-2xl shadow">
        <h4 className="text-xl font-semibold flex items-center gap-2 bg-[#E4E4E4] w-full p-6 rounded-2xl rounded-b-none">
          <span>Expense Details</span>
        </h4>

        <div
          className="
              tableContent
              overflow-hidden
              h-160
              mb-16 
              overflow-y-scroll  
              p-0 
              no-scrollbar
          "
        >
          {expenses.map((expense, i) => (
            <div
              className="cont w-full flex justify-between py-3 px-12 hover:bg-[#f1f3f6] cursor-pointer"
              id={expense._id}
              key={i}
            >
              <div className="left flex items-centerflex-1 cursor-pointer">
                {/* Icon */}
                <div className="w-60 h-12flex items-center text-lg">
                  -₹{expense.amount.toLocaleString()}
                </div>
                {/* Info */}
                <div className="info pl-6">
                  <h2 className="text-lg">
                    {expense.content.charAt(0).toUpperCase() +
                      expense.content.slice(1)}
                  </h2>
                  <p className="text-xs flex gap-2 text-gray-400">
                    <span>{expense.category}</span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              <div className="right w-16 flex items-center justify-between">
                <Edit className="text-indigo-500 active:scale-95" size={20} />
                <Trash2 className="text-red-500 active:scale-95" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseBottom;
