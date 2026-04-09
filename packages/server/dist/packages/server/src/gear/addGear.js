import { Router } from 'express';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, type, notes } = req.body;
        const userId = res.locals.user.id;
        const query = `
      INSERT INTO gear (name, type, notes, user)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await connection.query(query, [
            name,
            type,
            notes,
            userId
        ]);
        res.json({ id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=addGear.js.map