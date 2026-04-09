// Delete Profile API
// Deletes a users profile from the database
// CREATED: 08APR2026
// By: Aidan Boissonneault
import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.delete('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        // Delete app data - foreign keys cascade from schema
        await connection.query('DELETE FROM brews WHERE user = ?', [userId]);
        await connection.query('DELETE FROM beans WHERE user = ?', [userId]);
        await connection.query('DELETE FROM gear WHERE user = ?', [userId]);
        await connection.query('DELETE FROM recipes WHERE user = ?', [userId]);
        // Delete the BetterAuth user - this also removes sessions/accounts
        await connection.query('DELETE FROM user WHERE id = ?', [userId]);
        res.json({ success: true });
    }
    catch (err) {
        const error = err;
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=removeProfile.js.map