CREATE TYPE entity_type AS ENUM ('users', 'organizations', 'projects');

CREATE TABLE recommends (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  entity_id uuid NOT NULL,
  entity_type entity_type NOT NULL,
  recommened_count int DEFAULT 1,
  order int NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
)

CREATE UNIQUE INDEX idx_identity_entity ON recommends(identity_id, entity_id);
