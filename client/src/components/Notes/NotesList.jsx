import NoteListitem from "./NoteListitem";
import { EditIcon, Save, StickyNoteIcon, Trash2 } from "lucide-react";

const NotesList = ({
  data,
  activeNote,
  setActiveNote,
  anyNote,
  setAnyNote,
}) => {
  return (
    <div
      className="h-[calc(100vh-8rem)] w-full 
                    overflow-hidden py-1
                    flex justify-between gap-7 items-center px-8"
    >
      {/* Left Side of note [Notes List] */}
      <div className="left h-full w-1/5 flex flex-col justify-between rounded-2xl overflow-hidden shadow-lg ">
        {/* Left Side Nav */}
        <div className="">
          <h2
            onClick={() => {
              setActiveNote({});
              setAnyNote(false);
            }}
            className="bg-white px-6 py-3.5 font-semibold text-2xl cursor-pointer border-b border-gray-800"
          >
            Notes
          </h2>
        </div>
        {/* List of Notes */}
        <div className="flex-1 px-2 pb-2 bg-white overflow-y-auto no-scrollbar">
          {data.map((item) => (
            <NoteListitem
              key={item._id}
              data={item}
              setAnyNote={setAnyNote}
              setActiveNote={setActiveNote}
            />
          ))}
        </div>
      </div>

      {/* Right Side Of Note [View & form]*/}
      <div className="right bg-white h-full flex-1 rounded-2xl overflow-hidden flex flex-col shadow">
        {anyNote ? (
          <>
            <div className="w-full px-2 pl-6 py-3 flex gap-2 border-b border-gray-800">
              <input
                className="text-2xl placeholder:text-gray-400 flex-1 outline-none border-none"
                value={activeNote?.title}
                onChange={(e) =>
                  setActiveNote({ ...activeNote, title: e.target.value })
                }
                placeholder="Title"
              />
              <button
                className="
              bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-95 rounded-lg
              transition-all duration-300 px-3 py-2 mr-2
              flex gap-2 font-medium text-white
            "
              >
                Save
                <Save size={20} />
              </button>{" "}
            </div>

            <div className="bottom flex-1">
              <textarea
                value={activeNote?.content}
                onChange={(e) =>
                  setActiveNote({ ...activeNote, content: e.target.value })
                }
                name=""
                id=""
                placeholder="Content"
                className="bg-white placeholder:text-gray-400 w-full  outline-none border-none h-full resize-none overflow-y-auto px-4 pl-7 py-2"
              ></textarea>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center flex-col h-full w-full">
            <StickyNoteIcon size={40} color="gray" className="mb-1" />
            <p className="text-gray-500">Select or create an note</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
