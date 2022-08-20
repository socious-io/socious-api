ALTER TABLE organizations 
  ADD COLUMN  wallet_address text,
  ADD COLUMN  impact_score double precision NOT NULL DEFAULT 0,
  ADD COLUMN mission text,
  ADD COLUMN culture text,
  ADD COLUMN image uuid,
  ADD COLUMN cover_image uuid;


ALTER TABLE organizations 
  ADD CONSTRAINT fk_media_image FOREIGN KEY (image) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_media_cover_image FOREIGN KEY (cover_image) REFERENCES media(id) ON DELETE SET NULL;


ALTER TABLE organizations 
  ALTER COLUMN updated_at DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE organizations 
  DROP CONSTRAINT organizations_email_key,
  DROP CONSTRAINT organizations_phone_key;


ALTER TABLE projects
  DROP COLUMN title;

ALTER TABLE projects
  ADD COLUMN title text,
  ADD COLUMN expires_at timestamp,
  ADD COLUMN country varchar(3);  


ALTER TABLE posts
  ADD COLUMN shared uuid;

ALTER TABLE posts
  ADD CONSTRAINT fk_posts FOREIGN KEY (shared) REFERENCES posts(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX idx_posts_shared ON posts (identity_id, shared);
