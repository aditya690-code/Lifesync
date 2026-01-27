import { Calendar } from "lucide-react";
import React from "react";

const Time = ({ time, size }) => {
  return (
    <span className="flex items-center gap-0.5">
      <Calendar size={size} />
      {time.date}/{time.month + 1}/{time.year}
    </span>
  );
};

export default Time;
