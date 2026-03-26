import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'

const router = Router()

router.delete('/', async (req, res) => {
  try {
    const { id, user } = req.body

    const query = `
      DELETE FROM gear
      WHERE id = ?
      AND user = ?
    `

    const [result] = await connection.query<ResultSetHeader>(query, [id, user])

    // If no rows were affected, the bean didn't exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bean not found' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router