import { Github } from "lucide-react";
import { SearchRepo } from "./_components/search-repo/SearchRepo";
import { RepositoryList } from "./_components/repository-list/RepositoryList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "./_components/header/Header";
import { setRepositories } from "@/lib/slices/repoSlice";
import axios from "axios";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/api/auth/signin");
  }

  const token=session.accessToken;
  const {data:repos}=await axios.get('https://api.github.com/user/repos',{
    headers:{
      Authorization:`Bearer ${token}`
    }
  }) 

  return (
    <div className="min-h-screen bg-black ">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
