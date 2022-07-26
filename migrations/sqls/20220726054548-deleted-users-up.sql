ALTER TABLE otps DROP CONSTRAINT fk_user;

ALTER TABLE otps
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) 
  REFERENCES users(id)
  ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS public.deleted_users (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  username varchar(200),
  reason text,
  registered_at timestamp NOT NULL,
  deleted_at timestamp with time zone DEFAULT now() NOT NULL
);
