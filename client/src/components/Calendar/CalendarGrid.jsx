import { NotepadTextDashed, Trash2 } from "lucide-react";
const CalendarGrid = ({ data }) => {
  function printText(text, idx) {
    return text.slice(0, idx);
  }

  return (
    <div className="grid grid-cols-3 w-full h-full overflow-y-auto no-scrollbar p-3 py-0">
      {data.map((item, i) => {
        return (
          <div
            className="relative h-28 w-48 bg-white m-3 rounded-2xl cursor-pointer flex flex-col justify-center px-4 group"
            key={i}
          >
            <Trash2
              size={20}
              className="absolute top-4 right-3 text-red-500 active:scale-90 opacity-0 group-hover:opacity-100 transition-all duration-300"
            />
            <div className="flex w-full justify-between">
              <div className="flex-1">
                {typeof item.isDone === "boolean" && (
                  <input
                    type="checkbox"
                    className="
                            -ml-1
                            h-5 w-5 rounded-full
                            cursor-pointer
                            appearance-none
                        bg-gray-300
                        checked:bg-indigo-600
                            transition-all
                            duration-100
                            checked:scale-110
                            focus:ring-0
                        "
                    checked={item.isDone}
                    onChange={() => console.log(item._id)}
                  />
                )}
                <h2 className="text-md font-medium">
                  {printText(item.title, 17)}
                  {item.title.length > 17 ? "..." : ""}
                </h2>
                <p className="text-gray-400 text-xs pl-1 w-[80%]">
                  {printText(item.content, 15)}
                  {item.content.length > 15 ? "..." : ""}
                </p>
              </div>

              <div className="text-gray-600 self-center">
                {item.amount && `-${item.amount}`}
              </div>
            </div>
          </div>
        );
      })}
      {(!data || data.length === 0) && (
        <div className="col-span-3 flex justify-center items-center h-full text-gray-400 gap-2">
          <NotepadTextDashed size={20} />
          <span>Empty</span>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
