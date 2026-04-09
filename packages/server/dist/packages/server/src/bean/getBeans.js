import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const query = `
    SELECT
      b.id,
      b.name,
      b.roaster,
      b.origin,
      b.variety,
      b.process,
      b.roast_level AS roastLevel,
      b.elevation_m AS elevationM,
      b.status AS state,
      b.created_at,
      b.flavour_summary AS flavourNotes,

      -- Primary note
      bp.pri_hue,

      -- Secondary note
      bp.sec_hue,

      -- Accent note
      bp.acc_hue

    FROM beans b
    LEFT JOIN bean_palette bp ON bp.bean_id = b.id
    WHERE b.user = ?
    ORDER BY b.last_used DESC;
    `;
        const [rows] = await connection.query(query, [userId]);
        res.json(rows);
    }
    catch (err) {
        const error = err;
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=getBeans.js.map