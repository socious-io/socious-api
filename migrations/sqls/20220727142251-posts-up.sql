CREATE TABLE public.posts (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  content text,
  identity_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
)
