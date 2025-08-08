import { client as prisma } from "@deployer/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Session, User, SessionStrategy, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import Github from "next-auth/providers/github";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user repo user:email" } },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user
    }: {
      token: JWT & { accessToken?: string };
      account?: Account | null;
      user:User
    }) {
      // Save access_token in JWT on initial sign-in
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.id=user.id;
      }
      return token;
    },
    async session({ session, token }:{session:Session; token:JWT}) {
    return {
      ...session,
      user: {
        ...session.user,
        id: token.id,
      },
      accessToken: token.accessToken,
    };
  },

    async signIn({
      user,
      account,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
      email?: {
        verificationRequest?: boolean;
        email?: string;
      };
      credentials?: Record<string, unknown>;
    }) {
      // Check if an account already exists for this email
      if (account?.provider === "github" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // Link GitHub account to existing user
          await prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            data: {
              userId: existingUser.id,
            },
          });
        }

        
      }

      return true;
    },
  },
  // pages: {
  //   signIn: "/signin", // Optional custom signin page
  // },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
