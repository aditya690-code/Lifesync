import { createSlice } from "@reduxjs/toolkit";
import { diaries } from "../../../services/data";

const initialState = {
  entry: diaries,
  totalEntry: 0,
  skip: {
    isSkip: true,
    value: 0,
  },
  limit: 15,
  hashMore: false,

  activeDiary: {},
  isDiaryActive: false,
  searchDiary: null,

  isLoading: false,
  error: null,
};

export const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    setEntry: (state, action) => {
      state.entry = action.payload;
    },
    setTotalEntry: (state, action) => {
      state.totalEntry = action.payload;
    },
    addJournal: (state, action) => {
      state.entry += action.payload;
    },
    editJournal: (state, action) => {
      state.entry = action.payload;
    },
    deleteJournal: (state) => {
      state.entry = [];
    },
    setActiveDiary: (state, action) => {
      state.activeDiary = action.payload;
    },
    setSkip: (state, action) => {
      state.skip.value = action.payload;
      state.skip.isSkip = false;
    },
    setIsLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setHashMore: (state, action) => {
      state.hashMore = action.payload;
    },
    setIsDiaryActive: (state, action) => {
      state.isDiaryActive = action.payload;
    },
  },
});

export const {
  setEntry,
  setTotalEntry,
  addJournal,
  editJournal,
  deleteJournal,
  setActiveDiary,
  setIsLoading,
  setError,
  setSkip,
  setHashMore,
  setIsDiaryActive,
} = diarySlice.actions;
export default diarySlice.reducer;
