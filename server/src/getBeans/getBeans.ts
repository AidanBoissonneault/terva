import { Router } from 'express'
import connection from '../db/connection.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const query = `
    SELECT
    b.id,
    b.name,
    b.roaster,
    b.origin,
    b.variety,
    b.process,
    b.roast_level,
    b.elevation_m,
    b.status,
    b.created_at,
    b.flavour_summary,

    -- Primary note
    fn_pri.hue       AS pri_hue,

    -- Secondary note
    fn_sec.hue       AS sec_hue,

    -- Accent note
    fn_acc.hue       AS acc_hue

  FROM beans b
  LEFT JOIN bean_palette bp       ON bp.bean_id      = b.id
  LEFT JOIN flavour_note fn_pri   ON fn_pri.id        = bp.pri_note
  LEFT JOIN flavour_note fn_sec   ON fn_sec.id        = bp.sec_note
  LEFT JOIN flavour_note fn_acc   ON fn_acc.id        = bp.acc_note

  WHERE b.user = ?
  ORDER BY b.created_at DESC;
  `
    const [rows] = await connection.query(query, 1)
    res.json(rows)
  } catch (err) {
    const error = err as Error
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router
