import 'dotenv/config'
import express from 'express'
import testRoute from './test/test.js'
import getBeans from './getBeans/getBeans.js'
import getGear from './getGear/getGear.js'

const { CLIENT_PORT } = process.env

if (!CLIENT_PORT) {
  throw new Error('Missing required client port variable')
}

const app = express()

app.use(express.json())
app.use('/api/test', testRoute)
app.use('/api/getbeans', getBeans)
app.use('/api/getgear', getGear)

export default app
