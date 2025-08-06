import { createSlice } from "@reduxjs/toolkit";

export type Repo = {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  isPrivate: boolean;
  defaultBranch: string;
};

const initialState: { repositories: Repo[]; searchString: string } = {
  repositories: [
    {
      id: 1,
      name: "awesome-react-app",
      description:
        "A modern React application with TypeScript and Tailwind CSS",
      language: "TypeScript",
      stars: 245,
      forks: 32,
      updatedAt: "2024-01-15",
      isPrivate: false,
      defaultBranch: "main",
    },
    {
      id: 2,
      name: "nextjs-portfolio",
      description: "Personal portfolio website built with Next.js 14",
      language: "JavaScript",
      stars: 89,
      forks: 12,
      updatedAt: "2024-01-10",
      isPrivate: false,
      defaultBranch: "main",
    },
    {
      id: 3,
      name: "python-data-analyzer",
      description: "Data analysis tool with pandas and matplotlib",
      language: "Python",
      stars: 156,
      forks: 28,
      updatedAt: "2024-01-08",
      isPrivate: false,
      defaultBranch: "master",
    },
    {
      id: 4,
      name: "vue-dashboard",
      description: "Admin dashboard built with Vue 3 and Composition API",
      language: "Vue",
      stars: 78,
      forks: 15,
      updatedAt: "2024-01-05",
      isPrivate: false,
      defaultBranch: "main",
    },
    {
      id: 5,
      name: "golang-microservice",
      description: "Microservice architecture example with Go and Docker",
      language: "Go",
      stars: 203,
      forks: 45,
      updatedAt: "2024-01-03",
      isPrivate: false,
      defaultBranch: "main",
    },
    {
      id: 6,
      name: "flutter-mobile-app",
      description: "Cross-platform mobile app with Flutter and Firebase",
      language: "Dart",
      stars: 134,
      forks: 22,
      updatedAt: "2023-12-28",
      isPrivate: false,
      defaultBranch: "main",
    },
  ],
  searchString: "",
};

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setSearchString: (state, action) => {
      state.searchString = action.payload;
    },
  },
});

export const { setSearchString } = repoSlice.actions;
