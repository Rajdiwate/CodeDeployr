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
      authorization: {
        params: {
          scope: "repo read:user user:email"
        }
      }
    }),
  ],
  callbacks: {
    // async jwt({token,account,user}:{token:JWT & {accessToken?:string}, account?:Account |null,user:User}){
    //   if(account && user){
    //     token.accessToken=account.access_token;
    //     token.id=user.id;
    //   }
    //   return token
    // },
    session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
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
      if (!account || account.provider !== "github" || !user.email) {
        return true; 
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
            },
          });
        }
      }

      return true;
    }

  },
  // pages: {
  //   signIn: "/signin", // Optional custom signin page
  // },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database" as SessionStrategy,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
