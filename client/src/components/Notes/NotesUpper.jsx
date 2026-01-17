import {
  LayoutGrid,
  LayoutList,
  Plus,
  SearchIcon,
  X,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { handleLayout } from "../../services/function";
import SearchBar from "../shared/SearchBar";
import Layout from "../shared/Layout";

const NotesUpper = ({ setForm }) => {
  const layoutStr = localStorage.getItem("layout") || "list";
  const [icon, setIcon] = useState(true);
  const [layout, setLayout] = useState(layoutStr);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="w-full flex justify-end h-13">
      {/* Nav left */}
      <div className="left flex items-center justify-evenly w-1/2 h-full gap-4 py-2 pr-12">
        {/* Search */}
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
        {/* Layout button */}
        <div className="w-[16%] h-full">
          <Layout
            activeLayout={layout}
            handleLayout={handleLayout}
            setActiveLayout={setLayout}
          />
        </div>

        {/* Note button */}
        <button
          className="bg-indigo-600 text-white cursor-pointer border border-indigo-600
                      active:opacity-95 active:scale-95 flex px-4 py-1 
                      items-center justify-between gap-1 transition-all duration-300 rounded h-full"
          onClick={() => {
            setIcon((prev) => !prev);
            setForm((prev) => !prev);
          }}
        >
          {icon ? (
            // Plus icon
            <Plus size={20} />
          ) : (
            // Cut icon
            <X size={20} />
          )}
          {/* Text */}
          Note
        </button>
      </div>
    </div>
  );
};

export default NotesUpper;
