import { Github } from "lucide-react";
import { SearchRepo } from "./_components/search-repo/SearchRepo";
import { RepositoryList } from "./_components/repository-list/RepositoryList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "./_components/header/Header";
import axios, { AxiosError } from "axios";
import { Repo } from "@/lib/slices/repoSlice";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  let repos: Repo[] = [];

  if (!session || !session.user || !session.user.id || !session.accessToken) {
    redirect("/api/auth/signin");
  }

  try {
    const { data } = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    console.log(data);
    const cleanedRepos: Repo[] = data.map((repo: Repo) => ({
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
      full_name: repo.full_name,
    }));

    repos = cleanedRepos;
  } catch (error) {
    if (error instanceof AxiosError)
      console.log("error getting repos", error.response?.data);
    // logout the user if there is an error
  }

  return (
    <div className="min-h-screen bg-black z-10">
      {/* Header */}
      <Header user={session.user} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 z-20">
        <div className="max-w-6xl mx-auto">
          {/* Import Form Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Github className="w-8 h-8 text-gray-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">
                Import GitHub Repository
              </h2>
            </div>
            <p className="text-gray-500 text-lg">
              Select a repository from your GitHub account to deploy
            </p>
          </div>

          {/* Search Bar */}
          <SearchRepo />

          {/* Repository List */}
          <RepositoryList repos={repos} />
        </div>
      </main>
    </div>
  );
}
