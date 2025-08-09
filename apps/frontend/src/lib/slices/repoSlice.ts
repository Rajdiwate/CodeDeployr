import { createSlice } from "@reduxjs/toolkit";

export type Repo = {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks: number;
  updated_at: string;
  private: boolean;
  default_branch: string;
  clone_url: string;
  html_url: string;
};

const initialState: { repositories: Repo[]; searchString: string } = {
  repositories: [],
  searchString: "",
};

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setSearchString: (state, action) => {
      state.searchString = action.payload;
    },
    setRepositories: (state, action) => {
      state.repositories = action.payload;
    },
  },
});

export const { setSearchString, setRepositories } = repoSlice.actions;
