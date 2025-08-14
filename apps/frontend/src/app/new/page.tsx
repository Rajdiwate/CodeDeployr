"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  Settings,
  GitBranch,
  Terminal,
  Key,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface EnvVar {
  id: string;
  key: string;
  value: string;
}

const frameworks = [
  {
    id: "vite-react",
    name: "Vite + React",
    framework: "REACT",
    description: "Fast build tool with React",
    buildCommand: "npm run build",
    startCommand: "npm run start",
    outputDirectory: "dist",
  },
  {
    id: "create-react-app",
    framework: "REACT",
    name: "Create React App",
    description: "Traditional React setup",
    buildCommand: "npm run build",
    startCommand: "npm start",
    outputDirectory: "build",
  },
  {
    id: "static",
    name: "Static Files",
    framework: "STATIC_HTML",
    description: "HTML, CSS, JS files",
    buildCommand: "",
    startCommand: "",
    outputDirectory: ".",
  },
];

const branches = ["main", "master", "develop", "staging"];

function NewProjectPage() {
  const searchParams = useSearchParams();
  const { data } = useSession();
  const cloneUrl = searchParams.get("cloneUrl");
  const repoId = searchParams.get("repoId");
  const httpUrl = searchParams.get("repoUrl");
  const router = useRouter();

  const [projectName, setProjectName] = useState(
    searchParams.get("repoName") || "",
  );
  const [selectedFramework, setSelectedFramework] = useState("");
  const [projectFramework, setProjectFramework] = useState("");
  const [rootDirectory, setRootDirectory] = useState("./");
  const [selectedBranch, setSelectedBranch] = useState(
    searchParams.get("defaultBranch") || branches[0],
  );
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [startCommand, setStartCommand] = useState("npm run start");
  const [outputDirectory, setOutputDirectory] = useState("dist");
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  console.log(cloneUrl, repoId, httpUrl);

  const handleFrameworkChange = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    const framework = frameworks.find((f) => f.id === frameworkId);
    if (framework) {
      setProjectFramework(framework.framework);
      setBuildCommand(framework.buildCommand);
      setStartCommand(framework.startCommand);
      setOutputDirectory(framework.outputDirectory);
    }
  };

  const addEnvVar = () => {
    const newEnvVar: EnvVar = {
      id: Date.now().toString(),
      key: "",
      value: "",
    };
    setEnvVars([...envVars, newEnvVar]);
  };

  const removeEnvVar = (id: string) => {
    setEnvVars(envVars.filter((env) => env.id !== id));
  };

  const updateEnvVar = (
    id: string,
    field: "key" | "value",
    newValue: string,
  ) => {
    setEnvVars(
      envVars.map((env) =>
        env.id === id ? { ...env, [field]: newValue } : env,
      ),
    );
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process

    await axios.post(
      `/api/create-project`,
      {
        userId: data?.user.id,
        githubRepoUrl: cloneUrl,
        name: projectName,
        githubRepoName: searchParams.get("fullName") || projectName,
        githubBranch: selectedBranch,
        buildCommand: buildCommand,
        startCommand: startCommand,
        envVariables: envVars,
        framework: projectFramework,
        rootDirectory,
        subdomain: projectName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    toast.success("Deployment initiated successfully!");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const selectedFrameworkData = frameworks.find(
    (f) => f.id === selectedFramework,
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Separator
                orientation="vertical"
                className="h-6 bg-gray-700/50"
              />
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700">
                  <Rocket className="w-4 h-4 text-gray-300" />
                </div>
                <h1 className="text-xl font-bold text-white">
                  Create New Project
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Project Configuration */}
            <Card className="bg-gray-950/50 border-gray-800/50 shadow-2xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <CardTitle className="text-white">
                    Project Configuration
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-500">
                  Configure your project settings and deployment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="project-name"
                    className="text-white font-medium"
                  >
                    Project Name
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="my-awesome-project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                  />
                  <p className="text-sm text-gray-500">
                    This will be used as your deployment URL:{" "}
                    {projectName || "project-name"}.codedeployr.app
                  </p>
                </div>

                {/* Framework Selection */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">Framework</Label>
                  <Select
                    value={selectedFramework}
                    onValueChange={handleFrameworkChange}
                  >
                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white focus:border-gray-600 focus:ring-1 focus:ring-gray-600">
                      <SelectValue placeholder="Select a framework" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {frameworks.map((framework) => (
                        <SelectItem
                          key={framework.id}
                          value={framework.id}
                          className="text-white hover:bg-gray-800"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {framework.name}
                            </span>
                            <span className="text-sm text-gray-400">
                              {framework.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFrameworkData && (
                    <div className="mt-2 p-3 bg-gray-900/30 border border-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">Selected:</strong>{" "}
                        {selectedFrameworkData.name} -{" "}
                        {selectedFrameworkData.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Root Directory and Branch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="root-dir"
                      className="text-white font-medium"
                    >
                      Root Directory
                    </Label>
                    <Input
                      id="root-dir"
                      placeholder="./"
                      value={rootDirectory}
                      onChange={(e) => setRootDirectory(e.target.value)}
                      className="bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-medium">
                      Branch to Deploy
                    </Label>
                    <Select
                      value={selectedBranch}
                      onValueChange={setSelectedBranch}
                    >
                      <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white focus:border-gray-600 focus:ring-1 focus:ring-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {branches.map((branch) => (
                          <SelectItem
                            key={branch}
                            value={branch}
                            className="text-white hover:bg-gray-800"
                          >
                            <div className="flex items-center">
                              <GitBranch className="w-4 h-4 mr-2 text-gray-400" />
                              {branch}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Build Settings */}
            <Card className="bg-gray-950/50 border-gray-800/50 shadow-2xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-gray-400" />
                  <CardTitle className="text-white">Build Settings</CardTitle>
                </div>
                <CardDescription className="text-gray-500">
                  Configure build and start commands for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="build-command"
                      className="text-white font-medium"
                    >
                      Build Command
                    </Label>
                    <Input
                      id="build-command"
                      placeholder="npm run build"
                      value={buildCommand}
                      onChange={(e) => setBuildCommand(e.target.value)}
                      className="bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                    />
                    <p className="text-sm text-gray-500">
                      Command to build your project for production
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="start-command"
                      className="text-white font-medium"
                    >
                      Start Command
                    </Label>
                    <Input
                      id="start-command"
                      placeholder="npm start"
                      value={startCommand}
                      onChange={(e) => setStartCommand(e.target.value)}
                      className="bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                    />
                    <p className="text-sm text-gray-500">
                      Command to start your application
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="output-dir"
                    className="text-white font-medium"
                  >
                    Output Directory
                  </Label>
                  <Input
                    id="output-dir"
                    placeholder="dist"
                    value={outputDirectory}
                    onChange={(e) => setOutputDirectory(e.target.value)}
                    className="bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                  />
                  <p className="text-sm text-gray-500">
                    Directory where build artifacts are generated
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card className="bg-gray-950/50 border-gray-800/50 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-5 h-5 text-gray-400" />
                    <CardTitle className="text-white">
                      Environment Variables
                    </CardTitle>
                  </div>
                  <Button
                    onClick={addEnvVar}
                    variant="outline"
                    size="sm"
                    className="border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:text-white bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                </div>
                <CardDescription className="text-gray-500">
                  Add environment variables for your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {envVars.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No environment variables added yet.
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Click &quot;Add Variable&quot; to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {envVars.map((envVar) => (
                      <div
                        key={envVar.id}
                        className="flex items-center space-x-3 p-3 bg-gray-900/30 border border-gray-800/50 rounded-lg"
                      >
                        <Input
                          placeholder="KEY"
                          value={envVar.key}
                          onChange={(e) =>
                            updateEnvVar(envVar.id, "key", e.target.value)
                          }
                          className="flex-1 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                        />
                        <span className="text-gray-500">=</span>
                        <Input
                          placeholder="value"
                          value={envVar.value}
                          onChange={(e) =>
                            updateEnvVar(envVar.id, "value", e.target.value)
                          }
                          className="flex-1 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
                        />
                        <Button
                          onClick={() => removeEnvVar(envVar.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-400 hover:bg-red-950/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deploy Button */}
            <Card className="bg-gray-950/50 border-gray-800/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Ready to Deploy?
                    </h3>
                    <p className="text-gray-500">
                      Your project will be deployed to:{" "}
                      <span className="text-gray-300">
                        {projectName
                          .toLowerCase()
                          .replace(/[^a-zA-Z0-9]/g, "-") || "project-name"}
                        .codedeployr.app
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={handleDeploy}
                    disabled={!projectName || !selectedFramework || isDeploying}
                    className="bg-white text-black hover:bg-gray-200 transition-colors font-medium px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeploying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin mr-2" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Deploy Project
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <NewProjectPage />
    </Suspense>
  );
}
