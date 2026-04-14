// get recipes API
// Returns recipes from DB that match the user, with steps linked.
// CREATED: 27MAR2026
// LAST EDITED: 13APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }
        const query = `
      SELECT
        r.id,
        r.name,
        r.brew_method,
        r.default_dose_g,
        r.created_at,
        rs.id            AS step_id,
        rs.step_order,
        rs.type,
        rs.action,
        rs.duration_seconds,
        rs.water_g
      FROM recipes r
      LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id
      WHERE r.user = ?
      ORDER BY r.id, rs.step_order;
    `;
        const [rows] = await connection.query(query, [userId]);
        const recipeMap = new Map();
        for (const row of rows) {
            if (!recipeMap.has(row.id)) {
                recipeMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    brewMethod: row.brew_method,
                    defaultDoseG: row.default_dose_g ?? 0,
                    createdAt: row.created_at,
                    steps: [],
                });
            }
            if (row.step_id) {
                recipeMap.get(row.id).steps.push({
                    id: row.step_id,
                    stepOrder: row.step_order,
                    type: row.type ?? 'wait',
                    action: row.action ?? null,
                    duration: row.duration_seconds ?? null,
                    waterG: row.water_g ?? null,
                });
            }
        }
        res.json(Array.from(recipeMap.values()));
    }
    catch (err) {
        const error = err;
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=getRecipes.js.map