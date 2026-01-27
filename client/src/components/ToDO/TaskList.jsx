import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Calendar, Calendar1, Trash2 } from "lucide-react";
import React, { useRef } from "react";
import ListItem from "../Common/ListItem";

const TaskList = ({ data }) => {
  const taskConRef = useRef(null);

  useGSAP(
    () => {
      if (!taskConRef.current) return;

      // Clear previous animations
      const tl = gsap.timeline();
      tl.clear();

      // Scope GSAP to this component only
      const ctx = gsap.context(() => {
        tl.from(taskConRef.current, {
          y: 120,
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.6,
          ease: "power3.out",
        }).from(".task-item", {
          y: 60,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.12,
          ease: "power3.out",
        });
      }, taskConRef);

      return () => ctx.revert();
    },
    { dependencies: [data.length] },
  );

  return (
    <div
      ref={taskConRef}
      className="w-full max-h-full overflow-y-auto no-scrollbar"
    >
      {data.map((task, i) => (
        <ListItem data={task} key={i} />
      ))}
    </div>
  );
};

export default TaskList;
