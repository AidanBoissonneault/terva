// Edit recipe API route
// Replaces a recipe's name, brew method, and steps.
// Steps are deleted and re-inserted to keep ordering clean.
// CREATED: 12APR2026
// LAST EDITED: 12APR2026
// By: Aidan Boissonneault

import { Router } from 'express'
import connection from '../db/connection.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.put('/', requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user.id
		const { id, name, brewMethod, steps } = req.body

		if (!id || !name || !brewMethod) {
			res.status(400).json({ error: 'id, name and brewMethod are required' })
			return
		}

		if (!Array.isArray(steps) || steps.length === 0) {
			res.status(400).json({ error: 'at least one step is required' })
			return
		}

		const conn = await connection.getConnection()
		try {
			await conn.beginTransaction()

			// Verify ownership and update recipe row
			const [result] = await conn.execute<any>(
				'UPDATE recipes SET name = ?, brew_method = ? WHERE id = ? AND user = ?',
				[name, brewMethod, id, userId]
			)

			if (result.affectedRows === 0) {
				await conn.rollback()
				res.status(404).json({ error: 'Recipe not found' })
				return
			}

			// Replace all steps
			await conn.execute('DELETE FROM recipe_steps WHERE recipe_id = ?', [id])

			for (const [i, step] of steps.entries()) {
				await conn.execute(
					'INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES (?, ?, ?, ?)',
					[id, i + 1, step.action, step.duration ?? 0]
				)
			}

			await conn.commit()
			res.json({ success: true })
		} catch (err) {
			await conn.rollback()
			throw err
		} finally {
			conn.release()
		}
	} catch (err) {
		const error = err as Error
		console.error(error)
		res.status(500).json({ error: error.message })
	}
})

export default router
