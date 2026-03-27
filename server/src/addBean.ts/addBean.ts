import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { } = req.body

    const query = `
      INSERT INTO beans (., ., ., ...)
      VALUES (?, ...)
    `

    const [result] = await connection.query<ResultSetHeader>(query, [

    ])

    res.json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router