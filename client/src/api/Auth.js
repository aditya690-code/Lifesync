// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/auth",
//   withCredentials: true, // 🔥 cookie automatically send hogi
// });

// // Register
// export const register = async (userData) => {
//   try {
//     const res = await api.post("/register", userData);
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || new Error("Network error");
//   }
// };

// // Login
// export const login = async (credentials) => {
//   try {
//     const res = await api.post("/login", credentials);
//     return res.data;
//   } catch (error) {
//     throw error.response?.data || new Error("Network error");
//   }
// };

import axios from "axios";

const API_URL = "http://localhost:5000/auth";

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData, {
    withCredentials: true,
  });

  sessionStorage.setItem("userId", res.data.userId); // ✅ save
  return res.data;
};

export const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });

  sessionStorage.setItem("userId", res.data.userId); // ✅ save
  return res.data;
};

export const createNote = async (note) => {
  const userId = sessionStorage.getItem("userId") || '698470df1c1244dd905ebe7c'; // ✅ read

  if (!userId) throw new Error("User not logged in");

  const res = await axios.post(
    `${API_URL}/note/${userId}`, // ✅ URL me bheja
    note,
    { withCredentials: true }
  );

  return res.data;
};