import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  TokenSet,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env/server.mjs";
import { prisma } from "./db";
import RedditProvider from "next-auth/providers/reddit";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      token: string | null;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "++++++++++++++++++++++++++ SIGN IN ++++++++++++++++++++++++++++++++"
      );
      console.log(user);
      console.log(account);
      console.log(profile);

      if (account) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async session({ session, user }) {
      const [reddit] = await prisma.account.findMany({
        where: { userId: user.id, provider: "reddit" },
      });
      if (!reddit) throw new Error("error");

      console.log(
        "::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"
      );

      console.log("EXPIRES AT");
      console.log(reddit.expires_at);
      console.log("NOW");
      console.log(Math.floor(new Date().getTime() / 1000.0));

      // reddit.expires_at < Date.now()
      if (
        reddit.expires_at &&
        reddit.refresh_token &&
        reddit.expires_at <= Math.floor(new Date().getTime() / 1000.0)
      ) {
        try {
          console.log(
            "*************************** REFRESH ******************************************************"
          );

          const user = process.env.REDDIT_CLIENT_ID;
          const pass = process.env.REDDIT_CLIENT_SECRET;

          console.log(user);
          console.log(pass);
          console.log(reddit.refresh_token);
          console.log(reddit.access_token);

          const base64encodedData = Buffer.from(user + ":" + pass).toString(
            "base64"
          );

          const response = await fetch(
            "https://www.reddit.com/api/v1/access_token",
            {
              headers: {
                Authorization: `Basic ${base64encodedData}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: reddit.refresh_token,
              }),
              method: "POST",
            }
          );

          const tokens: TokenSet = (await response.json()) as TokenSet;
          if (!response.ok) throw tokens;

          console.log(
            "*************************** REFRESH ******************************************************"
          );
          console.log(response);
          console.log("VVVVVVVVV");
          console.log(tokens);
          console.log(
            "*************************** REFRESH ******************************************************"
          );
          console.log(tokens.expires_in);
          console.log(Math.floor(new Date().getTime() / 1000.0));

          console.log(
            Math.floor(new Date().getTime() / 1000.0) +
              parseInt(parseInt(tokens.expires_in))
          );

          await prisma.account.update({
            data: {
              access_token: tokens.access_token,
              expires_at:
                Math.floor(new Date().getTime() / 1000.0) +
                parseInt(parseInt(tokens.expires_in)),
              refresh_token: tokens.refresh_token ?? reddit.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: "reddit",
                providerAccountId: reddit.providerAccountId,
              },
            },
          });
        } catch (error) {
          console.error("Error refreshing access token", error);
        }
      }
      // ***********************************

      const getToken = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      let accessToken: string | null = null;
      if (getToken) {
        accessToken = getToken.access_token!;
      }

      if (session.user) {
        console.log("____________ACCESS TOKEN_____________");
        console.log(accessToken);
        session.user.id = user.id;
        session.user.token = accessToken;

        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      authorization: {
        params: {
          duration: "permanent",
          scope: "identity edit mysubreddits read save submit flair",
        },
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
