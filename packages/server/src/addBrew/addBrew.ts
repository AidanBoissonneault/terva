// Add brew API
// receives data from the end brew form
// and logs to DB
// CREATED: 31MAR2026
// By: Aidan Boissonneault

import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
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
    } = req.body

    const userId = res.locals.user.id

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
      userId,
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
