import React, { useState, useRef } from "react";
import {
  Book,
  Save,
  Edit,
  Plus,
  X,
  User as UserIcon,
  Trash2,
  Search,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useDispatch, useSelector } from "react-redux";
import {
  // addJournal,
  // editJournal,
  // setSkip,
  // deleteJournal,
  setActiveDiary,
} from "../../redux/features/diary/diarySlice";

const RightDiary = () => {
  // Edit diary

  const { entry, skip, error, searchDiary, limit, activeDiary } = useSelector(
    (store) => store.diary,
  );
  const diaries = entry;
  const dispatch = useDispatch();

  const [isDiaryActive, setIsDiaryActive] = useState(false);

  const ref = useRef();
  const listRef = useRef();
  const contentRef = useRef();

  console.log(activeDiary);

  useGSAP(
    () => {
      const tl3 = gsap.timeline();
      tl3
        .from(".left", { x: -400, delay: 0.7, autoAlpha: 0 })
        .from(".right", { x: 800, autoAlpha: 0 }, ">")
        .from(".left .header", { y: -300, autoAlpha: 0 })
        .from(
          ".head-item",
          { y: 250, scale: 0, autoAlpha: 0, stagger: 0.15 },
          "-=0.7",
        );
    },
    { scope: ref },
  );

  // dispatch(addJournal());

  function addDiary({}) {
    setIsDiaryActive(false);
  }

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="right note-box bg-white h-full flex-1 rounded-2xl overflow-hidden flex flex-col shadow">
      {isDiaryActive ? (
        <>
          <div className="pr-8 w-full px-2 pl-6 py-3 flex gap-2 border-b border-gray-800 bg-[#e1e4e7] right-form items-center">
            <input
              className="text-2xl placeholder:text-gray-400 flex-1 outline-none border-none note-input font-semibold"
              value={activeDiary?.title}
              onChange={(e) =>
                setIsDiaryActive({ ...activeDiary, title: e.target.value })
              }
              placeholder="Title"
            />
            <button className="bg-[#ca5fe725] text-[#9565e7] px-2 h-fit py-2 mr-4 rounded-full cursor-pointer">
              {isLoading ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                  onClick={() => setIsLoading((prev) => !prev)}
                />
              ) : (
                <Sparkles
                  size={15}
                  onClick={() => setIsLoading((prev) => !prev)}
                />
              )}
            </button>
            <button
              className="
                bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-95 rounded-lg
                  transition-all duration-300 px-4 py-2 mr-2
                  flex gap-2 font-medium text-white"
            >
              Save
              <Save size={20} />
            </button>{" "}
          </div>

          <div className="bottom flex-1">
            <textarea
              value={activeDiary?.content}
              onChange={(e) =>
                setActiveDiary({ ...activeDiary, content: e.target.value })
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
          <Book size={40} color="gray" className="mb-1" />
          <p className="text-gray-500">Select or create an note</p>
        </div>
      )}
    </div>
  );
};

export default RightDiary;
