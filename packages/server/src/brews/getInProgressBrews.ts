import { Router } from 'express'
import connection from '../db/connection.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.get('/inprogress', requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user.id

		const query = `
      SELECT
        b.id,
        b.bean_id       AS beanId,
        b.recipe_id     AS recipeId,
        b.brewer_id     AS brewerId,
        b.grinder_id    AS grinderId,
        b.grind_size    AS grindSize,
        b.dose_g        AS doseG,
        b.yield_g       AS yieldG,
        b.time_seconds,
        b.notes,
        b.status,
        beans.name      AS beanName,
        beans.roaster   AS beanRoaster
      FROM brews b
      JOIN beans ON beans.id = b.bean_id
      WHERE b.user = ?
        AND b.status = 'in_progress'
      ORDER BY b.bean_id, b.brewed_at DESC
    `

		const [rows] = await connection.query(query, [userId])
		res.json(rows)
	} catch (err) {
		const error = err as Error
		console.error(error)
		res.status(500).json({ error: error.message })
	}
})

export default router
