import React from "react";
import { Trash2 } from "lucide-react";

const NoteGriditem = ({ data, setIsNote, setViewNote }) => {
  const handleNoteView = (note) => {
    setViewNote(note);
    setIsNote(true);
  };

  return (
    <div
      className="bg-white h-40 w-full rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
      onDoubleClick={() => handleNoteView(data)}
    >
      {/* Item Heading */}
      <div className="w-full bg-gray-200 px-5 py-2 pt-2 flex justify-between items-center">
        <h2 className="text-gray-900 text-lg font-medium flex-1">
          {data.title}
        </h2>
        <button
          className="cursor-pointer"
          onClick={() => console.log(data._id)}
        >
          <Trash2
            size={20}
            className="opacity-0 group-hover:opacity-80 text-red-500 hover:opacity-100 transition-all duration-300 ease-in-out active:scale-95"
          />
        </button>
      </div>
      {/* Item content */}
      <p className="px-6 text-sm font-light leading-4 mt-4">{data.content}</p>
    </div>
  );
};

export default NoteGriditem;
