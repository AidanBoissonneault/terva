import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { seedDemoData } from "../lib/seedDemoData.js";
import connection from "../db/connection.js";
const router = Router();
router.post("/", requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        await seedDemoData(connection, userId);
        res.json({ ok: true });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=seedDemo.js.map