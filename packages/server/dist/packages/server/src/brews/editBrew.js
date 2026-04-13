// Edit brew API
// receives data from the end brew form, and updates the previous.
// CREATED: 12APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const brewId = req.params.id;
        const { grindSize, grinderId, brewerId, beanId, doseG, yieldG, recipeId, time_seconds, closeness, profile, body, notes, status, } = req.body;
        const grinderIdOrNull = grinderId === -1 ? null : grinderId;
        const [result] = await connection.query(`UPDATE brews SET
                bean_id = ?,
                recipe_id = ?,
                brewer_id = ?,
                closeness = ?,
                profile = ?,
                body = ?,
                grinder_id = ?,
                grind_size = ?,
                dose_g = ?,
                yield_g = ?,
                time_seconds = ?,
                notes = ?,
                status = ?
            WHERE id = ? AND user = ?`, [
            beanId,
            recipeId,
            brewerId,
            closeness,
            profile,
            body,
            grinderIdOrNull,
            grindSize,
            doseG,
            yieldG,
            time_seconds,
            notes,
            status,
            brewId,
            userId,
        ]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Brew not found' });
            return;
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=editBrew.js.map