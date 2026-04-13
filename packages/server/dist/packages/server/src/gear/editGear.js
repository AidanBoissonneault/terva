// Edit gear API route
// Updates name, type, and notes for a gear item owned by the current user.
// CREATED: 12APR2026
// LAST EDITED: 12APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.put('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { id, name, type, notes } = req.body;
        if (!id || !name || !type) {
            res.status(400).json({ error: 'id, name and type are required' });
            return;
        }
        const [result] = await connection.query('UPDATE gear SET name = ?, type = ?, notes = ? WHERE id = ? AND user = ?', [name, type, notes ?? null, id, userId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Gear not found' });
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
//# sourceMappingURL=editGear.js.map