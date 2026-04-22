import webpush from 'web-push'
import connection from '../db/connection.js'

interface StaleBrewRow {
	id: number
	user: string
	bean_name: string | null
	brew_method: string | null
	brewer_id: number | null
}

interface PushSubRow {
	endpoint: string
	p256dh: string
	auth: string
}

// Personalized messages
const messages = [
	{ title: "Enjoying the {{bean}}?", body: "How did your {{method}} turn out? Tap to log it." },
	{ title: "{{method}} check ☕", body: "Give your {{bean}} brew a quick rating." },
	{ title: "Final thoughts on {{bean}}?", body: "Lock in your {{method}} results before you forget." },
	{ title: "{{method}} dialed in?", body: "Was that {{bean}} a hit or miss? Record it now." },
	{ title: "How’d the {{bean}} taste?", body: "Capture your {{method}} notes while they’re fresh." },
	{ title: "Good cup of {{bean}}?", body: "Tell us how your {{method}} went." },
	{ title: "Rate that {{method}}", body: "Was your {{bean}} balanced, bitter, or sour?" },
	{ title: "Solid {{bean}} brew?", body: "Track how your {{method}} turned out." },
	{ title: "{{method}} review time", body: "Quickly log how your {{bean}} turned out." },
	{ title: "Done brewing {{bean}}?", body: "Wrap up your {{method}} log in seconds." },
]

// Generic fallback (no brewer)
const genericMessages = [
	{ title: "Enjoy the coffee?", body: "How was your brew? Tap to finish it." },
	{ title: "Quick brew check ☕", body: "Log your brew before you forget." },
	{ title: "How’d it go?", body: "Capture your brew notes while it’s fresh." },
	{ title: "Final thoughts?", body: "Finish logging your brew in one tap." },
	{ title: "Don’t forget ☕", body: "Wrap up your brew log now." },
]

function fillTemplate(str: string, data: { bean?: string; method?: string }) {
	return str
		.replace(/{{bean}}/g, data.bean ?? 'coffee')
		.replace(/{{method}}/g, data.method ?? 'brew')
}

function shortenBean(name?: string | null) {
	if (!name) return 'coffee'
	return name.split(' ').slice(0, 2).join(' ')
}

export async function sendBrewReminders() {
	try {
		const [staleBrews] = await connection.query<any[]>(`
			SELECT
				b.id,
				b.user,
				be.name AS bean_name,
				r.brew_method,
				b.brewer_id
			FROM brews b
			JOIN beans be ON b.bean_id = be.id
			LEFT JOIN recipes r ON b.recipe_id = r.id
			WHERE b.status = 'in_progress'
				AND b.brewed_at < NOW() - INTERVAL 30 MINUTE
				AND b.reminder_sent = FALSE
		`)

		for (const brew of staleBrews as StaleBrewRow[]) {
			const [subs] = await connection.query<any[]>(
				`SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?`,
				[brew.user],
			)

			const hasBrewer = !!brew.brewer_id

			// pick correct message pool
			const pool = hasBrewer ? messages : genericMessages
			const msg = pool[Math.floor(Math.random() * pool.length)]!

			const bean = brew.bean_name ?? 'bean'
			const method = brew.brew_method ?? 'brew'

			const title = hasBrewer
				? fillTemplate(msg.title, { bean, method })
				: msg.title

			const body = hasBrewer
				? fillTemplate(msg.body, { bean, method })
				: msg.body

			for (const sub of subs as PushSubRow[]) {
				try {
					await webpush.sendNotification(
						{
							endpoint: sub.endpoint,
							keys: { p256dh: sub.p256dh, auth: sub.auth },
						},
						JSON.stringify({
							title,
							body,
							icon: '/apple-touch-icon.png',
							url: '/',
						}),
					)
				} catch (err: any) {
					// Clean up dead subscriptions
					if (err.statusCode === 410 || err.statusCode === 404) {
						await connection
							.query(`DELETE FROM push_subscriptions WHERE endpoint = ?`, [sub.endpoint])
							.catch(console.error)
					}
				}
			}

			await connection.query(
				`UPDATE brews SET reminder_sent = TRUE WHERE id = ?`,
				[brew.id],
			)
		}
	} catch (err) {
		console.error('Brew reminder error:', err)
	}
}

export function startBrewReminderScheduler() {
	setInterval(sendBrewReminders, 5 * 60 * 1000)
	setTimeout(sendBrewReminders, 30 * 1000)
}
