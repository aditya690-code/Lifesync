import React, { useEffect, useRef, useState } from "react";
import { Search, Plus, X, Trash2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useDispatch, useSelector } from "react-redux";
import { setActiveDiary } from "../../redux/features/diary/diarySlice";

const LeftDiary = () => {
  const [isSearch, SetIsSearch] = useState(false);
  const [diaries, setDiaries] = useState([]);
  const [searchValue, setSearchValue] = useState("");

    const dispatch = useDispatch();
  const { entry, hashMore } = useSelector(
    // , skip, isLoading, error, searchDiary, limit
    (store) => store.diary
  );
  const ref = useRef();
  const listRef = useRef();

  useEffect(() => {
    setDiaries(entry);
  }, []);

  useEffect(() => {
    setDiaries(entry);
  }, [isSearch]);

  // Entries print in sidebar
  function printContent(str) {
    if (str.length > 18) {
      return str.substring(0, 20) + "...";
    }
    return str;
  }

  console.log(setActiveDiary)

  // Toggle Search bar
  function toggleSearchBar() {
    if (isSearch === false) {
      SetIsSearch(true);
    } else {
      SetIsSearch(false);
      setSearchValue("");
    }
  }

  // // Search Diary Entries function
  function searchEntries(inp) {
    let diary = [];
    entry.forEach((e) => {
      if (e.date.includes(inp)) {
        diary.unshift(e);
      }
      if (
        e.title.toLowerCase().includes(inp.toLowerCase()) ||
        e.content.toLowerCase().includes(inp.toLowerCase())
      ) {
        diary.unshift(e);
      }
    });
    setDiaries(diary);
  }

  // // Delete diary
  // function deleteDiary() {
  // }

  // Animation
  useGSAP(
    () => {
      gsap.to(listRef.current.children, {
        delay: 1.5,
        scale: 1,
        autoAlpha: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope: ref, dependencies: [diaries] }
  );

  return (
    <div className="left w-[18vw] rounded-2xl flex flex-col overflow-hidden bg-white shadow-lg shadow-white-500/50">
      {/* TOP BAR */}
      <div className="header info flex justify-around items-center py-4 border-b rounded-t-2xl relative">
        <div
          className={
            isSearch === false
              ? "hidden absolute z-10 bg-white px-4 flex gap-0 pt-5 pb-0"
              : "absolute z-10 bg-white px-4 flex gap-0 pt-5 pb-0"
          }
        >
          <span
            onClick={() => toggleSearchBar()}
            className="head-item cross absolute right-2 top-0.5 text-black cursor-pointer"
          >
            <X size={15} />
          </span>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            type="text"
            className="head-item outline-0 border border-r-0 rounded-sm rounded-r-none pl-2.5"
            placeholder="Search "
          />
          <button
            onClick={() => {
              searchEntries(searchValue);
            }}
            className="head-item p-[0.8vh] rounded-sm rounded-l-none cursor-pointer border border-l-0"
          >
            <Search size={20} />
          </button>
        </div>
        <h3
          className="head-item text-2xl font-semibold cursor-pointer"
          onClick={() => {
            dispatch(setActiveDiary({}));
          }}
        >
          Entries
        </h3>
        <div className="flex gap-2.5">
          <button
            onClick={() => toggleSearchBar()}
            className="
                                head-item
                                p-[1.5vh] 
                                bg-blue-100 
                                text-indigo-600 
                                rounded-lg 
                                cursor-pointer 
                                active:text-indigo-500 
                                active:scale-[0.9]"
          >
            <Search size={20} />
          </button>
          <button
            className="
                                head-item
                                p-[1.5vh] 
                                bg-blue-100 
                                text-indigo-600 
                                rounded-lg 
                                cursor-pointer 
                                active:text-indigo-500 
                                active:scale-[0.9]"
            onClick={() => {
              // setActiveDiary({ title: "", content: "" })
              // setIsDiaryActive(true);
            }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div
        ref={listRef}
        className="list content flex-1 overflow-y-scroll p-2 no-scrollbar px-4"
      >
        {diaries.length > 0 ? (
          diaries.map((e, i) => (
            <div
              key={i}
              className="item w-full py-4 cursor-pointer 
                                transition-all duration-300 ease-in-out
                                hover:shadow-md hover:translate-x-1 
                                rounded-2xl pl-4 leading-relaxe relative
                                opacity-0 scale-0
                                "
            >
              <span
                onClick={() => {
                  dispatch(setActiveDiary(e));
                }}
              >
                <h3 className="font-semibold">{printContent(e.title)}</h3>
                <p className="text-sm">{e.date}</p>
                <p className="text-sm">{printContent(e.content)}</p>
              </span>
              <button
                className="
                                    hover:text-red-500
                                    cursor-pointer 
                                    p-3 z-25
                                    absolute right-0 top-8"
                // onClick={() => deleteDiary(i)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-slate-200 flex items-center h-full">
            Empty journal.
          </div>
        )}
        {hashMore && (
          <div className="w-full flex justify-center mt-4">
            <button
              //onClick={} //setSkip((prev) => prev + limit)
              className="
                                py-2 
                                px-6 
                                bg-indigo-600 
                                text-white 
                                rounded-lg 
                                hover:bg-indigo-500 
                                transition-colors 
                                duration-200
                                cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftDiary;
