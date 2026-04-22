-- Push notification subscriptions
CREATE TABLE push_subscriptions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    VARCHAR(50) NOT NULL,
  endpoint   TEXT NOT NULL,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_endpoint (endpoint(500))
);

-- Track whether a 1-hour reminder was sent for each in-progress brew
ALTER TABLE brews ADD COLUMN reminder_sent BOOLEAN NOT NULL DEFAULT FALSE;
