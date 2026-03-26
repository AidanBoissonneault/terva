import { Router } from 'express'
import connection from '../db/connection.js'
import type { OkPacket, ResultSetHeader } from 'mysql2'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, type, notes, user } = req.body

    const query = `
      INSERT INTO gear (name, type, notes, user)
      VALUES (?, ?, ?, ?)
    `

    const [result] = await connection.query<ResultSetHeader>(query, [
      name,
      type,
      notes,
      user
    ])

    res.json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router