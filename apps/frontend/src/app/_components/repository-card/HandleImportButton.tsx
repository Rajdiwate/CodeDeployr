"use client";

import { Button } from "@/components/ui/button";
import { Repo } from "@/lib/slices/repoSlice";
import { useRouter } from "next/navigation";

export function HandleImportButton({ repo }: { repo: Repo }) {
  const router = useRouter();
  const handleImport = () => {
    console.log(`Importing repository: ${repo}`);
    router.push(
      `/new?repoName=${repo.name}&repoUrl=${repo.html_url}&defaultBranch=${repo.default_branch}&cloneUrl=${repo.clone_url}&repoId=${repo.id}&fullName=${repo.full_name}`,
    );
  };

  return (
    <Button
      onClick={handleImport}
      className="ml-4 bg-white text-black hover:bg-gray-200 transition-colors font-medium"
    >
      Import
    </Button>
  );
}
