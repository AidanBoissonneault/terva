import { Router } from 'express'
import connection from '../db/connection.js'

const router = Router()

router.get('/', async (req, res) => {
  try {

    const { userId } = req.query

    if (!userId) {
      res.status(400).json({ error: 'userId is required' })
      return
    }

    const query = `
    SELECT
    id,
    name,
    type,
    notes
  FROM gear
  WHERE user = ?;
  `
    const [rows] = await connection.query(query, userId)
    res.json(rows)
  } catch (err) {
    const error = err as Error
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router
