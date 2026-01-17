import { SearchIcon, XCircle } from "lucide-react";
import React from "react";

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="flex relative flex-1 h-full rounded bg-gray-100 items-center border border-gray-800">
      {/* Search Icon */}
      <SearchIcon size={30} className="p-1.5 rounded-l-md text-gray-950 ml-2" />
      {/* Search Input */}
      <input
        placeholder="Search"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="bg-gray-100 text-gray-950 outline-none border-none pl-2 h-full flex-1 rounded-r-md pr-6"
      />
      {/* Search input clear button */}
      {searchText != "" ? (
        <XCircle
          size={16}
          onClick={() => setSearchText("")}
          className="absolute right-2 top-1/5 cursor-pointer"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SearchBar;
