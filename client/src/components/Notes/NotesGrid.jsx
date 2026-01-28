import React, { useState } from "react";
import NoteGriditem from "./NoteGriditem";
import { X } from "lucide-react";

const NotesGrid = ({ data }) => {
  const [isNote, setIsNote] = useState(false);
  const [viewNote, setViewNote] = useState({});

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full overflow-y-auto px-4 py-4 no-scrollbar">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {data.map((item, i) => (
          <NoteGriditem
            data={item}
            key={i}
            setViewNote={setViewNote}
            setIsNote={setIsNote}
          />
        ))}
      </div>
      {isNote && (
        <div className="w-full h-full bg-gray-100 z-10 p-12 fixed top-0 left-0">
          <div className="bg-gray-100 w-full h-full flex flex-col">
            <div className="flex ">
              <h2 className="flex flex-wrap text-2xl font-semibold bg--300 py-2 flex-1">
                {viewNote?.title}
              </h2>
              <X
                size={40}
                onClick={() => {
                  setIsNote(false);
                  setViewNote({});
                }}
                className="mr-4 p-2 cursor-pointer active:scale-90 transition-all duration-300 ease-in-out"
              />
            </div>
            <div className="px-1.5 py-2 flex-1 bg--300 overflow-y-auto no-scrollbar text-lg leading-5">
              {viewNote?.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesGrid;
