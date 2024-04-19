/* Replace with your SQL commands */
CREATE TABLE org_verification_credentials (
  id                  uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id         uuid                            NOT NULL UNIQUE,
  status              verification_credentials_status NOT NULL DEFAULT 'PENDING',
  created_at          timestamp with time zone        NOT NULL DEFAULT now(),
  updated_at          timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT          fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TABLE org_verification_documents (
  id                   uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  media_id             uuid                            NOT NULL UNIQUE,
  verification_id      uuid                            NOT NULL,
  created_at           timestamp with time zone        NOT NULL DEFAULT now(),
  updated_at           timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT fk_org_verification_credentials FOREIGN KEY (verification_id) REFERENCES org_verification_credentials(id) ON DELETE CASCADE
);
