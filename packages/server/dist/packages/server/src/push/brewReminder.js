import webpush from 'web-push';
import connection from '../db/connection.js';
export async function sendBrewReminders() {
    try {
        const [staleBrews] = await connection.query(`SELECT b.id, b.user
       FROM brews b
       WHERE b.status = 'in_progress'
         AND b.brewed_at < NOW() - INTERVAL 1 MINUTE
         AND b.reminder_sent = FALSE`);
        for (const brew of staleBrews) {
            const [subs] = await connection.query(`SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?`, [brew.user]);
            for (const sub of subs) {
                try {
                    await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify({
                        title: 'Still brewing?',
                        body: "Your brew has been in progress for over an hour. Tap to finish it.",
                        icon: '/apple-touch-icon.png',
                        url: '/',
                    }));
                }
                catch (err) {
                    // Subscription expired or invalid — clean it up
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await connection
                            .query(`DELETE FROM push_subscriptions WHERE endpoint = ?`, [sub.endpoint])
                            .catch(console.error);
                    }
                }
            }
            await connection.query(`UPDATE brews SET reminder_sent = TRUE WHERE id = ?`, [brew.id]);
        }
    }
    catch (err) {
        console.error('Brew reminder error:', err);
    }
}
export function startBrewReminderScheduler() {
    // Check every 5 minutes
    setInterval(sendBrewReminders, 5 * 60 * 1000);
    // Also run once shortly after startup to catch any missed reminders
    setTimeout(sendBrewReminders, 30 * 1000);
}
//# sourceMappingURL=brewReminder.js.map