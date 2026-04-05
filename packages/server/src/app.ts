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
import addBrew from './addBrew/addBrew.js'

const { CLIENT_PORT } = process.env

if (!CLIENT_PORT) {
  throw new Error('Missing required client port variable')
}

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  credentials: true,
}))

app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

app.use('/api/test', testRoute)
app.use('/api/getbeans', getBeans)
app.use('/api/addbean', addBean)
app.use('/api/getgear', getGear)
app.use('/api/addgear', addGear)
app.use('/api/removegear', removeGear)
app.use('/api/getRecipes', getRecipes)
app.use('/api/addbrew', addBrew)

export default app
