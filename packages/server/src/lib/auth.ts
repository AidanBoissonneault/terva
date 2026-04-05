import { betterAuth } from 'better-auth'
import connection from '../db/connection'
import { seedDefaultRecipes } from './seedDefaultRecipes'

export const auth = betterAuth({
	database: connection,

	emailAndPassword: {
		enabled: true,
	},

	trustedOrigins: ['http://localhost:5173'],

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
})
