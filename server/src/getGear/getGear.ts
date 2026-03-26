import { Router } from 'express'
import connection from '../db/connection.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const query = `
    SELECT
    id,
    name,
    type,
    notes
  FROM gear
  WHERE user = ?;
  `
    const [rows] = await connection.query(query, 1)
    res.json(rows)
  } catch (err) {
    const error = err as Error
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router
