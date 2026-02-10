import "./index.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Navbar/Nav";
import Entry from "./pages/Entry";
import Sidebar from "./pages/Sidebar.jsx";
import Home from "./pages/Home";
import Verification from "./pages/Verification.jsx";
import Diary from "./pages/Diary";
import ToDo from "./pages/ToDo";
import Notes from "./pages/Notes";
import Expenses from "./pages/Expenses";
import Calendar from "./pages/Calendar.jsx";
import Ai from "./pages/Ai.jsx";
import AiPage from "./pages/AiPage.jsx";
import Security from "./pages/Security.jsx";
import gsap from "gsap";
import { expenses, tasks, notes, diaries } from "./services/data";

function App() {
  localStorage.setItem("access", false);
  const [access, setAccess] = useState(localStorage.getItem("access") || false);
  const [sidebar, setSidebar] = useState(false);

  function changeAccess(st) {
    setAccess(st);
    localStorage.setItem("access", false);
  }

  function handleSidebar() {
    setSidebar(!sidebar);
  }

  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
    force3D: true,
  });

  return (
    <div className="no-scrollbar">
      <Nav handleSidebar={handleSidebar} />
      <Routes>
        <Route path="/" element={<Entry />} />

        {!access && (
          <Route path="*" element={<Navigate to="/verify" replace />} />
        )}

        <Route
          path="/verify"
          element={
            access ? (
              <Navigate to="/home" replace />
            ) : (
              <Verification changeAccess={changeAccess} />
            )
          }
        />

        {access && (
          <>
            <Route
              path="/home"
              element={
                <Home
                  expenses={expenses}
                  diaries={diaries}
                  tasks={tasks}
                  notes={notes}
                />
              }
            />
            <Route path="/diary" element={<Diary diaries={diaries} />} />
            <Route path="/routines" element={<ToDo tasks={tasks} />} />
            <Route path="/notes" element={<Notes notes={notes} />} />
            <Route
              path="/expenses"
              element={<Expenses expenses={expenses} />}
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chatbot" element={<AiPage />} />
            <Route path="/security" element={<Security />} />
          </>
        )}
      </Routes>
      {access && (
        <>
          {access && <Ai />}
          {sidebar && <Sidebar handleSidebar={handleSidebar} />}
        </>
      )}
    </div>
  );
}

export default App;
