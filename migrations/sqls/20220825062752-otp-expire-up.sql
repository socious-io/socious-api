ALTER TABLE otps ALTER COLUMN expired_at SET DEFAULT now() + INTERVAL '10 minute';
