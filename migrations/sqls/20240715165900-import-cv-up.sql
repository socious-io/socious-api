CREATE TYPE import_type AS ENUM ('LINKDIN');
CREATE TYPE import_status_type AS ENUM ('PENDING', 'APPLIED', 'CANCELED');

CREATE TABLE imports (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id uuid NOT NULL,
  type import_type NOT NULL,
  status import_status_type NOT NULL DEFAULT 'PENDING',
  body jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);
