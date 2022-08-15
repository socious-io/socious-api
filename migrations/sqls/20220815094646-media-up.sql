CREATE TABLE media(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  filename text,
  url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


ALTER TABLE public.users 
  DROP COLUMN avatar,
  DROP COLUMN cover_image;

ALTER TABLE public.users
  ADD COLUMN avatar uuid,
  ADD COLUMN cover_image uuid;

ALTER TABLE public.users
  ADD CONSTRAINT fk_media_avatar FOREIGN KEY (avatar) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_media_cover_image FOREIGN KEY (cover_image) REFERENCES media(id) ON DELETE SET NULL;


ALTER TABLE posts ADD COLUMN image uuid;

ALTER TABLE posts
  ADD CONSTRAINT fk_media FOREIGN KEY (image) REFERENCES media(id) ON DELETE SET NULL;
