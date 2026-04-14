-- Migration: Recipe step types + default dose
-- Run this once against your existing terva database.
-- Safe to run on a live DB — uses ALTER TABLE and UPDATE only.
-- CREATED: 13APR2026

USE terva;

-- ── 1. Add default_dose_g to recipes ──────────────────────────────────────────
ALTER TABLE recipes
  ADD COLUMN default_dose_g FLOAT NOT NULL DEFAULT 0;

-- ── 2. Add new columns to recipe_steps ───────────────────────────────────────
ALTER TABLE recipe_steps
  ADD COLUMN type ENUM(
    'setup','grind','preheat','bloom','pour','agitate','drawdown','wait'
  ) NOT NULL DEFAULT 'wait' AFTER step_order,
  ADD COLUMN water_g FLOAT AFTER duration_seconds,
  MODIFY COLUMN action VARCHAR(100) NULL,
  MODIFY COLUMN duration_seconds INT NULL;

-- ── 3. Best-guess type from existing action text ──────────────────────────────

UPDATE recipe_steps SET type = 'pour'
WHERE LOWER(action) REGEXP 'pour|add water|fill|water';

UPDATE recipe_steps SET type = 'bloom'
WHERE LOWER(action) REGEXP 'bloom|wet|prewet|pre-wet|rinse filter'
  AND type = 'wait';

UPDATE recipe_steps SET type = 'preheat'
WHERE LOWER(action) REGEXP 'preheat|pre-heat|rinse|warm'
  AND type = 'wait';

UPDATE recipe_steps SET type = 'agitate'
WHERE LOWER(action) REGEXP 'stir|swirl|agitat|mix|shake|spin'
  AND type = 'wait';

UPDATE recipe_steps SET type = 'drawdown'
WHERE LOWER(action) REGEXP 'drawdown|draw down|drain|drip'
  AND type = 'wait';

UPDATE recipe_steps SET type = 'grind'
WHERE LOWER(action) REGEXP 'grind|grinding'
  AND type = 'wait';

UPDATE recipe_steps SET type = 'setup'
WHERE LOWER(action) REGEXP 'setup|set up|place|tare|prep|weigh|heat water|boil'
  AND type = 'wait';

-- Everything else stays 'wait' (the default).
