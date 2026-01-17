import React, { useState } from "react";
import { X } from "lucide-react";

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
    <div className="w-[97%] mx-auto mt-6 px-6 rounded-xl bg-white shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-end w-full bg-amber-200">
        {/* <h2 className="text-lg font-semibold text-gray-800">New Note</h2> */}
        <button
          onClick={() => setForm(false)}
          className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
        >
          <X size={25} />
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 outline-none border-none text-xl bg-sky-400"
      />

      {/* Content */}
      {/* <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        
        className="w-full px-3 py-2 border-none resize-none outline-none h-fit bg-amber-200 no-scrollbar"
      /> */}
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={handleChange}
        className="w-full px-3 max-h-110 overflow-y-auto py-2 border-none resize-none outline-none bg-amber-200 no-scrollbar overflow-hidden"
      />
      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setForm(false)}
          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NotesForm;
