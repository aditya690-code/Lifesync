import React, { useState } from "react";

const Security = () => {
  const [enabled, setEnabled] = useState(false);
  const [savedPass, setSavedPass] = useState(null);

  const [current, setCurrent] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const clear = () => {
    setCurrent("");
    setPass("");
    setConfirm("");
  };

  const enableLock = () => {
    if (pass.length < 4) return alert("Passcode must be 4+ digits");
    if (pass !== confirm) return alert("Passcodes do not match");
    setSavedPass(pass);
    setEnabled(true);
    clear();
  };

  const changePass = () => {
    if (current !== savedPass) return alert("Wrong current passcode");
    if (pass.length < 4) return alert("Passcode must be 4+ digits");
    if (pass !== confirm) return alert("Passcodes do not match");
    setSavedPass(pass);
    clear();
  };

  const resetLock = () => {
    if (current !== savedPass) return alert("Wrong passcode");
    setSavedPass(null);
    setEnabled(false);
    clear();
  };

  return (
    <div className="w-full min-h-screen bg-zinc-100 p-4">
      <div className="max-w-md mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Security</h1>
          <p className="text-sm text-zinc-500">
            Protect your app with an extra layer of security
          </p>
        </div>

        {/* App Lock Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">App Lock</p>
              <p className="text-sm text-zinc-500">
                Require passcode to open the app
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full relative transition ${
                enabled ? "bg-black" : "bg-zinc-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  enabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Enable Lock */}
          {enabled && !savedPass && (
            <div className="space-y-3 pt-4 border-t">
              <input
                type="password"
                placeholder="Create passcode"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="password"
                placeholder="Confirm passcode"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={enableLock}
                className="w-full py-3 rounded-xl bg-black text-white font-medium"
              >
                Enable App Lock
              </button>
            </div>
          )}
        </div>

        {/* Manage Passcode */}
        {savedPass && (
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <p className="font-medium">Manage Passcode</p>

            <input
              type="password"
              placeholder="Current passcode"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              placeholder="New passcode"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              placeholder="Confirm new passcode"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={changePass}
              className="w-full py-3 rounded-xl bg-zinc-900 text-white"
            >
              Change Passcode
            </button>

            <button
              onClick={resetLock}
              className="w-full py-3 rounded-xl border border-red-500 text-red-500"
            >
              Disable App Lock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;