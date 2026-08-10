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
{ title: "How was {{bean}}?", body: "Add a quick note while the cup is still fresh in your mind." },
{ title: "Thoughts on {{bean}}?", body: "How did it turn out with your {{method}}?" },
{ title: "How did your {{method}} turn out?", body: "Rate {{bean}} and save what worked." },
{ title: "Happy with that {{method}}?", body: "Log how {{bean}} tasted before you forget." },
{ title: "Worth brewing again?", body: "Save your thoughts on {{bean}} and this {{method}}." },
{ title: "How was that cup?", body: "Add your notes for {{bean}} brewed with {{method}}." },
{ title: "{{bean}} tasting good?", body: "Give this {{method}} brew a quick rating." },
{ title: "Did you nail the {{method}}?", body: "Save how {{bean}} turned out this time." },
{ title: "One for the recipe book?", body: "Rate your {{method}} brew of the {{bean}}." },
{ title: "Cup finished?", body: "Log your thoughts on {{bean}} while they’re fresh." },
]

// Generic fallback
const genericMessages = [
{ title: "How was the coffee?", body: "Add a quick rating while it’s still fresh in your mind." },
{ title: "How did that cup turn out?", body: "Save a few notes for next time." },
{ title: "Worth brewing again?", body: "Log what worked while you still remember." },
{ title: "Cup finished? ☕", body: "Wrap up your brew with a quick rating." },
{ title: "Any final thoughts?", body: "Save your brew notes before you move on." },
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
