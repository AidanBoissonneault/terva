-- -----------------------------------------
--  SEED DATA - terva
-- -----------------------------------------

USE terva;

-- -----------------------------------------
--  BEANS
-- -----------------------------------------

INSERT INTO beans (user, name, roaster, origin, variety, process, flavour_summary, roast_level, elevation_m, status) VALUES
(1, 'Kayon Mountain Guracho', 'Monogram Coffee', 'Ethiopia', 'Heirloom', 'Natural', 'Blueberry, dark chocolate, jasmine', 18, '2100', 'fresh'),
(1, 'La Palma y El Tucán Sidra', 'Pilot Coffee', 'Colombia', 'Sidra', 'Washed', 'Peach, rose water, honey, caramel', 22, '1850', 'fresh'),
(1, 'Finca El Paraíso Gesha', 'Detour Coffee', 'Colombia', 'Gesha', 'Double Anaerobic Washed', 'Lychee, passionfruit, white tea', 14, '1950', 'frozen'),
(1, 'Huila Caturra', 'Sam James Coffee Bar', 'Colombia', 'Caturra', 'Washed', 'Brown sugar, almond, orange zest', 38, '1700', 'fresh'),
(1, 'Yirgacheffe Kochere', 'Pilot Coffee', 'Ethiopia', 'Heirloom', 'Washed', 'Lemon curd, green tea, bergamot', 20, '1980', 'finished');

-- -----------------------------------------
--  BEAN PALETTES  (OKLCH-derived hues)
-- -----------------------------------------

INSERT INTO bean_palette (bean_id, pri_hue, sec_hue, acc_hue) VALUES
(1, 320, 270, 30),   -- blueberry / chocolate / amber
(2, 45,  18,  340),  -- peach / caramel / rose
(3, 160, 80,  50),   -- lychee-green / gold / passionfruit
(4, 35,  25,  200),  -- brown sugar / almond / citrus blue
(5, 75,  180, 55);   -- green tea / bergamot teal / lemon

-- -----------------------------------------
--  GEAR
-- -----------------------------------------

INSERT INTO gear (name, type, notes, user) VALUES
('Comandante C40 MK4',       'grinder',          'Red clix installed. Daily driver for filter.',    1),
('DF64 Gen 2',               'grinder',          'SSP Unimodal burrs. Used for espresso.',          1),
('Fellow Stagg EKG Pro',     'kettle',            '1.0L. Hold temp set to 93°C for most brews.',    1),
('Acaia Pearl Model S',      'scale',             'Auto-tare. Used for all pour-overs.',             1),
('Hario V60-02 (Glass)',     'brewer',            'With Cafec Abaca+ filters.',                     1),
('Origami Dripper (Large)',  'brewer',            'Used with Kalita Wave filters.',                 1),
('Flair 58x',                'espresso_machine',  'Stock piston. Preheating with boiling water.',   1);

-- -----------------------------------------
--  RECIPES
-- -----------------------------------------

INSERT INTO recipes (name, brew_method, user) VALUES
('4-6 Method Classic',   'V60',          1),
('Rao Allongé',          'V60',          1),
('Origami Immersion',    'Origami',      1),
('Flair Espresso Shot',  'Espresso',     1);

-- -----------------------------------------
--  RECIPE STEPS
-- -----------------------------------------

-- 4-6 Method Classic (recipe 1)
INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES
(1, 1, 'Bloom - pour 50g water',    45),
(1, 2, 'Pour to 150g (1st main)',   40),
(1, 3, 'Pour to 200g (2nd main)',   40),
(1, 4, 'Pour to 250g (3rd main)',   40),
(1, 5, 'Pour to 300g (4th main)',   40),
(1, 6, 'Draw down',                 60);

-- Rao Allongé (recipe 2)
INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES
(2, 1, 'Bloom - pour 60g water',    30),
(2, 2, 'Continuous pour to 360g',   90),
(2, 3, 'Draw down',                 60);

-- Origami Immersion (recipe 3)
INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES
(3, 1, 'Saturate grounds - 50g',    10),
(3, 2, 'Pour to 250g',              20),
(3, 3, 'Steep with lid on',        240),
(3, 4, 'Open valve and draw down',  90);

-- Flair Espresso Shot (recipe 4)
INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES
(4, 1, 'Preheat piston and basket', 120),
(4, 2, 'Dose and distribute 18g',    20),
(4, 3, 'Tamp at ~15kg pressure',     10),
(4, 4, 'Pre-infuse at 2–3 bar',      10),
(4, 5, 'Pull shot to 36g yield',     25),
(4, 6, 'Rest and taste',             30);

-- -----------------------------------------
--  BREWS
-- -----------------------------------------

INSERT INTO brews (user_id, bean_id, recipe_id, brewer_id, grinder_id, grind_size, dose_g, yield_g, time_seconds, closeness, profile, body, notes, brewed_at) VALUES
-- Kayon Mountain on V60 4-6
(1, 1, 1, 5, 1, 24.0, 20.0, 300.0, 210, 'success', 52.0, 45.0, 'Blueberry jam on the nose. Sweet and clean. Best cup in a while.', '2025-03-01 08:12:00'),
(1, 1, 1, 5, 1, 22.0, 20.0, 300.0, 198, 'close',   38.0, 40.0, 'Slightly astringent. Grind too fine maybe.', '2025-03-03 08:30:00'),

-- La Palma Sidra on Rao Allongé
(1, 2, 2, 5, 1, 26.0, 15.0, 240.0, 195, 'success', 68.0, 38.0, 'Insanely floral and bright. Like drinking a fruit tea.', '2025-03-06 09:00:00'),
(1, 2, 2, 5, 1, 25.0, 15.0, 240.0, 205, 'close',   60.0, 35.0, 'Good but slightly hollow in mid-palate.', '2025-03-08 08:45:00'),

-- Gesha on Origami Immersion
(1, 3, 3, 6, 1, 25.0, 15.0, 250.0, 360, 'success', 72.0, 42.0, 'Wild. Lychee and white grape. Immersion really works for this coffee.', '2025-03-10 07:55:00'),

-- Huila Caturra espresso
(1, 4, 4, 7, 2, 2.2, 18.0, 36.0,  28,  'success', 50.0, 65.0, 'Balanced, nutty, brown sugar finish. Classic.', '2025-03-12 08:00:00'),
(1, 4, 4, 7, 2, 2.0, 18.0, 36.0,  24,  'miss',    30.0, 70.0, 'Under-extracted. Sour and thin. Grind finer.', '2025-03-13 08:05:00'),
(1, 4, 4, 7, 2, 2.4, 18.0, 38.0,  32,  'close',   55.0, 68.0, 'Slightly bitter on the tail but body is great.', '2025-03-14 07:58:00'),

-- Yirgacheffe on V60 4-6 (finished bag)
(1, 5, 1, 5, 1, 23.0, 20.0, 300.0, 202, 'success', 65.0, 36.0, 'Lemon curd and bergamot. Very clean and light. Last bag gone.', '2025-02-20 08:20:00'),
(1, 5, 1, 5, 1, 21.0, 20.0, 300.0, 190, 'close',   55.0, 34.0, 'Green and grassy. Could have rested longer off roast.', '2025-02-15 08:10:00');