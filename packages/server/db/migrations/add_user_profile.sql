CREATE TABLE IF NOT EXISTS user_profile (
  user_id         VARCHAR(50) PRIMARY KEY,
  has_onboarded   BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step TINYINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mark all existing users as already onboarded so they skip the flow.
-- The 'user' table is managed by better-auth; adjust the name if yours differs.
INSERT INTO user_profile (user_id, has_onboarded, onboarding_step)
SELECT id, TRUE, 5 FROM user
ON DUPLICATE KEY UPDATE user_id = user_id;
