// get recipes API
// returns recipes from DB that match the username
// with steps linked.
// CREATED: 27MAR2026
// LAST EDITED: 27MAR2026
// By: Aidan Boissonneault

import { Router } from 'express'
import connection from "../db/connection.js"

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
        r.id,
        r.name,
        r.brew_method,
        r.created_at,
        rs.id AS step_id,
        rs.step_order,
        rs.action,
        rs.duration_seconds
      FROM recipes r
      LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id
      WHERE r.user = ?
      ORDER BY r.id, rs.step_order;
    `

    const [rows] = await connection.query(query, [Number(userId)])

    // Group steps under their recipe
    const recipeMap = new Map()
    for (const row of rows as any[]) {
      if (!recipeMap.has(row.id)) {
        recipeMap.set(row.id, {
          id: row.id,
          name: row.name,
          brew_method: row.brew_method,
          created_at: row.created_at,
          steps: [],
        })
      }
      if (row.step_id) {
        recipeMap.get(row.id).steps.push({
          id: row.step_id,
          step_order: row.step_order,
          action: row.action,
          duration_seconds: row.duration_seconds,
        })
      }
    }

    res.json(Array.from(recipeMap.values()))
  } catch (err) {
    const error = err as Error
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router