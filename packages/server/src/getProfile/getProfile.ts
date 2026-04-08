// Get Profile API
// Returns user info and brew stats for the profile screen.
// CREATED: 07APR2026
// By: Aidan Boissonneault

import { Router } from 'express'
import connection from '../db/connection.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user.id
		const user = res.locals.user

		// ── Closeness counts ───────────────────────────────────────────────────
		const [closenessRows] = await connection.query<any[]>(`
			SELECT
				closeness,
				COUNT(*) AS count
			FROM brews
			WHERE user = ?
			GROUP BY closeness
		`, [userId])

		const closeness = { success: 0, close: 0, miss: 0 }
		for (const row of closenessRows) {
			if (row.closeness in closeness) {
				closeness[row.closeness as keyof typeof closeness] = Number(row.count)
			}
		}
		const totalBrews = closeness.success + closeness.close + closeness.miss

		// ── Total dose ─────────────────────────────────────────────────────────
		const [[doseRow]] = await connection.query<any[]>(`
			SELECT COALESCE(SUM(dose_g), 0) AS totalDoseG
			FROM brews
			WHERE user = ?
		`, [userId])

		// ── Favourite brew method ──────────────────────────────────────────────
		const [[methodRow]] = await connection.query<any[]>(`
			SELECT
				r.brew_method AS brewMethod,
				COUNT(*) AS count
			FROM brews b
			JOIN recipes r ON r.id = b.recipe_id
			WHERE b.user = ?
			GROUP BY r.brew_method
			ORDER BY count DESC
			LIMIT 1
		`, [userId])

		// ── Favourite bean ─────────────────────────────────────────────────────
		const [[beanRow]] = await connection.query<any[]>(`
			SELECT
				bn.name,
				bn.roaster,
				COUNT(*) AS count
			FROM brews b
			JOIN beans bn ON bn.id = b.bean_id
			WHERE b.user = ?
			GROUP BY b.bean_id, bn.name, bn.roaster
			ORDER BY count DESC
			LIMIT 1
		`, [userId])

		// ── Favourite grinder ──────────────────────────────────────────────────
		const [[grinderRow]] = await connection.query<any[]>(`
			SELECT
				g.name,
				COUNT(*) AS count
			FROM brews b
			JOIN gear g ON g.id = b.grinder_id
			WHERE b.user = ?
			AND b.grinder_id IS NOT NULL
			GROUP BY b.grinder_id, g.name
			ORDER BY count DESC
			LIMIT 1
		`, [userId])

		// ── Favourite brewer ───────────────────────────────────────────────────
		const [[brewerRow]] = await connection.query<any[]>(`
			SELECT
				g.name,
				COUNT(*) AS count
			FROM brews b
			JOIN gear g ON g.id = b.brewer_id
			WHERE b.user = ?
			AND b.brewer_id IS NOT NULL
			GROUP BY b.brewer_id, g.name
			ORDER BY count DESC
			LIMIT 1
		`, [userId])

		res.json({
			name: user.name,
			email: user.email,
			memberSince: user.createdAt,
			totalBrews,
			closeness,
			totalDoseG: Math.round(Number(doseRow?.totalDoseG ?? 0)),
			favouriteMethod: methodRow?.brewMethod ?? null,
			favouriteMethodCount: Number(methodRow?.count ?? 0),
			favouriteBean: beanRow?.name ?? null,
			favouriteBeanRoaster: beanRow?.roaster ?? null,
			favouriteGrinder: grinderRow?.name ?? null,
			favouriteGrinderCount: Number(grinderRow?.count ?? 0),
			favouriteBrewer: brewerRow?.name ?? null,
			favouriteBrewerCount: Number(brewerRow?.count ?? 0),
		})

	} catch (err) {
		const error = err as Error
		console.error(error)
		res.status(500).json({ error: error.message })
	}
})

// ── Delete account ─────────────────────────────────────────────────────────────
router.delete('/', requireAuth, async (req, res) => {
	try {
		const userId = res.locals.user.id

		// Delete app data — foreign keys cascade from schema
		await connection.query('DELETE FROM brews WHERE user = ?', [userId])
		await connection.query('DELETE FROM beans WHERE user = ?', [userId])
		await connection.query('DELETE FROM gear WHERE user = ?', [userId])
		await connection.query('DELETE FROM recipes WHERE user = ?', [userId])

		// Delete the BetterAuth user — this also removes sessions/accounts
		await connection.query('DELETE FROM user WHERE id = ?', [userId])

		res.json({ success: true })
	} catch (err) {
		const error = err as Error
		console.error(error)
		res.status(500).json({ error: error.message })
	}
})

export default router
