import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig, Session } from "next-auth"
import { NextRequest } from "next/server";
import { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module.js";
import { getOrCreateSpeaker } from "./speaker/sanity";

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
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      const speaker = token.speaker

      return {
        ...session,
        user: {
          sub: token.sub,
          name: token.name,
          email: token.email,
          picture: token.picture,
        },
        speaker,
      } as Session
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name

      if (!token || !token.email || !token.name) {
        console.error("Invalid token", token)
        return token
      }

      if (!token.speaker) {
        const { speaker, err } = await getOrCreateSpeaker({ email: token.email, name: token.name, picture: token.picture })
        if (err) {
          console.error("Error fetching speaker profile", err)
        }

        token.speaker = { _id: speaker._id }
      }

      return token
    },
    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    }
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

export function isAtuh(req: NextAuthRequest): boolean {
  return (req.auth && req.auth.user && req.auth.speaker && req.auth.speaker._id) ? true : false
}