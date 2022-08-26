CREATE TYPE token_type AS ENUM ('JWT_ACCESS', 'JWT_REFRESH');

CREATE TABLE tokens_blacklist (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  token text,
  type token_type DEFAULT 'JWT_REFRESH',
  expires_at timestamp NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE OR REPLACE FUNCTION cleaner()
  RETURNS TRIGGER AS
$$
BEGIN
  DELETE FROM tokens_blacklist WHERE expires_at < CURRENT_TIMESTAMP;
  RETURN NULL;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER cleaner
    AFTER INSERT ON tokens_blacklist FOR EACH ROW EXECUTE FUNCTION cleaner();
