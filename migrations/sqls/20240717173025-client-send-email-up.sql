CREATE TYPE email_type AS ENUM ('REFERRAL');

CREATE TABLE identities_emails (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id uuid NOT NULL,
  email varchar(160) NOT NULL,
  type email_type NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);
