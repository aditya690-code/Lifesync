import { Calendar, Trash2 } from "lucide-react";
import { printSubString } from "../../services/function";
import Time from "../Common/Time";

const NoteListitem = ({ data, setAnyNote, setActiveNote, ref }) => {
  return (
    <div
      className="flex items-center m-2
      hover:bg-gray-100 bg-white 
      group px-2 py-2 
      hover:rounded-lg 
      cursor-pointer 
      hover:-translate-y-1 
      transition-all duration-300
      active:scale-95
      note-item
    "
      ref={ref}
    >
      <div
        className="flex-1 flex flex-col justify-center h-16"
        onClick={() => {
          setAnyNote(true);
          setActiveNote(data);
        }}
      >
        <h3 className="font-medium py-0.5">{printSubString(data.title, 20)}</h3>

        <p className="text-xs pl-1 text-gray-500 flex gap-1">
          <span className="text-gray-400">
            <Time size={11} time={data.createdAt} />
          </span>
          {printSubString(data.content, 12)} {/* 25 */}
        </p>
      </div>
      <button
        className="
            p-1.5 h-fit w-fit 
            text-red-400 cursor-pointer 
            active:scale-90 transition-all duration-300 
            opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default NoteListitem;
