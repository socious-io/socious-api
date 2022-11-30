CREATE TABLE IF NOT EXISTS cards(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  holder_name text,
  numbers varchar(16) NOT NULL,
  exp_month int NOT NULL,
  exp_year int NOT NULL,
  cvc varchar(32) NOT NULL,
  brand varchar(25),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TYPE payment_source_type AS ENUM ('CARD');

ALTER TABLE payments 
  ADD COLUMN source text NOT NULL,
  ADD COLUMN source_type payment_source_type NOT NULL DEFAULT 'CARD';


DROP TRIGGER payment_escrow ON payments;
DROP FUNCTION payment_escrow;

ALTER TABLE escrows DROP COLUMN topup_id;
DROP TABLE topups;


ALTER TABLE escrows ADD COLUMN identity_id uuid NOT NULL;
ALTER TABLE escrows ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE SET NULL;

DROP TRIGGER project_escrow_insert ON escrows;
DROP TRIGGER project_escrow_update ON escrows;

DROP FUNCTION project_escrow;


ALTER TABLE projects DROP COLUMN total_escrow_amount;
