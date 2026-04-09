// Edit Bean API
// Receives an updated bean form and patches the bean
// and its colour palette in the DB.
// CREATED: 08APR2026
// By: Aidan Boissonneault

import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'
import { type AddBeanForm, getFlavourHue } from '@terva/shared'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.put<{ id: string }, { id: number } | { error: string }, AddBeanForm>(
	'/:id',
	requireAuth,
	async (req, res) => {
		try {
			const userId = res.locals.user.id
			const beanId = Number(req.params.id)

			if (isNaN(beanId)) {
				res.status(400).json({ error: 'Invalid bean id' })
				return
			}

			const {
				name,
				roaster,
				origin,
				variety,
				process,
				elevationM,
				roastLevel,
				state,
				flavourNotes,
			} = req.body

			// Verify the bean belongs to this user before editing
			const [[existing]] = await connection.query<any[]>(
				'SELECT id FROM beans WHERE id = ? AND user = ?',
				[beanId, userId],
			)

			if (!existing) {
				res.status(404).json({ error: 'Bean not found' })
				return
			}

			// Update the bean row
			await connection.query<ResultSetHeader>(
				`UPDATE beans SET
					name = ?,
					roaster = ?,
					origin = ?,
					variety = ?,
					process = ?,
					elevation_m = ?,
					roast_level = ?,
					status = ?,
					flavour_summary = ?
				WHERE id = ?
				AND user = ?`,
				[
					name,
					roaster ?? null,
					origin ?? null,
					variety ?? null,
					process ?? null,
					elevationM ?? null,
					roastLevel ?? null,
					state,
					flavourNotes ?? null,
					beanId,
					userId,
				],
			)

			// Recalculate flavour hues from the updated notes
			let flavourNote: string[] = (flavourNotes ?? '').split(',').map((n) => n.trim())

			if (flavourNote.length === 1 && flavourNote[0]) {
				flavourNote = (flavourNotes ?? '').split(' ').map((n) => n.trim())
			}

			const flavourHues: number[] = []

			for (const note of flavourNote) {
				const hue = getFlavourHue(note)
				if (hue !== null) flavourHues.push(hue)
			}

			while (flavourHues.length < 3) {
				if (flavourHues.length === 0) flavourHues.push(10)
				const lastHue = flavourHues[flavourHues.length - 1]
				if (lastHue !== undefined) flavourHues.push(lastHue)
			}

			// Update the palette row (guaranteed to exist from addBean)
			await connection.query<ResultSetHeader>(
				`UPDATE bean_palette SET
					pri_hue = ?,
					sec_hue = ?,
					acc_hue = ?
				WHERE bean_id = ?`,
				[flavourHues[0], flavourHues[1], flavourHues[2], beanId],
			)

			res.json({ id: beanId })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: (err as Error).message })
		}
	},
)

export default router
