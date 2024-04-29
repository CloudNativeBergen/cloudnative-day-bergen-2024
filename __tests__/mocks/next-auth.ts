import { jest } from '@jest/globals'

import { NextAuthRequest } from "@/lib/auth";
import { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module";
import { Account } from 'next-auth';

export class AuthError extends Error {
	type: string;
	constructor(type: string) {
		super(type);
		this.type = type;
	}
}

const NextAuth = () => ({
	auth: jest.fn((handler: AppRouteHandlerFn) => {
		return (req: NextAuthRequest) => {
			if (!req) req = {} as NextAuthRequest;

			const account: Account = {
				provider: 'github',
				providerAccountId: '123',
				access_token: 'abc',
				type: 'oidc'
			}

			req.auth = {
				expires: (Date.now() + 1000).toString(),
				user: {
					email: 'foo@bar.com',
					name: 'Foo Bar',
					picture: 'https://example.com/foo.jpg'
				},
				speaker: {
					_id: '1',
				},
				account,
			};
			return handler(req, {});
		}
	}),
	signIn: jest.fn(),
	signOut: jest.fn(),
	handlers: {
		GET: jest.fn(),
		POST: jest.fn(),
	},
	AuthError: AuthError,
});

export default NextAuth;
