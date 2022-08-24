ALTER TABLE posts DROP COLUMN shared;

ALTER TABLE posts
  ADD COLUMN shared int DEFAULT 0,
  ADD COLUMN shared_id uuid;

ALTER TABLE posts
  ADD CONSTRAINT fk_post FOREIGN KEY (shared_id) REFERENCES posts(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX idx_posts_shared ON posts (shared_id, identity_id);


CREATE OR REPLACE FUNCTION new_post()
  RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.shared_id IS NOT NULL THEN
    UPDATE posts SET shared = shared + 1 WHERE id=NEW.shared_id;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION del_post()
  RETURNS TRIGGER AS
$$
BEGIN
  IF OLD.shared_id IS NOT NULL THEN
    UPDATE posts SET shared = shared - 1 WHERE id=OLD.shared_id;
  END IF;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_post
    AFTER INSERT ON posts FOR EACH ROW EXECUTE FUNCTION new_post();

CREATE TRIGGER del_post
    BEFORE DELETE ON posts FOR EACH ROW EXECUTE FUNCTION del_post();
