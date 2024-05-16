import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
import type { NextAuthConfig, Session, User } from "next-auth"
import { NextRequest } from "next/server";
import { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module.js";
import { getOrCreateSpeaker } from "@/lib/speaker/sanity";

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export const config = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This is exposed to the client
    async session({ session, token }) {
      const speaker = token.speaker
      const account = token.account

      return {
        ...session,
        user: {
          sub: token.sub,
          name: token.name,
          email: token.email,
          picture: token.picture,
        },
        speaker,
        account,
      } as Session
    },

    // token is the JWT token
    // user is the user object
    // account is the user's account object from the authentication provider
    // account.provider is the name of the provider
    // account.access_token is the provider access token
    // profile is the user's profile object from the authentication provider
    async jwt({ token, account, trigger }) {
      if (!trigger && !(token.account && token.speaker)) {
        console.error("Invalid auth token", token)
        return {}
      }

      if (trigger === "signIn") {
        if (!token || !token.email || !token.name) {
          console.error("Invalid auth token", token)
          return {}
        }

        if (!account || !account.provider || !account.providerAccountId) {
          console.error("Invalid auth account", account);
          return {}
        }

        const user: User = { email: token.email, name: token.name, image: token.picture }
        const { speaker, err } = await getOrCreateSpeaker(user, account)
        if (err) {
          console.error("Error fetching or creating speaker profile", err)
          return {}
        }

        if (speaker.image && typeof speaker.image === "string") {
          token.picture = `${speaker.image}?w=96&h=96&fit=crop`
        }

        token.account = account
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