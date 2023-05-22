CREATE TABLE devices(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  token text NOT NULL,
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_token ON devices (user_id, token);
