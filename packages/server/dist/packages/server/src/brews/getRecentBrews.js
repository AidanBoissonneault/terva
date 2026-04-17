import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.get('/', requireAuth, async (req, res) => {
    try {
        const { beanId } = req.query;
        const userId = res.locals.user.id;
        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }
        const query = `
    SELECT
			b.id,
			b.recipe_id AS recipeId,
			b.time_seconds,
			b.closeness,
			b.profile,
			b.body,
			r.name,
			r.brew_method AS brewMethod,
			b.grinder_id AS grinderId,
			b.brewer_id AS brewerId,
			b.grind_size AS grindSize,
			b.dose_g AS doseG,
			b.yield_g AS yieldG,
			b.bean_id AS beanId
		FROM brews b
		JOIN recipes r ON r.id = b.recipe_id
		JOIN beans bn ON bn.id = b.bean_id
		WHERE b.user = ?
		AND bn.id = ?
		AND b.closeness = 'success'
		AND b.brewed_at = (
			SELECT MAX(b2.brewed_at)
			FROM brews b2
			JOIN recipes r2 ON r2.id = b2.recipe_id
			WHERE b2.user = b.user
			AND b2.bean_id = bn.id
			AND b2.closeness = 'success'
			AND r2.brew_method = r.brew_method
		)
		ORDER BY b.brewed_at DESC
		LIMIT 2;
  `;
        const [rows] = await connection.query(query, [userId, beanId]);
        res.json(rows);
    }
    catch (err) {
        const error = err;
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=getRecentBrews.js.map