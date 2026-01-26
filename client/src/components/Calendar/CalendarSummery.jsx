import {
  CheckSquare,
  IndianRupee,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../shared/Layout";
import CalendarList from "./CalendarList";
import CalendarGrid from "./CalendarGrid";
// import { monthNames } from "../../services/calendar";
import { useSelector } from "react-redux";

const CalendarSummery = ({ activeDate }) => {
  const [spend, setSpend] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeText, setActiveText] = useState(
    localStorage.getItem("text") || "expenses",
  );
  const [data, setData] = useState([]);
  const [activeLayout, setActiveLayout] = useState("list");
  const [isForm, setIsForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [error, setError] = useState(false);
  const [loadingTip, setLoadingTip] = useState(false);

  // Data
  const todo = useSelector((state) => state.todo.todo);
  const expenses = useSelector((state) => state.expenses.expenses);
  const notes = useSelector((state) => state.notes.notes);
  const diaries = useSelector((state) => state.diary.entry);
  // const findAt = (mn) => monthNames.indexOf(mn) + 1;

  const setDataByDate = (date, data) => {
    let filterDb = [];

    data.filter((item) => {
      const dt = item.createdAt;
      if (
        dt.date === date.date &&
        dt.month === date.monthIdx &&
        dt.year === date.year
      ) {
        filterDb.push(item);
      }
    });

    return filterDb;
  };

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
    let source = [];

    switch (activeText) {
      case "tasks":
        source = todo;
        break;
      case "expenses":
        source = expenses;
        break;
      case "notes":
        source = notes;
        break;
      case "diary":
        source = diaries;
        break;
      default:
        source = [];
    }
    handleProgress(activeDate);
    setSpend(setDataByDate(activeDate, expenses));
    setData(setDataByDate(activeDate, source));
  }, [activeText, activeDate]);

  const handleLayout = (layout, setLayout) => {
    localStorage.setItem("layout", layout);
    setLayout(layout);
  };

  const handleText = (text) => {
    setActiveText(text);
    localStorage.setItem("text", text);
  };

  // Manage form
  const handleCalendarForm = () => {
    switch (activeText) {
      case "tasks":
        console.log("task added");
        console.log("Title", formTitle);
        console.log("content", formDesc);
        break;
      case "expenses":
        console.log("Title", formTitle);
        console.log("content", formDesc);
        console.log("amount", formAmount);
        break;
      case "notes":
        console.log("Title", formTitle);
        console.log("content", formDesc);
        break;
      case "diary":
        console.log("Title", formTitle);
        console.log("content", formDesc);
        break;
      default:
        console.log("something went wrong");
        break;
    }

    setFormTitle("");
    setFormDesc("");
    setFormAmount("");
  };

  const handleAnalyze = () => setLoadingTip((prev) => !prev);

  return (
    <div className="right w-2xl h-[calc(100vh-7rem)] rounded-3xl bg-white p-4 flex flex-col justify-center">
      <div className="w-full h-fit flex justify-between items-center">
        <h2 className="w-full p-5 px-6 text-xl font-medium rounded-t-3xl">
          {`${activeDate.day.slice(0, 3)}, ${activeDate.date} ${
            activeDate.month
          } ${activeDate.year}`}
        </h2>
        <p>
          {loadingTip ? (
            <Loader2
              size={30}
              className="text-[#7E22CE] cursor-progress animate-spin p-1.5"
            />
          ) : (
            <Sparkles
              size={30}
              onClick={handleAnalyze}
              className="text-[#7E22CE] cursor-pointer hover:bg-[#7875753d] p-1.5 rounded-full transition"
            />
          )}{" "}
        </p>
      </div>

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
        <div className="top w-full h-[15%] flex gap-2 justify-between  items-center mb-2 px-5">
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
          <button
            onClick={() => setIsForm((prev) => !prev)}
            className="active:scale-95 hover:bg-gray-100 ease-in-out p-1.5 rounded-full cursor-pointer text-gray-900 font-bold "
          >
            {isForm ? <X size={20} /> : <Plus size={20} />}
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
        <div className="h-[85%] max-h-[85%] w-full flex flex-col">
          {isForm && (
            <div className="calendar-form w-full h-fit px-4 py-2 flex justify-center items-center flex-col gap-2">
              <div className="w-full h-fit flex">
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  type="text"
                  placeholder="Title"
                  className="w-full bg-white px-2 py-1.5 pl-3 outline-none border-none placeholder:text-gray-400 flex-1"
                />
                {activeText == "expenses" ? (
                  <input
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    type="number"
                    placeholder="Amount"
                    className="bg-white pl-4 px-2 placeholder:text-gray-400 ml-2 outline-none border-none"
                  />
                ) : (
                  ""
                )}
              </div>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                type="text"
                placeholder="Description"
                className="w-full bg-white px-2 py-1.5 pl-3 
                        outline-none border-none placeholder:text-gray-400
                        h-20 resize-none"
              ></textarea>
              {error && (
                <p className="w-full text-red-500 pl-4 text-sm">
                  Title and description are required.
                </p>
              )}
              <button
                onClick={() => {
                  if (
                    !formTitle.trim() ||
                    !formDesc.trim() ||
                    (activeText === "expenses" &&
                      (formAmount === null ||
                        formAmount === undefined ||
                        formAmount <= 0))
                  ) {
                    setError(true);
                    return;
                  }
                  setError(false);
                  handleCalendarForm();
                }}
                className="w-full bg-indigo-600 
                      text-white py-1.5 
                      cursor-pointer 
                      active:bg-indigo-700 transition-all duration-200
                      rounded
                      
                      "
              >
                Add
              </button>
            </div>
          )}

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
