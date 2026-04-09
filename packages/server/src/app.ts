import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'

import getBeans from './bean/getBeans.js'
import addBean from './bean/addBean.js'
import editBean from './bean/editBean.js'
import removeBean from './bean/removeBean.js'
import getGear from './gear/getGear.js'
import getProfile from './profile/getProfile.js'
import removeProfile from './profile/removeProfile.js'
import getRecipes from './recipe/getRecipes.js'
import addGear from './gear/addGear.js'
import removeGear from './gear/removeGear.js'
import getBrews from './brews/getBrews.js'
import getRecentBrews from './brews/getRecentBrews.js'
import addBrew from './brews/addBrew.js'
import { seedDefaultRecipes } from './lib/seedDefaultRecipes.js'
import connection from './db/connection.js'
import seedDemo from './seedDemo/seedDemo.js'
import { sendWelcomeEmail } from '../../email/src/emails/sendWelcomeEmail.js'
import path from 'path'
import { fileURLToPath } from 'url'

const { CLIENT_PORT } = process.env

if (!CLIENT_PORT) {
	throw new Error('Missing required client port variable')
}

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve static files from the built client
app.use(express.static(path.join(__dirname, '../../client/dist')))

app.use(
	cors({
		origin: process.env.CLIENT_URL ?? 'https://tervabrewed.com',
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
				console.error('Welcome email error:', err),
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

app.use('/api/bean', addBean, editBean, getBeans, removeBean)
app.use('/api/gear', addGear, getGear, removeGear)
app.use('/api/profile', getProfile, removeProfile)
app.use('/api/recipe', getRecipes)
app.use('/api/brew', addBrew, getBrews)
app.use('/api/getrecentbrews', getRecentBrews)
app.use('/api/seeddemo', seedDemo)

// Catch-all — send index.html for any non-API route
// This is what makes Vue Router's history mode work
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

export default app
