import NoteListitem from "./NoteListitem";
import { Loader2, Save, Sparkles, StickyNoteIcon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import AiCall from "../../api/Gemini";

const NotesList = ({
  data,
  activeNote,
  setActiveNote,
  anyNote,
  setAnyNote,
}) => {
  const notelistRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".list-box", { x: -400, duration: 0.5, autoAlpha: 0 }, "+=2.2");
    tl.from(".note-box", { x: 500, duration: 0.5, autoAlpha: 0 }, ">");
    tl.from(".list-box h2", { y: 30, duration: 0.4, autoAlpha: 0 });
    if (notelistRef.current) {
      tl.fromTo(
        ".note-item",
        {
          y: 50,
          scale: 1.2,
          autoAlpha: 0,
        },
        { y: 0, scale: 1, duration: 0.2, stagger: 0.14, autoAlpha: 1 },
      );
    }
  });

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".note-input",
      {
        y: 300,
        autoAlpha: 0,
        opacity: 0,
      },
      { y: 0, autoAlpha: 1, opacity: 1, stagger: 0.14, duration: 0.4 },
    );
  }, [anyNote]);

  const handleNoteSummery = async () => {
    if (!activeNote || !activeNote.title.trim() || !activeNote.content.trim())
      return;

    setIsLoading(true);

    const prompt = `


TASK:
Summarize the notes provided below.



Note : ${activeNote}
`;

    const response = await AiCall(prompt);
    console.log(response);

    setIsLoading(false);
  };

  return (
    <div
      className="h-[calc(100vh-8rem)] w-full
                    overflow-hidden py-1
                    flex justify-between gap-7 items-center px-8"
    >
      {/* Left Side of note [Notes List] */}
      <div className="left list-box h-full w-1/5 flex flex-col justify-between rounded-2xl overflow-hidden shadow-lg ">
        {/* Left Side Nav */}
        <h2
          onClick={() => {
            setActiveNote({});
            setAnyNote(false);
          }}
          className="bg- px-6 py-3.5 font-bold text-2xl cursor-pointer border-b border-gray-800 bg-[#e1e4e7]"
        >
          Notes
        </h2>
        {/* List of Notes */}
        <div className="flex-1 px-2 pb-2 bg-white overflow-y-auto no-scrollbar">
          {data.map((item) => (
            <NoteListitem
              key={item._id}
              data={item}
              setAnyNote={setAnyNote}
              setActiveNote={setActiveNote}
              ref={notelistRef}
            />
          ))}
        </div>
      </div>

      {/* Right Side Of Note [View & form]*/}
      <div className="right note-box bg-white h-full flex-1 rounded-2xl overflow-hidden flex flex-col shadow">
        {anyNote ? (
          <>
            <div className="w-full px-2 pl-6 py-3 flex gap-2 border-b border-gray-800 right-form items-center bg-[#e1e4e7] pr-12">
              <input
                className="text-2xl placeholder:text-gray-400 flex-1 outline-none border-none note-input font-semibold"
                value={activeNote?.title}
                onChange={(e) =>
                  setActiveNote({ ...activeNote, title: e.target.value })
                }
                placeholder="Title"
              />
              <button className="bg-[#ca5fe725] text-[#9565e7] px-2 h-fit py-2 rounded-full cursor-pointer">
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Sparkles size={15} onClick={() => handleNoteSummery()} />
                )}
              </button>
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
                className="bg-white placeholder:text-gray-400 w-full note-input  outline-none border-none h-full resize-none overflow-y-auto px-4 pl-7 py-2"
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
