CREATE TYPE payment_service AS ENUM ('STRIPE');
CREATE TYPE payment_currency AS ENUM ('USD', 'JPY', 'EUR');
CREATE TYPE topup_status AS ENUM ('WAITING', 'COMPLETE');


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
);

ALTER TABLE projects ALTER COLUMN payment_currency TYPE payment_currency;
ALTER TABLE applicants ALTER COLUMN offer_rate TYPE float USING assignment_total::float;
ALTER TABLE applicants ALTER COLUMN assignment_total TYPE float USING assignment_total::float;

ALTER TABLE projects ADD COLUMN total_escrow_amount float;

CREATE TABLE topups (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  status topup_status DEFAULT 'WAITING',
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE TABLE escrows (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  payment_id uuid NOT NULL,
  topup_id uuid,
  amount float GENERATED ALWAYS AS (SELECT amount FROM payments WHERE id=payment_id),
  currency payment_currency GENERATED ALWAYS AS (SELECT currency FROM payments WHERE id=payment_id),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  released_at timestamp,
  refound_at timestamp,
  CONSTRAINT fk_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_topup FOREIGN KEY (topup_id) REFERENCES topups(id)
);


CREATE FUNCTION payment_escrow()
RETURNS TRIGGER AS
$$
BEGIN
  CASE
    WHEN NEW.meta->>'project_id' IS NOT NULL AND NEW.verified_at IS NOT NULL THEN
    INSERT INTO escrows (project_id, payment_id, amount, currency) VALUES (
      NEW.meta->>'project_id',
      NEW.id,
      NEW.amount,
      NEW.currency
    );
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER payment_escrow
    AFTER UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION payment_escrow();


CREATE FUNCTION project_escrow()
RETURNS TRIGGER AS
$$
BEGIN   
  UPDATE projects SET total_escrow_amount = total_escrow_amount + NEW.amount WHERE id=NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER project_escrow_insert
    AFTER INSERT ON escrows FOR EACH ROW EXECUTE FUNCTION project_escrow();

CREATE TRIGGER project_escrow_update
    AFTER UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION project_escrow();
