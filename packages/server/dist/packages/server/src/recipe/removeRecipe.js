// Remove recipe API route
// Deletes a recipe owned by the current user.
// Steps are deleted automatically via ON DELETE CASCADE.
// CREATED: 12APR2026
// LAST EDITED: 12APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.delete('/', requireAuth, async (req, res) => {
    try {
        const { id } = req.body;
        const userId = res.locals.user.id;
        if (!id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const query = `
      DELETE FROM recipes
      WHERE id = ?
      AND user = ?
    `;
        const [result] = await connection.query(query, [id, userId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Recipe not found' });
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
//# sourceMappingURL=removeRecipe.js.map