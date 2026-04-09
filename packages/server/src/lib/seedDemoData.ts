import type { Pool } from 'mysql2/promise'

export async function seedDemoData(pool: Pool, userId: string) {
	const conn = await pool.getConnection()

	try {
		await conn.beginTransaction()

		// column: user (VARCHAR 50)
		const beans = [
			{
				name: 'Ethiopian Natural',
				roaster: 'Local Roaster',
				origin: 'Ethiopia',
				variety: 'Heirloom',
				process: 'Natural',
				flavour_summary: 'Blueberry, Dark Chocolate, Jasmine',
				roast_level: 18,
				elevation_m: '2100',
				status: 'fresh',
			},
			{
				name: 'Colombian Washed',
				roaster: 'Local Roaster',
				origin: 'Colombia',
				variety: 'Caturra',
				process: 'Washed',
				flavour_summary: 'Brown Sugar, Almond, Orange Zest',
				roast_level: 38,
				elevation_m: '1700',
				status: 'fresh',
			},
			{
				name: 'Colombian Gesha',
				roaster: 'Local Roaster',
				origin: 'Colombia',
				variety: 'Gesha',
				process: 'Anaerobic Washed',
				flavour_summary: 'Lychee, Passionfruit, White Tea',
				roast_level: 14,
				elevation_m: '1950',
				status: 'frozen',
			},
			{
				name: 'Ethiopian Washed',
				roaster: 'Local Roaster',
				origin: 'Ethiopia',
				variety: 'Heirloom',
				process: 'Washed',
				flavour_summary: 'Lemon Curd, Green Tea, Bergamot',
				roast_level: 20,
				elevation_m: '1980',
				status: 'finished',
			},
		]

		const beanIds: number[] = []
		for (const bean of beans) {
			const [result] = await conn.execute<any>(
				`INSERT INTO beans (user, name, roaster, origin, variety, process, flavour_summary, roast_level, elevation_m, status)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[userId, bean.name, bean.roaster, bean.origin, bean.variety, bean.process, bean.flavour_summary, bean.roast_level, bean.elevation_m, bean.status],
			)
			beanIds.push(result.insertId)
		}

		const palettes = [
			{ pri: 320, sec: 270, acc: 30  }, // blueberry / chocolate / amber
			{ pri: 35,  sec: 25,  acc: 200 }, // brown sugar / almond / citrus
			{ pri: 160, sec: 80,  acc: 50  }, // lychee-green / gold / passionfruit
			{ pri: 75,  sec: 180, acc: 55  }, // green tea / bergamot / lemon
		]

		for (let i = 0; i < beanIds.length; i++) {
			const p = palettes[i]
			const beanId = beanIds[i]
			if (!p || beanId === undefined) continue
			await conn.execute(
				`INSERT INTO bean_palette (bean_id, pri_hue, sec_hue, acc_hue) VALUES (?, ?, ?, ?)`,
				[beanId, p.pri, p.sec, p.acc],
			)
		}

		// column: user (VARCHAR 50)
		const gear = [
			{ name: 'Burr Grinder',      type: 'grinder',          notes: 'Hand or electric burr grinder for filter.' },   // index 0
			{ name: 'Espresso Grinder',  type: 'grinder',          notes: 'Fine-grind capable. Used for espresso.' },       // index 1
			{ name: 'Gooseneck Kettle',  type: 'kettle',           notes: 'Variable temp. Set to 93°C for most brews.' },   // index 2
			{ name: 'Brew Scale',        type: 'scale',            notes: '0.1g precision. Used for all brews.' },          // index 3
			{ name: 'V60 Dripper',       type: 'brewer',           notes: 'Pour-over dripper with paper filters.' },        // index 4
			{ name: 'Immersion Dripper', type: 'brewer',           notes: 'Switch-style. Used with flat-bottom filters.' }, // index 5
			{ name: 'Espresso Machine',  type: 'espresso_machine', notes: 'Manual or semi-auto. Preheated before use.' },   // index 6
		]

		const gearIds: number[] = []
		for (const g of gear) {
			const [result] = await conn.execute<any>(
				`INSERT INTO gear (name, type, notes, user) VALUES (?, ?, ?, ?)`,
				[g.name, g.type, g.notes, userId],
			)
			gearIds.push(result.insertId)
		}

		// Seeded at signup by seedDefaultRecipes.
		const [recipeRows] = await conn.query<any[]>(
			`SELECT id FROM recipes WHERE user = ? ORDER BY id LIMIT 5`,
			[userId],
		)

		const recipeIds = recipeRows.map((r: any) => r.id as number)

		if (recipeIds.length < 4) {
			await conn.commit()
			console.warn(`Skipping brews - only ${recipeIds.length} recipes found for user: ${userId}`)
			return
		}

		// column: user_id (VARCHAR 50)
		// gear index ref: 0=filter grinder, 1=espresso grinder, 4=V60, 5=immersion, 6=espresso machine
		// recipe index ref: 0=4-6, 1=Quan, 2=Hoffman, 3=Espresso, 4=Immersion
		const brews = [
			// Ethiopian Natural - V60 4-6
			{ bean: 0, recipe: 0, brewer: 4, grinder: 0, grind: 24.0, dose: 20.0, yield: 300.0, time: 210, closeness: 'success', profile: 52.0, body: 45.0, notes: 'Blueberry jam on the nose. Sweet and clean.',          brewed_at: '2025-03-01 08:12:00' },
			{ bean: 0, recipe: 0, brewer: 4, grinder: 0, grind: 22.0, dose: 20.0, yield: 300.0, time: 198, closeness: 'close',   profile: 38.0, body: 40.0, notes: 'Slightly astringent. Grind may be too fine.',           brewed_at: '2025-03-03 08:30:00' },

			// Colombian Washed - Espresso
			{ bean: 1, recipe: 3, brewer: 6, grinder: 1, grind: 2.2,  dose: 18.0, yield: 36.0,  time: 28,  closeness: 'success', profile: 50.0, body: 65.0, notes: 'Balanced, nutty, brown sugar finish.',                 brewed_at: '2025-03-12 08:00:00' },
			{ bean: 1, recipe: 3, brewer: 6, grinder: 1, grind: 2.0,  dose: 18.0, yield: 36.0,  time: 24,  closeness: 'miss',    profile: 30.0, body: 70.0, notes: 'Under-extracted. Sour and thin. Grind finer.',          brewed_at: '2025-03-13 08:05:00' },
			{ bean: 1, recipe: 3, brewer: 6, grinder: 1, grind: 2.4,  dose: 18.0, yield: 38.0,  time: 32,  closeness: 'close',   profile: 55.0, body: 68.0, notes: 'Slightly bitter on the tail but body is great.',        brewed_at: '2025-03-14 07:58:00' },

			// Colombian Gesha - Immersion
			{ bean: 2, recipe: 4, brewer: 5, grinder: 0, grind: 25.0, dose: 15.0, yield: 250.0, time: 360, closeness: 'success', profile: 72.0, body: 42.0, notes: 'Wild. Lychee and white grape. Immersion works great.', brewed_at: '2025-03-10 07:55:00' },

			// Ethiopian Washed - V60 4-6
			{ bean: 3, recipe: 0, brewer: 4, grinder: 0, grind: 23.0, dose: 20.0, yield: 300.0, time: 202, closeness: 'success', profile: 65.0, body: 36.0, notes: 'Lemon curd and bergamot. Very clean.',                 brewed_at: '2025-02-20 08:20:00' },
			{ bean: 3, recipe: 0, brewer: 4, grinder: 0, grind: 21.0, dose: 20.0, yield: 300.0, time: 190, closeness: 'close',   profile: 55.0, body: 34.0, notes: 'Green and grassy. Needs more rest off roast.',          brewed_at: '2025-02-15 08:10:00' },
		]

		for (const b of brews) {
			const beanId    = beanIds[b.bean]
			const recipeId  = recipeIds[b.recipe]
			const brewerId  = gearIds[b.brewer]
			const grinderId = gearIds[b.grinder]

			if (beanId === undefined || recipeId === undefined || brewerId === undefined || grinderId === undefined) continue

			await conn.execute(
				`INSERT INTO brews (user, bean_id, recipe_id, brewer_id, grinder_id, grind_size, dose_g, yield_g, time_seconds, closeness, profile, body, notes, brewed_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[userId, beanId, recipeId, brewerId, grinderId, b.grind, b.dose, b.yield, b.time, b.closeness, b.profile, b.body, b.notes, b.brewed_at],
			)
		}

		await conn.commit()
		console.log(`Demo data seeded for user: ${userId}`)
	} catch (err) {
		await conn.rollback()
		console.error('Failed to seed demo data:', err)
		throw err
	} finally {
		conn.release()
	}
}
