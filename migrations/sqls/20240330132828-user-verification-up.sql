CREATE TYPE verification_credentials_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE verification_credentials (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status experience_credentials_status DEFAULT 'PENDING' NOT NULL,
  identity_id uuid NOT NULL UNIQUE,
  connection_id text UNIQUE,
  connection_url text,
  present_id text UNIQUE,
  body jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);




CREATE OR REPLACE FUNCTION approved_verification()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  RAISE NOTICE 'Identity verfication has been approved';
  UPDATE users SET identity_verified = true WHERE id=NEW.identity_id;
  UPDATE organizations SET verified = true WHERE id=NEW.identity_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER verfication_update
    AFTER INSERT OR UPDATE ON verification_credentials
    FOR EACH ROW WHEN (NEW.status = 'APPROVED')
    EXECUTE FUNCTION approved_verification();
