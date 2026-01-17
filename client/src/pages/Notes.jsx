import React, { useState } from "react";
import NotesUpper from "../components/Notes/NotesUpper";
import NotesForm from "../components/Notes/NotesForm";
import NotesList from "../components/Notes/NotesList";
import NotesGrid from "../components/Notes/NotesGrid";
import { useSelector } from "react-redux"; //useDispatch

const Notes = () => {
  const layoutStr = localStorage.getItem("layout") || "list";
  const [form, setForm] = useState(false);
  const [layout, setLayout] = useState(layoutStr);

  const notes = useSelector((state) => state.notes.notes);
  return (
    <div className="no-scrollbar">
      <NotesUpper setForm={setForm} layout={layout} setLayout={setLayout} />
      <NotesForm form={form} setForm={setForm} />
      {layout === "list" ? (
        <NotesList notes={notes} />
      ) : (
        <NotesGrid data={notes} />
      )}
    </div>
  );
};

export default Notes;
