import { NotepadTextDashed, Trash2 } from "lucide-react";

const CalendarList = ({ data }) => {
  function printText(text, idx) {
    return text.slice(0, idx);
  }

  return (
    <div className="bottom w-full flex-1 flex justify-center items-start flex-wrap no-scrollbar overflow-auto pb-0">
      {/* Items */}

      {data.map((item, i) => {
        return (
          <div
            key={i}
            className="cursor-pointer item py-4 w-full bg-gray-200 hover:bg-white flex items-center justify-start px-10 flex-wrap group"
          >
            <div className="flex justify-between items-center flex-wrap flex-1 h-fit">
              <div className="flex-1 flex items-center gap-4">
                {typeof item.isDone === "boolean" && (
                  <input
                    type="checkbox"
                    checked={item.isDone}
                    onChange={() => item.id}
                    className="
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
                  />
                )}
                <div className="calendar-infos flex-1">
                  <h2 className="w-full text-lg">
                    {printText(item.title, 45)}
                    {item.title.length > 45 ? "..." : ""}
                  </h2>
                  <h3 className="w-full flex justify-start items-center gap-2 text-gray-400 pl-1">
                    {/* <span className="text-xs">{item.createdAt}</span> */}
                    <p className="text-xs">
                      {printText(item.content, 45)}
                      {item.content.length > 45 ? "..." : ""}
                    </p>
                  </h3>
                </div>
              </div>
              <div className="pr-6">{item.amount && `-${item.amount}`}</div>
            </div>
            <button
              className="text-red-500 cursor-pointer active:scale-90 p-1 opacity-0 group-hover:opacity-100"
              onClick={() => {
                console.log(item._id);
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      })}
      {data.length == 0 && (
        <div className="flex justify-center items-center h-full w-full text-gray-400 gap-2">
          <NotepadTextDashed size={20} /> Empty
        </div>
      )}
    </div>
  );
};

export default CalendarList;
