// Add brew API
// receives data

import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const {
      grindSize,
      grinderId,
      brewerId,
      beanId,
      doseG,
      yieldG,
      recipeId,
      time_seconds,
      closeness,
      profile,
      body,
      notes,
      user,
    } = req.body

    const query = `
      INSERT INTO brews (
        bean_id,
        user_id,
        recipe_id,
        brewer_id,
        closeness,
        profile,
        body,
        grinder_id,
        grind_size,
        dose_g,
        yield_g,
        time_seconds,
        notes
        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await connection.query<ResultSetHeader>(query, [
      beanId,
      user,
      recipeId,
      brewerId,
      closeness,
      profile,
      body,
      grinderId,
      grindSize,
      doseG,
      yieldG,
      time_seconds,
      notes,
    ])

    res.json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
