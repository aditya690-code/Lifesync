import React, { useState } from "react";

const Security = () => {
  const [enabled, setEnabled] = useState(
    localStorage.getItem("access") || false,
  );
  const [lockForm, setLockForm] = useState(false);
  const [changePassForm, setChangePassForm] = useState(false);

  const [pass, setPass] = useState("");
  const [confirmPass, setConPass] = useState("");

  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confiNewPass, setConfiNewPass] = useState("");

  const handleLock = () => {
    if (enabled) {
      setEnabled(false);
    } else {
      setLockForm(true);
    }
  };

  const handleLockForm = () => {
    if (pass != confirmPass) return;
    localStorage.setItem("pass", pass);
    localStorage.setItem("access", false);
    setPass("");
    setConPass("");
    setLockForm(false);
    setEnabled(true);
  };

  const handleChangeLockForm = () => {
    if (currPass == "" || newPass == "" || confiNewPass == "") return;
    const pass = localStorage.getItem("pass");
    if (pass === currPass && newPass === confiNewPass) {
      localStorage.setItem("pass", newPass);
    }
    setCurrPass("");
    setNewPass("");
    setConfiNewPass("");
    setChangePassForm(false);
  };

  return (
    <div className="w-full h-[calc(100vh-6rem) px-12 py-6 flex flex-col justify-start items-center gap-4">
      <div className="secu-header w-full text-start">
        <h2 className="text-3xl font-bold">Security</h2>
        <p className="text-xs font-medium text-gray-500 pl-1">
          Protect your app with an extra layer of security
        </p>
      </div>

      <div className="w-full flex flex-col gap-0 bg-gray-300  mt-5 rounded-2xl overflow-hidden">
        {/* Lock section */}
        <div className="w-full h-24 bg--600 overflow-hidden py-4 flex justify-between items-center">
          <div className="left-infos py-3 px-5">
            <h2 className="text-2xl font-semibold">App Lock</h2>
            <p className="text-xs pl-1 text-gray-600">
              Require passcode to open the app
            </p>
          </div>
          <div className="flex gap-4  items-end">
            {enabled && (
              <p
                className="text-sm cursor-pointer text-gray-700 opacity-80 hover:opacity-100 transition-all duration-300 ease-in-out active:scale-95"
                onClick={() => setChangePassForm(true)}
              >
                Change Password
              </p>
            )}
            <div className="right-checkbox bg-gray-200 flex gap-0 mr-12 rounded-full">
              <div
                className={`${enabled ? "opacity-0" : "opacity-100"} h-6 w-6 bg-gray-500 rounded-full cursor-pointer`}
                onClick={handleLock}
              ></div>
              <div
                className={`${enabled ? "opacity-100" : "opacity-0"} h-6 w-6 bg-gray-500 rounded-full cursor-pointer`}
                onClick={handleLock}
              ></div>
            </div>
          </div>
        </div>
        {lockForm && (
          <div className="bg-ed-300 w-full flex flex-col gap-2">
            <input
              type="password"
              className="w-full bg--300 px-2 pl-4 py-2 outline-none border-none placeholder:text-gray-500"
              placeholder="Password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
            <input
              type="text"
              className="w-full bg--300 px-2 pl-4 py-2 outline-none border-none placeholder:text-gray-500"
              placeholder="Confirm password"
              value={confirmPass}
              onChange={(e) => {
                setConPass(e.target.value);
              }}
            />
            <button
              className="px-2 py-4 bg-indigo-600 w-full text-white cursor-pointer font-medium"
              onClick={handleLockForm}
            >
              Set Password
            </button>
          </div>
        )}
        {changePassForm && (
          <div>
            <input
              type="password"
              className="w-full bg--300 px-2 pl-4 py-2 outline-none border-none placeholder:text-gray-500"
              placeholder="Current password"
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
            />
            <input
              type="password"
              className="w-full bg--300 px-2 pl-4 py-2 outline-none border-none placeholder:text-gray-500"
              placeholder="New password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <input
              type="text"
              className="w-full bg--300 px-2 pl-4 py-2 outline-none border-none placeholder:text-gray-500"
              placeholder="Confirm new password"
              value={confiNewPass}
              onChange={(e) => setConfiNewPass(e.target.value)}
            />
            <button
              onClick={handleChangeLockForm}
              className="px-2 py-4 bg-indigo-600 w-full text-white cursor-pointer mt-1 font-medium active:opacity-90 transition-all duration-300"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;
