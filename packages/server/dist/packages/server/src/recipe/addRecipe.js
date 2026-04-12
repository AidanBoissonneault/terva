// Add recipe API route
// Inserts a recipe + its ordered steps into the database.
// CREATED: 11APR2026
// LAST EDITED: 11APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }
        const { name, brewMethod, steps } = req.body;
        if (!name || !brewMethod) {
            res.status(400).json({ error: 'name and brewMethod are required' });
            return;
        }
        if (!Array.isArray(steps) || steps.length === 0) {
            res.status(400).json({ error: 'at least one step is required' });
            return;
        }
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.execute('INSERT INTO recipes (name, brew_method, user) VALUES (?, ?, ?)', [name, brewMethod, userId]);
            const recipeId = result.insertId;
            for (const [i, step] of steps.entries()) {
                await conn.execute('INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES (?, ?, ?, ?)', [recipeId, i + 1, step.action, step.duration ?? 0]);
            }
            await conn.commit();
            res.json({ id: recipeId });
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
//# sourceMappingURL=addRecipe.js.map