import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.delete('/', requireAuth, async (req, res) => {
  try {
    const { id } = req.body

    const userId = res.locals.user.id

    const query = `
      DELETE FROM gear
      WHERE id = ?
      AND user = ?
    `

    const [result] = await connection.query<ResultSetHeader>(query, [id, userId])

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
