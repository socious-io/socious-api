/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE TABLE verification_documents (
  id                   uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  media_id             uuid                            NOT NULL UNIQUE,
  verification_id      uuid                            NOT NULL,
  created_at           timestamp with time zone        NOT NULL DEFAULT now(),
  updated_at           timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT fk_verification_credentials FOREIGN KEY (verification_id) REFERENCES verification_credentials(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS org_verification_documents CASCADE;
DROP TABLE IF EXISTS org_verification_credentials CASCADE;
