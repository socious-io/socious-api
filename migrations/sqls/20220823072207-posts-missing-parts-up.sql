ALTER TABLE posts DROP COLUMN image;

ALTER TABLE posts
  ADD COLUMN media uuid[],
  ADD COLUMN likes int NOT NULL DEFAULT 0;


CREATE TABLE likes(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX idx_liked ON likes (post_id, identity_id);

CREATE OR REPLACE FUNCTION liked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id=NEW.post_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER liked
    AFTER INSERT ON likes FOR EACH ROW EXECUTE FUNCTION liked();

CREATE TRIGGER unliked
    BEFORE DELETE ON likes FOR EACH ROW EXECUTE FUNCTION unliked();
