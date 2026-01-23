import React, { useState } from "react";
import { days, monthNames } from "../../services/calendar";
import {
  CheckSquare,
  IndianRupee,
  LayoutGrid,
  LayoutList,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleLayout } from "../services/function";
import Layout from "../components/shared/Layout";

const CalendarSummery = () => {
  const layout = localStorage.getItem("layout") || "list";
  const text = localStorage.getItem("text") || "expenses";
  const today = new Date();
  const [activeText, setActiveText] = useState(text);
  const [activeLayout, setActiveLayout] = useState(layout);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = today.getDay();
  const [activeDate, setActiveDate] = useState({
    day: days[day],
    date: today.getDate(),
    month: monthNames[month],
    year: year,
  });
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Data
  const diaries = useSelector((state) => state.diary.entry) || [];
  const notes = useSelector((state) => state.notes.notes) || [];
  const todo = useSelector((state) => state.todo.todo) || [];
  const expenses = useSelector((state) => state.expenses.expenses) || [];

  const dispatch = useDispatch();
  // dispatch();

  const [progress, setProgress] = useState(0);
  const [spend, setSpend] = useState([]);
  const [data, setData] = useState(expenses);

  const formatNum = (n) => {
    return n > 9 ? n : "0" + n;
  };
  // function normalizeDate(dateStr) {
  //   const [dd, mm, yyyy] = dateStr.split("/");
  //   return `${dd}/${mm}/${yyyy}`;
  // }
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    const d = new Date(year, month - 1, day);
    return `${formatNum(d.getDate())}/${formatNum(
      d.getMonth() + 1,
    )}/${d.getFullYear()}`;
  };

  // const setDataByDate = (dt, data) => {
  //   const formatted = formatDate(dt);
  //   return data.filter((item) => item.createdAt === formatted);
  // };

  const setDataByDate = (dt, data) => {
    const d = new Date(year, month - 1, day);

    return data.filter(
      (item) =>
        item.createdAt.date === d.getDate() &&
        item.createdAt.month === d.getMonth() &&
        item.createdAt.year === d.getFullYear(),
    );
  };

  function isFind(date, data) {
    return data.some(
      (item) =>
        date.date === item.createdAt.date &&
        date.month === item.createdAt.month &&
        date.year === item.createdAt.year,
    );
  }

  function isExpenses(date, month, year) {
    return isFind({ date, month, year }, expenses);
  }

  function isHabit(date, month, year) {
    return isFind({ date, month, year }, todo);
  }

  function isNotes(date, month, year) {
    return isFind({ date, month, year }, notes);
  }

  function isJournal(date, month, year) {
    return isFind({ date, month, year }, diaries);
  }

  const findAt = (mn) => monthNames.indexOf(mn) + 1;

  const findCompleted = (db) => {
    return db.filter((item) => item.isDone == true);
  };

  const handleProgress = (dt) => {
    const prdb = setDataByDate(dt, todo) || [];
    const compl = findCompleted(prdb) || 0;
    const newProgress =
      prdb.length === 0 ? 0 : Math.round((compl.length / prdb.length) * 100);
    setProgress(newProgress);
  };

  useEffect(() => {
    const dt = `${activeDate.date}/${findAt(activeDate.month)}/${
      activeDate.year
    }`;

    let temp = [];
    if (activeText === "notes") temp = setDataByDate(dt, notes);
    else if (activeText === "diary") temp = setDataByDate(dt, diaries);
    else if (activeText === "expenses") {
      temp = setDataByDate(dt, expenses) || [];
      setSpend(temp);
    }
    handleProgress(dt);
    setData(temp);
  }, [activeDate, activeText]);

  function handleText(txt) {
    localStorage.setItem("text", txt);
    setActiveText(txt);
    if (txt === "notes") {
      const dt = `${activeDate.date}/${findAt(activeDate.month)}/${
        activeDate.year
      }`;
      const temp = setDataByDate(dt, notes);
      setData(temp);
    } else if (txt === "diary") {
      const dt = `${activeDate.date}/${findAt(activeDate.month)}/${
        activeDate.year
      }`;
      const temp = setDataByDate(dt, diaries);
      setData(temp);
    } else if (txt === "expenses") {
      const dt = `${activeDate.date}/${findAt(activeDate.month)}/${
        activeDate.year
      }`;
      const temp = setDataByDate(dt, expenses);
      setData(temp);
    }
  }

  console.log(notes);

  return (
    <div className="right w-2xl h-[calc(100vh-7rem)] rounded-3xl bg-white p-4 flex flex-col justify-center">
      <h2 className="w-full p-5 px-6 text-xl font-medium rounded-t-3xl">
        {`${activeDate.day.slice(0, 3)}, ${activeDate.date}, ${
          activeDate.month
        } ${activeDate.year}`}
      </h2>

      {/* Top */}
      <div className="top h-40 w-full p-4 px-0 flex justify-center gap-5">
        <div className="group left w-1/2 h-full rounded-3xl bg-gray-100 flex flex-col justify-center cursor-pointer">
          <h2 className="w-full text-green-400 pl-5  text-center text-ld font-semibold flex gap-1.5">
            <IndianRupee size={35} className="p-1.5 bg-green-200 rounded-xl " />
            <p className="self-center text-md">Total Spend</p>
          </h2>
          <div className="w-full flex items-center pl-12 text-lg h-8 group-hover:text-green-500 transition-all duration-300">
            ₹&nbsp;<p>{spend.reduce((sum, item) => sum + item.amount, 0)}</p>
          </div>
        </div>
        <div className="right w-1/2 h-full rounded-3xl bg-gray-100 flex flex-col justify-center group cursor-pointer">
          <h2 className="w-full text-purple-600 pl-5  text-center text-ld font-semibold flex gap-1.5">
            <CheckSquare
              size={35}
              className="p-1.5 bg-purple-200 rounded-xl "
            />
            <p className="self-center">Habit Score</p>
          </h2>

          <div className="w-full  flex h-8 items-center gap-2 group-hover:text-purple-600 pl-6 transition-all duration-300">
            <span>{progress}%</span>
            <div className="w-[70%] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-2.5"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bottom h-[60%] flex-1 flex flex-col justify-start  bg-gray-200 rounded-2xl items-center px-0 p-5 pb-0">
        {/* Bottom Top */}
        <div className="top w-full h-[12.5%] flex gap-2 justify-between  items-center mb-2 px-5">
          <div className="left flex w-[80%] h-full p-1 gap-2 px-5">
            <p
              onClick={() => handleText("expenses")}
              className={`${
                activeText === "expenses" ? "bg-black text-white" : ""
              } w-1/2 rounded-md flex justify-center items-center cursor-pointer`}
            >
              Expenses
            </p>
            <p
              onClick={() => handleText("tasks")}
              className={`${
                activeText === "tasks" ? "bg-black text-white" : ""
              } w-1/2 rounded-md flex justify-center items-center cursor-pointer`}
            >
              Tasks
            </p>
            <p
              onClick={() => handleText("notes")}
              className={`${
                activeText === "notes" ? "bg-black text-white" : ""
              } w-1/2 rounded-md  flex justify-center items-center cursor-pointer`}
            >
              Notes
            </p>
            <p
              onClick={() => handleText("diary")}
              className={`${
                activeText === "diary" ? "bg-black text-white" : ""
              } w-1/2 rounded-md flex justify-center items-center cursor-pointer`}
            >
              Journal
            </p>
          </div>
          <button>
            <Plus size={20} />
          </button>
          <div className="h-10/12 w-[16%] bg-[#f1f1f1]">
            <Layout
              activeLayout={activeLayout}
              setActiveLayout={setActiveLayout}
              handleLayout={handleLayout}
            />
          </div>
        </div>

        {/* Bottom Bottom */}
        <div className="h-[90%] max-h-[90%] w-full">
          {activeLayout === "list" ? (
            // List
            <CalendarList data={data} />
          ) : (
            // Grid
            <CalendarGrid data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSummery;
