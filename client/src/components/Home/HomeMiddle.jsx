import React, { useRef } from "react";
import {
  CheckSquare,
  StickyNote,
  Flame,
  IndianRupee,
  Book,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import Tab from "./Tab";
import gsap from "gsap";

const HomeMiddle = ({
  onChangeTab,
  total,
  progressPercent,
  notes,
  diaries,
}) => {
  const conRef = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo(
        ".tab",
        { x: -100, y: 80, opacity: 0, scale: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          scale: 1,
          ease: "power3.out",
        },
        "-=0.1",
      );
    },
    { scope: conRef },
  );

  return (
    <div
      className="sub-infos grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden pb-3"
      ref={conRef}
    >
      {[
        {
          tab: "expenses",
          icon: IndianRupee,
          color: "green",
          label: "Total Spent",
          val: `₹${total}`,
          sub: null,
        },
        {
          tab: "routines",
          icon: CheckSquare,
          color: "purple",
          label: "Tasks Score",
          val: `${progressPercent}%`,
          sub: (
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden ml-3">
              <div
                className="h-full bg-purple-500 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          ),
        },
        {
          tab: "notes",
          icon: StickyNote,
          color: "yellow",
          label: "Active Notes",
          val: notes.length,
          sub: null,
        },
        {
          tab: "diary",
          icon: Book,
          color: "indigo",
          label: "Active Journal",
          val: diaries.length,
          sub: null,
        },
      ].map((item, i) => (
        <Tab onChangeTab={onChangeTab} item={item} i={i} key={i} />
      ))}
    </div>
  );
};

export default HomeMiddle;
