DROP DATABASE IF EXISTS treva;
CREATE DATABASE treva;
USE treva;

-- -----------------------------------------
--  BEANS
-- -----------------------------------------

CREATE TABLE beans (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user            VARCHAR(50) NOT NULL DEFAULT "1",
  name            VARCHAR(100) NOT NULL,
  roaster         VARCHAR(100),
  origin          VARCHAR(100),
  variety         VARCHAR(100),
  process         VARCHAR(100),
  flavour_summary VARCHAR(200),
  roast_level     INT, -- 0 - 100
  elevation_m     VARCHAR(20),
  status          ENUM('fresh', 'frozen', 'finished') NOT NULL DEFAULT 'fresh',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bean_palette (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  bean_id  INT NOT NULL,
  pri_hue INT NOT NULL,
  sec_hue INT NOT NULL,
  acc_hue INT NOT NULL,
  FOREIGN KEY (bean_id)  REFERENCES beans(id) ON DELETE CASCADE
);

-- -----------------------------------------
--  GEAR
-- -----------------------------------------

CREATE TABLE gear (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  type       ENUM('grinder', 'kettle', 'scale', 'brewer', 'espresso_machine', 'other') NOT NULL,
  notes      TEXT,
  user       VARCHAR(50) NOT NULL DEFAULT "1",
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------
--  RECIPES
-- -----------------------------------------

CREATE TABLE recipes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  brew_method  VARCHAR(100) NOT NULL,
  user         VARCHAR(50) NOT NULL DEFAULT "1",
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ordered steps within a recipe
CREATE TABLE recipe_steps (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id        INT NOT NULL,
  step_order       TINYINT NOT NULL,
  action           VARCHAR(100) NOT NULL,
  duration_seconds INT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- -----------------------------------------
--  BREWS
-- -----------------------------------------

CREATE TABLE brews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user          VARCHAR(50) NOT NULL DEFAULT "1",
  bean_id       INT NOT NULL,
  recipe_id     INT,
  brewer_id     INT,
  closeness     ENUM('success', 'close', 'miss') NOT NULL,
  profile       FLOAT,  -- 0–100, 0: bitter, 50: balanced, 100: sour
  body          FLOAT,  -- 0–100, 0: light, 50: medium, 100: heavy
  grinder_id    INT,
  grind_size    FLOAT,
  dose_g        FLOAT,
  yield_g       FLOAT,
  time_seconds  INT,
  notes         TEXT,
  brewed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bean_id)   REFERENCES beans(id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (brewer_id) REFERENCES gear(id),
  FOREIGN KEY (grinder_id) REFERENCES gear(id)
);