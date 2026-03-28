USE husk;

-- ─────────────────────────────────────────
--  FLAVOUR NOTES
-- ─────────────────────────────────────────

INSERT INTO flavour_note (note, hue) VALUES
  ('default',      0.0),    -- 1
  ('strawberry',   12.0),   -- 2
  ('peach',        38.0),   -- 3
  ('lemon curd',   72.0),   -- 4
  ('stone fruit',  28.0),   -- 5
  ('hibiscus',     340.0),  -- 6
  ('jasmine',      68.0),   -- 7
  ('rose',         358.0),  -- 8
  ('bergamot',     290.0),  -- 9
  ('hazelnut',     48.0),   -- 10
  ('almond',       52.0),   -- 11
  ('brown sugar',  55.0),   -- 12
  ('caramel',      50.0),   -- 13
  ('cedar',        80.0),   -- 14
  ('cocoa',        32.0),   -- 15
  ('blackcurrant', 298.0),  -- 16
  ('blueberry',    268.0),  -- 17
  ('orange zest',  42.0),   -- 18
  ('dark cherry',  354.0),  -- 19
  ('vanilla',      65.0),   -- 20
  ('toffee',       46.0),   -- 21
  ('grapefruit',   78.0),   -- 22
  ('plum',         318.0),  -- 23
  ('honey',        58.0);   -- 24

-- ─────────────────────────────────────────
--  BEANS
-- ─────────────────────────────────────────

INSERT INTO beans (id, user, name, roaster, origin, variety, process, roast_level, elevation_m, status, flavour_summary) VALUES
  (1, 1, 'Kayon Mountain',   'Onyx Coffee',     'Ethiopia',  'Heirloom',       'Natural', 50, 2200, 'fresh',    'Strawberry, Hibiscus, Lemon Curd'),
  (2, 1, 'Las Margaritas',   'Counter Culture', 'Colombia',  'Castillo',       'Washed',  42, 1750, 'fresh',    'Hazelnut, Cocoa, Brown Sugar'),
  (3, 1, 'Kiambu AB',        'Blue Bottle',     'Kenya',     'SL28',           'Washed',  73, 1900, 'fresh',    'Blackcurrant, Jasmine, Bergamot'),
  (4, 1, 'La Palma',         'Onyx Coffee',     'Guatemala', 'Bourbon',        'Honey',   10, 1600, 'frozen',   'Caramel, Almond, Stone Fruit'),
  (5, 1, 'Yirgacheffe G1',   'Intelligentsia',  'Ethiopia',  'Heirloom',       'Washed',  20, 2100, 'finished', 'Blueberry, Jasmine, Lemon Curd'),
  (6, 1, 'Huila Decaf',      'Detour Coffee',   'Colombia',  'Castillo',       'Washed',  38, 1850, 'fresh',    'Toffee, Orange Zest, Vanilla'),
  (7, 1, 'Nyanza Lot 12',    'Pilot Coffee',    'Rwanda',    'Red Bourbon',    'Natural', 30, 1950, 'fresh',    'Dark Cherry, Rose, Plum'),
  (8, 1, 'Fazenda Ambiental','Monogram Coffee',  'Brazil',    'Yellow Bourbon', 'Pulped Natural', 65, 1100, 'fresh', 'Hazelnut, Toffee, Honey');

-- ─────────────────────────────────────────
--  BEAN PALETTES
-- ─────────────────────────────────────────

INSERT INTO bean_palette (bean_id, pri_note, sec_note, acc_note) VALUES
  (1, 2,  6,  4),   -- Kayon Mountain:    strawberry / hibiscus / lemon curd
  (2, 10, 15, 12),  -- Las Margaritas:    hazelnut / cocoa / brown sugar
  (3, 16, 7,  9),   -- Kiambu AB:         blackcurrant / jasmine / bergamot
  (4, 13, 11, 5),   -- La Palma:          caramel / almond / stone fruit
  (5, 17, 7,  4),   -- Yirgacheffe G1:    blueberry / jasmine / lemon curd
  (6, 21, 18, 20),  -- Huila Decaf:       toffee / orange zest / vanilla
  (7, 19, 8,  23),  -- Nyanza Lot 12:     dark cherry / rose / plum
  (8, 10, 21, 24);  -- Fazenda Ambiental: hazelnut / toffee / honey

-- ─────────────────────────────────────────
--  GEAR
-- ─────────────────────────────────────────

INSERT INTO gear (id, name, type, notes, user) VALUES
  (1, 'Comandante C40',     'grinder',          '25 clicks for V60. 18 clicks for AeroPress.',  1),
  (2, 'Fellow Stagg EKG',   'kettle',           '93C for light roasts, 88C for dark.',          1),
  (3, 'Acaia Pearl',        'scale',            'Flow rate mode enabled.',                       1),
  (4, 'Hario V60 02',       'brewer',           'Plastic. Faster drain than ceramic.',           1),
  (5, 'Gaggia Classic Pro', 'espresso_machine', 'OPV set to 9 bar. PID modded.',                1),
  (6, 'AeroPress',          'brewer',           'Used inverted. Cap loosened slightly on press.',1),
  (7, 'Niche Zero',         'grinder',          'Single dose. 28 on the dial for V60.',         1);

-- ─────────────────────────────────────────
--  RECIPES
-- ─────────────────────────────────────────

INSERT INTO recipes (id, name, brew_method) VALUES
  (1, '4:6 Method',         'pourover'),
  (2, 'Classic Espresso',   'espresso'),
  (3, 'Aeropress Inverted', 'aeropress'),
  (4, 'Single Origin Flat', 'espresso');

INSERT INTO recipe_steps (recipe_id, step_order, action, duration_seconds) VALUES
  -- 4:6 Method
  (1, 1, 'Bloom: pour 50g water',               45),
  (1, 2, 'First pour: add 100g (total 150g)',   45),
  (1, 3, 'Second pour: add 100g (total 250g)',  45),
  (1, 4, 'Third pour: add 100g (total 350g)',   45),
  (1, 5, 'Drawdown',                            60),
  -- Classic Espresso
  (2, 1, 'Dose 18g, distribute and tamp',       20),
  (2, 2, 'Extract to 36g yield',                28),
  -- Aeropress Inverted
  (3, 1, 'Add 15g coffee, pour 50g water',      30),
  (3, 2, 'Stir 10 times',                       10),
  (3, 3, 'Add remaining 200g water',            20),
  (3, 4, 'Steep',                               90),
  (3, 5, 'Flip and press slowly',               30),
  -- Single Origin Flat (longer ratio, lighter extraction)
  (4, 1, 'Dose 17g, WDT and tamp',             25),
  (4, 2, 'Pre-infuse at low pressure 5s',        5),
  (4, 3, 'Extract to 51g yield (1:3)',           35);

-- ─────────────────────────────────────────
--  BREWS
-- ─────────────────────────────────────────

INSERT INTO brews (bean_id, recipe_id, brewer_id, grinder_id, closeness, profile, body, grind_size, dose_g, yield_g, time_seconds, notes) VALUES
  -- Kayon Mountain on V60
  (1, 1, 4, 1, 'success', 'sweet',    'light',  28.0, 15.0, 250.0, 195, 'Clean and bright. Strawberry really came through.'),
  (1, 1, 4, 1, 'close',   'sweet',    'light',  26.0, 15.0, 250.0, 180, 'Slightly fast drawdown. Tighten grind next time.'),
  (1, 1, 4, 7, 'success', 'sweet',    'light',  29.0, 15.0, 250.0, 205, 'Tried Niche Zero. Hibiscus note more prominent. Lovely.'),

  -- Las Margaritas on espresso
  (2, 2, 5, 1, 'success', 'balanced', 'heavy',  NULL, 18.0,  36.0,  27, 'Dialled in well. Rich and chocolatey.'),
  (2, 2, 5, 1, 'close',   'bitter',   'heavy',  NULL, 18.0,  32.0,  31, 'Over-extracted. Try coarser or shorter time.'),
  (2, 2, 5, 7, 'success', 'balanced', 'heavy',  NULL, 18.0,  36.0,  26, 'Niche Zero on espresso — very consistent puck. Best shot yet.'),

  -- Kiambu AB on AeroPress and V60
  (3, 3, 6, 1, 'miss',    'sour',     'light',  30.0, 15.0, 230.0, 120, 'Steep too short. Bergamot but very sharp.'),
  (3, 1, 4, 1, 'close',   'sweet',    'light',  27.0, 15.0, 250.0, 200, 'Better. Still needs tweaking on first pour ratio.'),
  (3, 3, 6, 1, 'success', 'sweet',    'light',  30.0, 15.0, 230.0, 150, 'Extended steep by 30s. Bergamot softened nicely.'),

  -- La Palma on V60
  (4, 1, 4, 1, 'success', 'sweet',    'medium', 27.0, 15.0, 250.0, 190, 'Honey process adds sweetness nicely. Very approachable.'),
  (4, 1, 4, 7, 'success', 'sweet',    'medium', 28.0, 15.0, 250.0, 193, 'Stone fruit note much clearer with Niche. Will freeze the rest of the bag.'),

  -- Yirgacheffe G1 on AeroPress (finished bag)
  (5, 3, 6, 1, 'success', 'sweet',    'light',  29.0, 15.0, 220.0, 110, 'Blueberry and jasmine clean and clear. Perfect steep.'),
  (5, 3, 6, 1, 'close',   'sweet',    'light',  29.0, 15.0, 220.0, 115, 'Last of the bag. Slightly past peak but still great.'),

  -- Huila Decaf on V60
  (6, 1, 4, 1, 'close',   'sweet',    'medium', 27.0, 15.0, 250.0, 188, 'Good body for a decaf. Orange zest in the finish.'),
  (6, 1, 4, 1, 'success', 'balanced', 'medium', 26.0, 15.0, 250.0, 192, 'Dialled in. Vanilla and toffee come through. Solid evening brew.'),

  -- Nyanza Lot 12 on Single Origin Flat espresso
  (7, 4, 5, 7, 'close',   'sweet',    'medium', NULL, 17.0,  51.0,  33, 'Dark cherry on the nose. Pre-infusion helped. Slightly short on yield.'),
  (7, 4, 5, 7, 'success', 'sweet',    'medium', NULL, 17.0,  51.0,  36, 'Nailed it. Rose and dark cherry as a flat white — exceptional.'),

  -- Fazenda Ambiental on espresso and V60
  (8, 2, 5, 7, 'success', 'balanced', 'heavy',  NULL, 18.0,  36.0,  25, 'Nutty and rich. Classic Brazilian profile. Great daily driver.'),
  (8, 1, 4, 7, 'close',   'sweet',    'medium', 30.0, 15.0, 250.0, 185, 'Interesting on pourover. Honey note clear but slightly flat. Prefer it as espresso.');