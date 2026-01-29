import { Calendar, Trash2 } from "lucide-react";
import { printSubString } from "../../services/function";

const NoteListitem = ({ data, setAnyNote, setActiveNote }) => {
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
    "
    >
      <div
        className="flex-1 flex flex-col justify-center h-16"
        onClick={() => {
          setAnyNote(true);
          setActiveNote(data);
        }}
      >
        <h2 className="font-medium py-0.5">{printSubString(data.title, 20)}</h2>

        <p className="text-xs pl-1 text-gray-500">
          {printSubString(data.content, 25)}
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
