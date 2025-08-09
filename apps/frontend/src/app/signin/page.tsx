import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket, Zap, Shield, Globe } from "lucide-react";
import { SignInButton } from "@/app/_components/auth/SignInButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session && session.user) return redirect("/");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 shadow-2xl">
              <Rocket className="w-8 h-8 text-gray-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CodeDeployr</h1>
          <p className="text-gray-500 text-lg">
            Deploy your code with confidence
          </p>
        </div>

        {/* Main Signup Card */}
        <Card className="bg-gray-950/50 border-gray-800/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">
              Get Started
            </CardTitle>
            <CardDescription className="text-gray-500">
              Connect your GitHub account to start deploying
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GitHub Signup Button */}
            <SignInButton />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-950/50 text-gray-500">
                  Why GitHub?
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 mt-0.5">
                  <Zap className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Instant Access</p>
                  <p className="text-gray-500 text-sm">
                    Deploy directly from your repositories
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 mt-0.5">
                  <Shield className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Secure & Private</p>
                  <p className="text-gray-500 text-sm">
                    Your code stays safe with OAuth 2.0
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 mt-0.5">
                  <Globe className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Global Deployment</p>
                  <p className="text-gray-500 text-sm">
                    Deploy to edge locations worldwide
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-600 text-sm">
            By continuing, you agree to our{" "}
            <button className="text-gray-400 hover:text-gray-300 underline underline-offset-4 transition-colors">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-gray-400 hover:text-gray-300 underline underline-offset-4 transition-colors">
              Privacy Policy
            </button>
          </p>
          <p className="text-gray-600 text-xs">
            Already have an account? The same button works for sign in too.
          </p>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-800/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-800/10 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
