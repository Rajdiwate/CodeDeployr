import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/formateDate";
import { Separator } from "@radix-ui/react-separator";
import {
  Calendar,
  ExternalLink,
  GitBranch,
  GitFork,
  Github,
  Star,
} from "lucide-react";
import { HandleImportButton } from "./HandleImportButton";
import { Repo } from "@/lib/slices/repoSlice";

interface IRepositoryProps {
  repo: Repo;
  languageColors: Record<string, string>;
}

export function RepositoryCard({ repo, languageColors }: IRepositoryProps) {
  return (
    <Card
      key={repo.id}
      className="bg-gray-950/50 border-gray-800/50 hover:border-gray-700/70 transition-all duration-200 hover:shadow-2xl hover:bg-gray-900/30 group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg flex items-center group-hover:text-gray-100">
              <Github className="w-5 h-5 mr-2 text-gray-500" />
              {repo.name}
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2 group-hover:text-gray-400">
              {repo.description}
            </CardDescription>
          </div>
          <HandleImportButton />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${languageColors[repo.language] || "bg-gray-500"}`}
              />
              <span className="text-gray-400">{repo.language}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Star className="w-4 h-4 mr-1" />
              {repo.stargazers_count}
            </div>
            <div className="flex items-center text-gray-500">
              <GitFork className="w-4 h-4 mr-1" />
              {repo.forks}
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(repo.updated_at)}
          </div>
        </div>
        <Separator className="my-3 bg-gray-800/50" />
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <GitBranch className="w-4 h-4 mr-1" />
            {repo.default_branch}
          </div>
          <a href={repo.html_url} target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View on GitHub
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
