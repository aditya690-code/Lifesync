import axios from "axios";

const API_URL = "http://localhost:5000/home";

export const getNotes = async () => {
  const userId = sessionStorage.getItem("userId") || "698470df1c1244dd905ebe7c"; // ✅ read

  if (!userId) throw new Error("User not logged in");

  const res = await axios.get(`${API_URL}/notes/${userId}`, {
    withCredentials: true,
  });

  return res.data;
};

export const deleteNote = async (noteId) => {
  const userId = sessionStorage.getItem("userId") || "698470df1c1244dd905ebe7c"; // ✅ read

  if (!userId) throw new Error("User not logged in");

  await axios.delete(`${API_URL}/note/${userId}/${noteId}`, {
    withCredentials: true,
  });
};

export const updateNote = async (noteId, updatedNote) => {
  const userId = sessionStorage.getItem("userId") || "698470df1c1244dd905ebe7c"; // ✅ read

  if (!userId) throw new Error("User not logged in");

  const res = await axios.put(
    `${API_URL}/note/${userId}/${noteId}`,
    updatedNote,
    { withCredentials: true },
  );

  return res.data;
};

export const createNote = async (note) => {
  const userId = sessionStorage.getItem("userId") || "698470df1c1244dd905ebe7c"; // ✅ read

  if (!userId) throw new Error("User not logged in");

  const res = await axios.post(
    `${API_URL}/note/${userId}`, // ✅ URL me bheja
    note,
    { withCredentials: true },
  );

  return res.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  sessionStorage.removeItem("userId"); // ✅ remove
};
