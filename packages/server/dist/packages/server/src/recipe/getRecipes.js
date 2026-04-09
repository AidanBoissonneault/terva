// get recipes API
// returns recipes from DB that match the username
// with steps linked.
// CREATED: 27MAR2026
// LAST EDITED: 27MAR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from "../db/connection.js";
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
        r.created_at,
        rs.id AS step_id,
        rs.step_order,
        rs.action,
        rs.duration_seconds
      FROM recipes r
      LEFT JOIN recipe_steps rs ON rs.recipe_id = r.id
      WHERE r.user = ?
      ORDER BY r.id, rs.step_order;
    `;
        const [rows] = await connection.query(query, [userId]);
        // Group steps under their recipe
        const recipeMap = new Map();
        for (const row of rows) {
            if (!recipeMap.has(row.id)) {
                recipeMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    brewMethod: row.brew_method,
                    createdAt: row.created_at,
                    steps: [],
                });
            }
            if (row.step_id) {
                recipeMap.get(row.id).steps.push({
                    id: row.step_id,
                    stepOrder: row.step_order,
                    action: row.action,
                    duration: row.duration_seconds,
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