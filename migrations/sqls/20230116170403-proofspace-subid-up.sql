
ALTER TABLE users ADD COLUMN proofspace_connect_id varchar(250) UNIQUE;

CREATE TYPE webhook_party_type AS ENUM ('PROOFSPACE');

CREATE table webhooks(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  party webhook_party_type NOT NULL,
  content jsonb,
  response jsonb,
  response_status_code int,
  response_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL 
);
