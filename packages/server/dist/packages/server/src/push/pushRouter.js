import { Router } from 'express';
import webpush from 'web-push';
import connection from '../db/connection.js';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_MAILTO } = process.env;
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && VAPID_MAILTO) {
    webpush.setVapidDetails(VAPID_MAILTO, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}
router.get('/vapid-public-key', (_req, res) => {
    res.json({ key: VAPID_PUBLIC_KEY ?? null });
});
router.post('/subscribe', requireAuth, async (req, res) => {
    const userId = res.locals.user.id;
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
        res.status(400).json({ error: 'Invalid subscription' });
        return;
    }
    try {
        await connection.query(`INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), p256dh = VALUES(p256dh), auth = VALUES(auth)`, [userId, endpoint, keys.p256dh, keys.auth]);
        res.json({ ok: true });
    }
    catch (err) {
        const error = err;
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
router.delete('/subscribe', requireAuth, async (req, res) => {
    const userId = res.locals.user.id;
    const { endpoint } = req.body;
    if (!endpoint) {
        res.status(400).json({ error: 'Missing endpoint' });
        return;
    }
    try {
        await connection.query(`DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?`, [userId, endpoint]);
        res.json({ ok: true });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=pushRouter.js.map