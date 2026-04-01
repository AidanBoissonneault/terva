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
    bp.pri_hue,

    -- Secondary note
    bp.sec_hue,

    -- Accent note
    bp.acc_hue

  FROM beans b
  LEFT JOIN bean_palette bp       ON bp.bean_id      = b.id

  WHERE b.user = ?
  ORDER BY b.last_used DESC;
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
