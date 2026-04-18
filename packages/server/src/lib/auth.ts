import { betterAuth } from 'better-auth'
import connection from '../db/connection.js'
import { sendPasswordResetEmail } from '../../../email/src/emails/sendPasswordResetEmail.js'

export const auth = betterAuth({
	database: connection,

	advanced: {
		cookiePrefix: 'terva',
		defaultCookieAttributes: {
			domain: process.env.NODE_ENV === 'production' ? '.tervabrewed.com' : 'localhost',
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
		},
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, //change later

		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail(user.email, url)
		},
	},

	trustedOrigins: [
		'http://localhost:5173',
		'http://localhost:4173',
		'https://www.tervabrewed.com',
		'https://tervabrewed.com',
		'http://localhost:3000',
	],

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
})
