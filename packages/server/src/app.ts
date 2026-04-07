import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'

// your existing routes
import testRoute from './test/test.js'
import getBeans from './getBeans/getBeans.js'
import addBean from './addBean/addBean.js'
import getGear from './getGear/getGear.js'
import getRecipes from './getRecipes/getRecipes.js'
import addGear from './addGear/addGear.js'
import removeGear from './removeGear/removeGear.js'
import getBrews from './getBrews/getBrews.js'
import getRecentBrews from './getBrews/getRecentBrews.js'
import addBrew from './addBrew/addBrew.js'
import { seedDefaultRecipes } from './lib/seedDefaultRecipes.js'
import connection from './db/connection.js'
import seedDemo from './seedDemo/seedDemo.js'
import { sendWelcomeEmail } from '../../email/src/emails/sendWelcomeEmail.js'

const { CLIENT_PORT } = process.env

if (!CLIENT_PORT) {
	throw new Error('Missing required client port variable')
}

const app = express()

app.use(
	cors({
		origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
		credentials: true,
	}),
)

app.post('/api/auth/sign-up/email', express.json(), async (req, res, next) => {
	try {
		const { name, email, password } = req.body

		const result = await auth.api.signUpEmail({
			body: { name, email, password },
		})

		if (result?.user?.id) {
			await seedDefaultRecipes(connection, result.user.id).catch((err) =>
				console.error('Seed error:', err),
			)
			await sendWelcomeEmail(result.user.email).catch((err) =>
				console.error("Welcome email error:", err)
			)
		}

		// Sign in immediately so the session cookie gets set on the response
		const signInResult = await auth.api.signInEmail({
			body: { email, password },
			asResponse: true,
		})

		// Forward BetterAuth's response headers (including Set-Cookie) to the client
		signInResult.headers.forEach((value, key) => {
			res.setHeader(key, value)
		})

		res.json(result)
	} catch (err: any) {
		res.status(400).json({ error: err.message })
	}
})

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.use('/api/test', testRoute)
app.use('/api/getbeans', getBeans)
app.use('/api/addbean', addBean)
app.use('/api/getgear', getGear)
app.use('/api/addgear', addGear)
app.use('/api/removegear', removeGear)
app.use('/api/getRecipes', getRecipes)
app.use('/api/getbrews', getBrews)
app.use('/api/getrecentbrews', getRecentBrews)
app.use('/api/addbrew', addBrew)
app.use('/api/seeddemo', seedDemo)

export default app
