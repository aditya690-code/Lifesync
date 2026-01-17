import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Book,
  Bot,
  Calendar,
  Github,
  Home,
  Instagram,
  Linkedin,
  ListTodo,
  Moon,
  ShieldX,
  StickyNote,
  Sun,
  UserLock,
  Wallet,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ handleSidebar }) => {
  useGSAP(() => {
    gsap.to(".bb", {
      scale: 120,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      duration: 30,
    });
  });

  return (
    <div className="sidebar fixed top-0 left-0 w-screen h-screen overflow-hidden bg-[#9d9c9c72] z-50">
      <div
        className="h-full w-full bg-[#9d9c9c72] z-45 absolute top-0 left-0 cursor-pointer"
        onClick={()=>handleSidebar()}
      ></div>
      
      <div className="sidebar fixed top-0 left-0  w-1/5 z-50 h-screen overflow-hidden flex flex-col">
        <div className="bb absolute bg-[#ececec] h-full w-full scale-1 -mt-[220%] -ml-[100%] mr-[100%] rounded-full z-1"></div>
        <div className="head w-full p-4 px-6 border-b z-10">
          <h1 className="text-3xl font-semibold">Menu</h1>
        </div>

        <div className="nav-links h-fit flex flex-col justify-start pb-12 z-10">
          <Link to={"/home"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <Home size={18} />
            Home{" "}
          </Link>
          <Link to={"/expenses"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <Wallet size={18} />
            Expenses{" "}
          </Link>
          <Link to={"/routines"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <ListTodo size={18} />
            Tasks{" "}
          </Link>
          <Link to={"/notes"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <StickyNote size={18} />
            Notes{" "}
          </Link>
          <Link to={"/diary"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <Book size={18} />
            Journal{" "}
          </Link>
          <Link to={"/calendar"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <Calendar size={18} />
            Calendar{" "}
          </Link>
          <Link to={"/chatbot"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <Bot size={18} />
            Assistant{" "}
          </Link>
          <Link to={"/security"} className="nav-link" onClick={handleSidebar}>
            {" "}
            <UserLock size={18} />
            Security{" "}
          </Link>
        </div>

        <div className="h-108 relative flex-1 flex flex-col justify-end z-10">
          {/* <div className="w-1/2 mx-auto flex justify-center gap-4 py-2">
            <Moon size={40} className="p-2.5 rounded-full bg-gray-600 text-white cursor-pointer"/>
            <Sun  size={40} className="p-2.5 rounded-full bg-gray-600 text-white cursor-pointer"/>
          </div> */}
          <Link to={'/'}
            className=" pl-12 text-md font-medium text-red-400 active:scale-90 flex gap-1 items-center cursor-pointer bg-none transition-all duration-300"
          >
            <ShieldX size={20} />
            Sign out{" "}
          </Link>

          <div className="w-full mx-auto flex justify-evenly px-4 py-12">
            <Link
              className="cursor-pointer p-1 opacity-45 transition-all duration-300 hover:opacity-100 active:scale-90"
              to={"https://instagram.com/adityayadav_690"}
            >
              <Instagram size={20} />
            </Link>
            <Link
              to={"https://www.linkedin.com/in/aditya-prakash-4771b634b/"}
              className="cursor-pointer p-1 opacity-45 transition-all duration-300 hover:opacity-100 active:scale-90"
            >
              <Linkedin size={20} />
            </Link>

            <Link
              to={"https://github.com/aditya690-code"}
              className="cursor-pointer p-1 opacity-45 transition-all duration-300 hover:opacity-100 active:scale-90"
            >
              <Github size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
