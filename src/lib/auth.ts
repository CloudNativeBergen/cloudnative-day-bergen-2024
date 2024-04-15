import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig, Session } from "next-auth"
import { NextRequest } from "next/server";
import { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module.js";
import { JwkKeyExportOptions } from "crypto";

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export const config = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...token,
        },
      }
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth: _auth, signIn, signOut } = NextAuth(config)

// This is a workaround to allow the auth function to be used as a route handler
// while still providing the correct types for the handler function.
// https://github.com/nextauthjs/next-auth/issues/9344#issuecomment-1891091409
export const auth = _auth as typeof _auth &
  (<HandlerResponse extends Response | Promise<Response>>(
    ...args: [
      (
        req: NextAuthRequest,
        context: { params: Record<string, string | string[] | undefined> }
      ) => HandlerResponse
    ]
  ) => (
    req: Parameters<AppRouteHandlerFn>[0],
    context: Parameters<AppRouteHandlerFn>[1]
  ) => HandlerResponse);