import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";
import { Link } from "react-router-dom";
import { monthNames } from "../../services/calendar";

const Navigation = ({ page, handlePage }) => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(
      ".navi",
      {
        x: 1200,
      },
      "+=3.6",
    );
    tl.from(".link", {
      y: 100,
      autoAlpha: 0,
      stagger: 0.12,
      scale: 0,
    });
  });

  return (
    <>
      <div className="navi w-full h-16 flex items-center justify-end">
        <div className="h-full w-fit flex justify-center gap-1 items-center py-0.5 bg-white rounded-lg px-4">
          <Link
            to={"/expenses"}
            className={`${
              page === "current" ? "bg-[#1E293C] text-white" : "text-gray-800"
            } px-12 py-2.5  rounded-sm text-lg font-normal link`}
            onClick={() => handlePage("current")}
          >
            {monthNames[new Date().getMonth()]}
          </Link>
          <Link
            to={"/expenses"}
            className={`${
              page === "history" ? "bg-[#5046e5] text-white" : "text-gray-800"
            } px-12 py-2.5  rounded-sm text-lg font-normal link`}
            onClick={() => handlePage("history")}
          >
            History
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
