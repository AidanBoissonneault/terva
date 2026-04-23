import { Router } from 'express'
import connection from '../db/connection.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.get('/', requireAuth, async (_req, res) => {
  try {
    const userId = res.locals.user.id
    const [[row]] = await connection.query<any[]>(
      'SELECT has_onboarded, onboarding_step FROM user_profile WHERE user_id = ?',
      [userId],
    )
    if (!row) {
      // No profile row — user predates onboarding; treat as completed.
      res.json({ has_onboarded: true, onboarding_step: 5 })
      return
    }
    res.json({
      has_onboarded: Boolean(row.has_onboarded),
      onboarding_step: row.onboarding_step as number,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/', requireAuth, async (req, res) => {
  try {
    const userId = res.locals.user.id
    const { step } = req.body
    if (typeof step !== 'number' || step < 1 || step > 5) {
      res.status(400).json({ error: 'Invalid step' })
      return
    }
    await connection.query(
      'UPDATE user_profile SET onboarding_step = ? WHERE user_id = ?',
      [step, userId],
    )
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/complete', requireAuth, async (_req, res) => {
  try {
    const userId = res.locals.user.id
    await connection.query(
      'UPDATE user_profile SET has_onboarded = TRUE, onboarding_step = 5 WHERE user_id = ?',
      [userId],
    )
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
