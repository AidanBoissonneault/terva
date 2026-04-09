export async function seedDefaultRecipes(pool, userId) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const recipes = [
            {
                name: "Hoffman 1-Cup V60",
                brew_method: "V60",
                steps: [
                    { action: "Bloom — pour 2× dose weight, swirl", duration_seconds: 45 },
                    { action: "Pour in slow circles to 60% total", duration_seconds: 30 },
                    { action: "Pour remainder to target weight", duration_seconds: 30 },
                    { action: "Swirl gently, draw down", duration_seconds: 60 },
                ],
            },
            {
                name: "Quan-Style Percolation",
                brew_method: "V60",
                steps: [
                    { action: "Bloom — pour 3× dose, wait", duration_seconds: 50 },
                    { action: "Pour to 40% total weight", duration_seconds: 20 },
                    { action: "Pour to 70% total weight", duration_seconds: 20 },
                    { action: "Pour to 100% total weight", duration_seconds: 20 },
                    { action: "Draw down", duration_seconds: 60 },
                ],
            },
            {
                name: "4-6 Method",
                brew_method: "V60",
                steps: [
                    { action: "Bloom — pour 50g", duration_seconds: 45 },
                    { action: "Pour to 150g (1st main)", duration_seconds: 40 },
                    { action: "Pour to 200g (2nd main)", duration_seconds: 40 },
                    { action: "Pour to 250g (3rd main)", duration_seconds: 40 },
                    { action: "Pour to 300g (4th main)", duration_seconds: 40 },
                    { action: "Draw down", duration_seconds: 60 },
                ],
            },
            {
                name: "Standard Espresso",
                brew_method: "Espresso",
                steps: [
                    { action: "Dose and distribute (~18g)", duration_seconds: 15 },
                    { action: "Tamp level at ~15kg pressure", duration_seconds: 10 },
                    { action: "Pre-infuse at low pressure", duration_seconds: 10 },
                    { action: "Pull shot to 2× dose yield", duration_seconds: 30 },
                    { action: "Rest and taste", duration_seconds: 20 },
                ],
            },
            {
                name: "Immersion / Steep & Release",
                brew_method: "Switch / Origami",
                steps: [
                    { action: "Saturate grounds — pour 50g", duration_seconds: 10 },
                    { action: "Pour to full target weight", duration_seconds: 20 },
                    { action: "Steep with lid on", duration_seconds: 240 },
                    { action: "Open valve and draw down", duration_seconds: 90 },
                ],
            },
        ];
        for (const recipe of recipes) {
            const [result] = await conn.execute("INSERT INTO recipes (name, brew_method, user) VALUES (?, ?, ?)", [recipe.name, recipe.brew_method, userId]);
            const recipeId = result.insertId;
            for (const [i, step] of recipe.steps.entries()) {
                await conn.execute("INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES (?, ?, ?, ?)", [recipeId, i + 1, step.action, step.duration_seconds]);
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