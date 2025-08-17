"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, FolderOpen, Globe, XCircle } from "lucide-react";
import { useState } from "react";
import { TProject } from "./Header";

export function MyProjectsButton({ projects }: { projects: TProject[] }) {
  const [showProjectsPopup, setShowProjectsPopup] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deployed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Deployed
          </Badge>
        );
      case "building":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Building
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDeploymentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  return (
    <>
      {" "}
      <Button
        variant="outline"
        onClick={() => {
          setShowProjectsPopup(true);
        }}
        className="bg-gray-900/50 border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-600"
      >
        <FolderOpen className="w-4 h-4 mr-2" />
        My Projects
      </Button>
      {showProjectsPopup && (
        <>
          {/* Backdrop */}
          <div
            className="fixed min-h-screen inset-0 bg-white/5 z-30"
            onClick={() => setShowProjectsPopup(false)}
          />
          {/* Popup */}
          <div
            className="absolute right-0 top-full mt-2 w-96"
            style={{ zIndex: 100 }}
          >
            <Card className="bg-gray-950/95 border-gray-800/50 shadow-2xl backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  My Projects
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {projects.length} deployed projects
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {projects.map((project, index) => (
                    <div key={project.id}>
                      <div className="p-4 hover:bg-gray-900/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">
                              {project.name}
                            </h4>
                            <p className="text-gray-500 text-xs mt-1">
                              {project.framework}
                            </p>
                          </div>
                          {getStatusBadge(
                            project.deployments[project.deployments.length - 1]
                              ?.status || "building",
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {project.deployments[project.deployments.length - 1]
                            ?.updatedAt && (
                            <span className="text-gray-500">
                              {formatDeploymentDate(
                                new Date(
                                  project.deployments[
                                    project.deployments.length - 1
                                  ]?.updatedAt,
                                ).toString(),
                              )}
                            </span>
                          )}
                          {project.deployments[project.deployments.length - 1]
                            ?.deploymentUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-gray-400 hover:text-white hover:bg-gray-800/50"
                            >
                              <Globe className="w-3 h-3 mr-1" />
                              <a
                                href={
                                  project.deployments[
                                    project.deployments?.length - 1
                                  ]?.deploymentUrl as string
                                }
                                target="_blank"
                              >
                                Visit
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < projects.length - 1 && (
                        <Separator className="bg-gray-800/50" />
                      )}
                    </div>
                  ))}
                </div>

                {/* <div className="p-4 border-t border-gray-800/50">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm"
                    onClick={() => setShowProjectsPopup(false)}
                  >
                    View All Projects
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
