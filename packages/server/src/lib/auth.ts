import { betterAuth } from 'better-auth'
import connection from '../db/connection.js'

export const auth = betterAuth({
	database: connection,

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, //change later
	},

	trustedOrigins: ['http://localhost:5173', 'http://localhost:4173', 'https://www.tervabrewed.com', "http://localhost:3000"],

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
})
