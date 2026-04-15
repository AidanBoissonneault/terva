export async function seedDefaultRecipes(pool, userId) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const recipes = [
            {
                name: "Hoffman 1-Cup V60",
                brew_method: "V60",
                default_dose_g: 15,
                steps: [
                    { type: "setup" },
                    { type: "grind" },
                    { type: "bloom", action: "Bloom - 2× dose", duration_seconds: 45, water_g: 30 },
                    { type: "pour", action: "Pour to 60%", duration_seconds: 30, water_g: 120 },
                    { type: "pour", action: "Pour to total", duration_seconds: 30, water_g: 130 },
                    { type: "agitate", action: "Swirl gently", duration_seconds: 10 },
                    { type: "drawdown", duration_seconds: 60 },
                ],
            },
            {
                name: "Quan-Style Percolation",
                brew_method: "V60",
                default_dose_g: 18,
                steps: [
                    { type: "setup" },
                    { type: "grind" },
                    { type: "bloom", action: "Bloom - 3× dose", duration_seconds: 50, water_g: 54 },
                    { type: "pour", action: "To 40%", duration_seconds: 20, water_g: 66 },
                    { type: "pour", action: "To 70%", duration_seconds: 20, water_g: 90 },
                    { type: "pour", action: "To 100%", duration_seconds: 20, water_g: 90 },
                    { type: "drawdown", duration_seconds: 60 },
                ],
            },
            {
                name: "4-6 Method",
                brew_method: "V60",
                default_dose_g: 20,
                steps: [
                    { type: "setup" },
                    { type: "grind" },
                    { type: "bloom", action: "First 50g", duration_seconds: 45, water_g: 50 },
                    { type: "pour", action: "To 150g", duration_seconds: 40, water_g: 100 },
                    { type: "pour", action: "To 200g", duration_seconds: 40, water_g: 50 },
                    { type: "pour", action: "To 250g", duration_seconds: 40, water_g: 50 },
                    { type: "pour", action: "To 300g", duration_seconds: 40, water_g: 50 },
                    { type: "drawdown", duration_seconds: 60 },
                ],
            },
            {
                name: "Standard Espresso",
                brew_method: "Espresso",
                default_dose_g: 18,
                steps: [
                    { type: "setup" },
                    { type: "grind" },
                    { type: "agitate", action: "Distribute", duration_seconds: 10 },
                    { type: "agitate", action: "Tamp", duration_seconds: 10 },
                    { type: "preheat", action: "Pre-infuse", duration_seconds: 10, water_g: 0 },
                    { type: "pour", action: "Pull shot (2× yield)", duration_seconds: 30, water_g: 36 },
                    { type: "wait", action: "Rest & taste", duration_seconds: 20 },
                ],
            },
            {
                name: "Immersion / Steep & Release",
                brew_method: "Switch / Origami",
                default_dose_g: 20,
                steps: [
                    { type: "setup" },
                    { type: "grind" },
                    { type: "pour", action: "Saturate grounds", duration_seconds: 10, water_g: 50 },
                    { type: "pour", action: "Fill to total", duration_seconds: 20, water_g: 250 },
                    { type: "wait", action: "Steep", duration_seconds: 240 },
                    { type: "drawdown", action: "Release", duration_seconds: 90 },
                ],
            },
        ];
        for (const recipe of recipes) {
            const [result] = await conn.execute(`INSERT INTO recipes (name, brew_method, default_dose_g, user)
         VALUES (?, ?, ?, ?)`, [recipe.name, recipe.brew_method, recipe.default_dose_g, userId]);
            const recipeId = result.insertId;
            for (const [i, step] of recipe.steps.entries()) {
                await conn.execute(`INSERT INTO recipe_steps
            (recipe_id, step_order, type, action, duration_seconds, water_g)
           VALUES (?, ?, ?, ?, ?, ?)`, [
                    recipeId,
                    i + 1,
                    step.type,
                    step.action ?? null,
                    step.duration_seconds ?? null,
                    step.water_g ?? null,
                ]);
            }
        }
        await conn.commit();
    }
    catch (err) {
        await conn.rollback();
        console.error("Failed to seed default recipes for user:", userId, err);
    }
    finally {
        conn.release();
    }
}
//# sourceMappingURL=seedDefaultRecipes.js.map