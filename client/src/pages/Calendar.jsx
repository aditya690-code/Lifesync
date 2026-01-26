import React, { useState } from "react";
import CalendarSection from "../components/Calendar/CalendarSection";
import CalendarSummery from "../components/Calendar/CalendarSummery";
import { getDay, monthNames } from "../services/calendar";

const Calendar = () => {
  const today = new Date();

  const [activeDate, setActiveDate] = useState({
    day: getDay(today.getDay()),
    date: today.getDate(),
    month: monthNames[today.getMonth()],
    year: today.getFullYear(),
    monthIdx: today.getMonth(),
  });
  return (
    <div className="flex justify-center gap-5 p-6 py-5">
      {/* Left section [calendar] */}
      <CalendarSection activeDate={activeDate} setActiveDate={setActiveDate} />

      {/* Rigth Section [All info] */}
      <CalendarSummery activeDate={activeDate} setActiveDate={setActiveDate} />
    </div>
  );
};

export default Calendar;
