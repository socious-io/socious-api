CREATE TYPE payment_service AS ENUM ('STRIPE')
CREATE TYPE payment_currency AS ENUM ('USD', 'JPY', 'EUR')


CREATE TABLE payments (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  transaction_id varchar(250) UNIQUE,
  amount float,
  currency payment_currency,
  service payment_service,
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  verified_at timestamp,
  canceled_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
)

ALTER TABLE projects ALTER COLUMN payment_currency TYPE payment_currency;
