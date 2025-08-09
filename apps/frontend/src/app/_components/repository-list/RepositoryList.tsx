"use client";

import { Github } from "lucide-react";
import { RepositoryCard } from "../repository-card/RepositoryCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Repo } from "@/lib/slices/repoSlice";
import { setRepositories } from "@/lib/slices/repoSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useEffect, useState } from "react";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-400/70",
  JavaScript: "bg-yellow-400/70",
  Python: "bg-green-400/70",
  Vue: "bg-emerald-400/70",
  Go: "bg-cyan-400/70",
  Dart: "bg-blue-300/70",
};

export function RepositoryList({ repos }: { repos: Repo[] }) {
  console.log(repos);
  const dispatch = useAppDispatch();
  const { repositories, searchString } = useAppSelector((state) => state.repo);

  const [filteredRepos, setFilteredRepos] = useState(repositories);

  useEffect(() => {
    if (repositories.length !== repos.length) {
      const cleanedRepos: Repo[] = repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks: repo.forks,
        updated_at: repo.updated_at,
        private: repo.private,
        default_branch: repo.default_branch,
        clone_url: repo.clone_url,
        html_url: repo.html_url,
      }));

      dispatch(setRepositories(cleanedRepos));
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
