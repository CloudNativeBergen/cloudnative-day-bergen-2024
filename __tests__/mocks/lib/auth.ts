import { jest } from '@jest/globals'

import { NextAuthRequest } from "@/lib/auth";
import { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module";

const NAMock = {
	auth: jest.fn((handler: AppRouteHandlerFn) => {
		return (req: NextAuthRequest) => {
			if (!req) req = {} as NextAuthRequest;

			req.auth = {
				expires: (Date.now() + 1000).toString(),
				user: {
					email: 'foo@bar.com',
					name: 'Foo Bar',
					picture: 'https://example.com/foo.jpg'
				},
				speaker: {
					_id: '1',
					name: 'Foo Bar',
					email: 'foo@bar.com',
					title: 'Software Engineer',
					is_diverse: false,
					is_first_time: false,
					is_local: false,
				},
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
};

export const {
	auth,
	signIn,
	signOut,
	handlers: { GET, POST },
} = NAMock;
