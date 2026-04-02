// Add Beans API
// Adds beans to the sql database, and creates the colours.
// CREATED: 01APR2026
// BY: Aidan Boissonneault

import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'
import { type AddBeanForm } from '@terva/shared'
import { getFlavourHue } from '@terva/shared'

const router = Router()

// insert bean into
router.post<{}, { id: number } | { error: string }, AddBeanForm & { user: string }>(
	'/',
	async (req, res) => {
		try {
			const {
				user,
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

			const query = `
      INSERT INTO beans (
        user,
        name,
        roaster,
        origin,
        variety,
        process,
        elevation_m,
        roast_level,
        status,
        flavour_summary
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

			const [result] = await connection.query<ResultSetHeader>(query, [
				user,
				name,
				roaster,
				origin,
				variety,
				process,
				elevationM,
				roastLevel,
				state,
				flavourNotes,
			])

			// stores the ID of the returned bean
			const beanId = result.insertId

			// split the flavour notes
			var flavourNote: string[] | string = (flavourNotes ?? '')
				.split(',')
				.map((note: string) => note.trim())

			// if splitting failed, its possible the user seperated with spaces.
			// in that case, split by spaces.
			if (flavourNote.length === 1 && flavourNote[0])
				flavourNote = (flavourNotes ?? '').split(' ').map((note: string) => note.trim())

			// Build hue list from flavour notes
			const flavourHues: number[] = []

			for (const note of flavourNote) {
				const hue = getFlavourHue(note)
				if (hue !== null) {
					flavourHues.push(hue)
				}
			}

			// correct lists smaller than 3 to be equal to 3
			while (flavourHues.length < 3) {
				if (flavourHues.length === 0) flavourHues.push(10)
				const firstHue = flavourHues[flavourHues.length - 1]
				if (firstHue !== undefined) flavourHues.push(firstHue)
			}

			const colourQuery = `
				INSERT INTO bean_palette (
					bean_id,
					pri_hue,
					sec_hue,
					acc_hue
				)
				VALUES (?, ?, ?, ?)
			`

			// add to DB
			const [resultColour] = await connection.query<ResultSetHeader>(colourQuery, [
				beanId,
				flavourHues[0],
				flavourHues[1],
				flavourHues[2],
			])

			res.json({ id: beanId })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: (err as Error).message })
		}
	},
)

export default router
