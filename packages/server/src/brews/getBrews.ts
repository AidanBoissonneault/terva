import { Router } from 'express'
import connection from '../db/connection.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
	try {
		const { beanId } = req.query
		const userId = res.locals.user.id

		if (!userId) {
			res.status(400).json({ error: 'userId is required' })
			return
		}

		const query = `
    SELECT
			id,
			bean_id AS beanId,
			recipe_id AS recipeId,
			brewer_id AS brewerId,
			closeness,
			profile,
			body,
			grinder_id AS grinderId,
			grind_size AS grindSize,
			dose_g AS doseG,
			yield_g AS yieldG,
			time_seconds,
			notes,
			status,
			brewed_at AS brewedAt
		FROM brews
		WHERE user = ?
		AND bean_id = ?
		ORDER BY brewed_at DESC;
  `
		const [rows] = await connection.query(query, [userId, beanId])
		res.json(rows)
	} catch (err) {
		const error = err as Error
		console.log(error)
		res.status(500).json({ error: error.message })
	}
})

export default router
