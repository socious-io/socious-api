CREATE TYPE payment_mode_type AS ENUM ('CRYPTO', 'FIAT');

ALTER TABLE offers ADD COLUMN payment_mode payment_mode_type DEFAULT 'CRYPTO';
