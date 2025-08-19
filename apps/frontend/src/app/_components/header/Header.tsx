import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Rocket } from "lucide-react";
import { MyProjectsButton } from "./MyProjectsButton";
import { client, Prisma } from "@deployr/db";

type TUser = {
  id: unknown;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const projectWithDeployments = Prisma.validator<Prisma.ProjectFindFirstArgs>()({
  select: {
    id: true,
    name: true,
    framework: true,
    deployments: {
      select: {
        id: true,
        status: true,
        updatedAt: true,
        deploymentUrl: true,
      },
    },
  },
});

export type TProject = Prisma.ProjectGetPayload<typeof projectWithDeployments>;

export async function Header({ user }: { user: TUser }) {
  const projects: TProject[] = await client.project.findMany({
    where: {
      userId: user.id as string,
    },
    include: {
      deployments: {
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  return (
    <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm sticky top-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700">
              <Rocket className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CodeDeployr</h1>
              <p className="text-sm text-gray-500">Deploy with confidence</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="relative">
              <MyProjectsButton projects={projects} />
            </div>

            {user && (
              <>
                <Avatar className="w-10 h-10 rounded-2xl overflow-hidden">
                  <AvatarImage
                    src={user.image || "/placeholder.svg?height=32&width=32"}
                    alt="User"
                  />
                  <AvatarFallback className="bg-gray-700 text-gray-300 border border-gray-600 px-2 py-1 rounded-full">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">Connected via GitHub</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
