
CREATE TYPE oauth_connected_providers AS ENUM ('STRIPE');

CREATE TABLE IF NOT EXISTS oauth_connects(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  provider oauth_connected_providers NOT NULL,
  matrix_unique_id text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  meta jsonb,
  status user_status DEFAULT 'ACTIVE',
  expired_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE UNIQUE INDEX idx_oauth_mui ON oauth_connects (identity_id, provider);
