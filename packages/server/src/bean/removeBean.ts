// Delete Bean API
// Removes a bean and its palette from the DB.
// bean_palette deletes automatically via ON DELETE CASCADE.
// CREATED: 08APR2026
// By: Aidan Boissonneault

import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.delete('/:id', requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user.id
		const beanId = Number(req.params.id)

		if (isNaN(beanId)) {
			res.status(400).json({ error: 'Invalid bean id' })
			return
		}

		// Delete brews for this bean first
		await connection.query('DELETE FROM brews WHERE bean_id = ? AND user = ?', [beanId, userId])

		// Then delete the bean
		const [result] = await connection.query<ResultSetHeader>(
			'DELETE FROM beans WHERE id = ? AND user = ?',
			[beanId, userId],
		)

		if (result.affectedRows === 0) {
			res.status(404).json({ error: 'Bean not found' })
			return
		}

		res.json({ success: true })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: (err as Error).message })
	}
})

export default router
