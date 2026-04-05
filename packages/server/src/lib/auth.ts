import { betterAuth } from 'better-auth'
import connection from '../db/connection'
import { sendPasswordResetEmail, sendWelcomeEmail } from '@terva/email'

export const auth = betterAuth({
	database: connection,

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, //change later
	},

	trustedOrigins: ['http://localhost:5173'],

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
})
