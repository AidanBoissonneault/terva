// Edit recipe API route
// Replaces a recipe's name, brew method, default dose, and steps.
// Steps are deleted and re-inserted to keep ordering clean.
// CREATED: 12APR2026
// LAST EDITED: 13APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const TAP_TYPES = ['setup', 'grind'];
const WATER_TYPES = ['bloom', 'pour', 'preheat'];
const router = Router();
router.put('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { id, name, brewMethod, defaultDoseG, steps } = req.body;
        if (!id || !name || !brewMethod) {
            res.status(400).json({ error: 'id, name and brewMethod are required' });
            return;
        }
        if (!Array.isArray(steps) || steps.length === 0) {
            res.status(400).json({ error: 'at least one step is required' });
            return;
        }
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.execute('UPDATE recipes SET name = ?, brew_method = ?, default_dose_g = ? WHERE id = ? AND user = ?', [name, brewMethod, defaultDoseG ?? 0, id, userId]);
            if (result.affectedRows === 0) {
                await conn.rollback();
                res.status(404).json({ error: 'Recipe not found' });
                return;
            }
            await conn.execute('DELETE FROM recipe_steps WHERE recipe_id = ?', [id]);
            for (const [i, step] of steps.entries()) {
                const isTap = TAP_TYPES.includes(step.type);
                const hasWater = WATER_TYPES.includes(step.type);
                const duration = isTap ? null : (step.duration ?? 30);
                const waterG = hasWater ? (step.waterG ?? null) : null;
                const action = step.action?.trim() || null;
                await conn.execute(`INSERT INTO recipe_steps
					  (recipe_id, step_order, type, action, duration_seconds, water_g)
					  VALUES (?, ?, ?, ?, ?, ?)`, [id, i + 1, step.type ?? 'wait', action, duration, waterG]);
            }
            await conn.commit();
            res.json({ success: true });
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
    catch (err) {
        const error = err;
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=editRecipe.js.map