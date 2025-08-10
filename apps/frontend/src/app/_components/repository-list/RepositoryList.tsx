"use client";

import { Github } from "lucide-react";
import { RepositoryCard } from "../repository-card/RepositoryCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Repo } from "@/lib/slices/repoSlice";
import { setRepositories } from "@/lib/slices/repoSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-400/70",
  JavaScript: "bg-yellow-400/70",
  Python: "bg-green-400/70",
  Vue: "bg-emerald-400/70",
  Go: "bg-cyan-400/70",
  Dart: "bg-blue-300/70",
};

export function RepositoryList({ repos }: { repos: Repo[] }) {
  const dispatch = useAppDispatch();
  const { repositories, searchString } = useAppSelector((state) => state.repo);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);

  //{
  //   "123": false,
  //   "456": false,
  //   "789": false
  // }
  const [fetchingFramework, setFetchingFramework] = useState<{
    [repoId: string]: boolean;
  }>(repositories.reduce((acc, repo) => ({ ...acc, [repo.id]: false }), {}));

  // if the repos exist, send the req to get the frameworks (will be async opt)
  const getFrameworks = useCallback(async () => {
    for (const repo of repositories) {
      try {
        setFetchingFramework((prev) => ({ ...prev, [repo.id]: true }));
        const { data } = await axios.get(
          `http://localhost:3001/detect-framework?cloneUrl=${repo.clone_url}&repoId=${repo.id}`,
        );
        console.log(data);
        setFetchingFramework((prev) => ({ ...prev, [repo.id]: false }));
      } catch (error) {
        console.log(error);
      }
    }
  }, [repositories]);

  useEffect(() => {
    if (repositories.length !== repos.length) {
      dispatch(setRepositories(repos));
    }
  }, [repos, dispatch, repositories]);

  useEffect(() => {
    const filtered = repositories.filter((repo) =>
      `${repo.name} ${repo.description}`
        .toLowerCase()
        .includes(searchString.toLowerCase()),
    );
    setFilteredRepos(filtered);
  }, [repositories, searchString]);

  useEffect(() => {
    if (repositories.length) getFrameworks();
  }, [getFrameworks, repositories]);

  //remove this later
  if (fetchingFramework) {
    console.log("object");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Repositories</h3>
        <Badge
          variant="secondary"
          className="bg-gray-800/50 text-gray-400 border-gray-700/50"
        >
          {filteredRepos.length} repositories
        </Badge>
      </div>

      {filteredRepos.length === 0 ? (
        <Card className="bg-gray-950/50 border-gray-800/50 shadow-2xl">
          <CardContent className="p-8 text-center">
            <Github className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">
              No repositories found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRepos.map((repo: Repo) => (
            <RepositoryCard
              languageColors={languageColors}
              key={repo.id}
              repo={repo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
