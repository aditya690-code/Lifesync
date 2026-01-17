import React, { useState } from "react";
import { SaveIcon, X } from "lucide-react";

const NotesForm = ({ form, setForm, addNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date(),
    };

    addNote(newNote);

    // reset
    setTitle("");
    setContent("");
    setError("");
    setForm(false);
  };

  if (!form) return null;
  const handleChange = (e) => {
    setContent(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="w-[97%] mx-auto mt-6 rounded-xl bg-white shadow-sm shadow-gray-100 py-4 pt-0">
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 w-full px-8">
        <button
          onClick={handleAdd}
          className="px-6 py-2 rounded-lg cursor-pointer my-2
          text-white bg-indigo-600 
            transition-all duration-300 active:scale-95 
            flex items-center gap-3"
        >
          Save
          <SaveIcon size={20} />
          
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 pl-6 text-lg py-1 outline-none border-none placeholder:text-gray-300 font-medium"
      />

      {/* Content */}
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={handleChange}
        className="w-full px-3 max-h-110 pl-6 text-sm placeholder:text-gray-300 placeholder:text-sm
              overflow-y-auto py-2 border-none resize-none outline-none no-scrollbar overflow-hidden
              "
      />
      {/* Error */}
        {error && <p className="text-sm text-red-500 w-full pl-12">{error}</p>}
    </div>
  );
};

export default NotesForm;
