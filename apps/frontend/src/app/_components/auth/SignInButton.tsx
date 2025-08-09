"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function SignInButton() {
  const [loading, setLoading] = useState(false);

  const handleGitHubSignup = async () => {
    setLoading(true);
    await signIn("github");
    setLoading(false);
  };

  return (
    <Button
      onClick={handleGitHubSignup}
      disabled={loading}
      className="w-full h-12 bg-white text-black hover:bg-gray-200 transition-all duration-200 font-medium text-base flex items-center justify-center space-x-3 shadow-lg"
    >
      <Github className="w-5 h-5" />
      <span>Continue with GitHub</span>
    </Button>
  );
}
