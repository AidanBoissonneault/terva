import 'dotenv/config'
import express from 'express'
import testRoute from './test/test.js'
import getBeans from './getBeans/getBeans.js'
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

app.use(express.json())
app.use('/api/test', testRoute)
app.use('/api/getbeans', getBeans)
app.use('/api/getgear', getGear)
app.use('/api/addgear', addGear)
app.use('/api/removegear', removeGear)
app.use('/api/getRecipes', getRecipes)
app.use('/api/addbrew', addBrew)

export default app
