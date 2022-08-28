DROP INDEX idx_liked;

ALTER TABLE likes
  ADD COLUMN comment_id uuid;

ALTER TABLE likes
  ADD CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;

ALTER TABLE comments
  ADD COLUMN likes int DEFAULT 0;


CREATE UNIQUE INDEX idx_liked_comments ON likes (post_id, identity_id, comment_id) WHERE (comment_id IS NOT NULL);
CREATE UNIQUE INDEX idx_liked_posts ON likes (post_id, identity_id) WHERE (comment_id IS NULL);



CREATE OR REPLACE FUNCTION liked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id=NEW.post_id AND NEW.comment_id IS NULL;
  UPDATE comments SET likes = likes + 1 WHERE id=NEW.comment_id AND NEW.comment_id IS NOT NULL;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id AND NEW.comment_id IS NULL;
  UPDATE comments SET likes = likes - 1 WHERE id=NEW.comment_id AND NEW.comment_id IS NOT NULL;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;
