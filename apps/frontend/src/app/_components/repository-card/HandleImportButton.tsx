"use client";

import { Button } from "@/components/ui/button";

export function HandleImportButton() {
  const handleImport = (repoName: string) => {
    // Navigate to deployment configuration page
    console.log(`Importing repository: ${repoName}`);
    // In a real app, you would use Next.js router here
    // router.push(`/deploy/${repoName}`)
    alert(`Navigating to deploy ${repoName}...`);
  };

  return (
    <Button
      onClick={() => handleImport("temp Name")}
      className="ml-4 bg-white text-black hover:bg-gray-200 transition-colors font-medium"
    >
      Import
    </Button>
  );
}
