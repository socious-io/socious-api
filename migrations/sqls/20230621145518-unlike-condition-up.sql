CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id AND OLD.comment_id IS NULL and likes > 0;
  UPDATE comments SET likes = likes - 1 WHERE id=NEW.comment_id AND OLD.comment_id IS NOT NULL and likes > 0;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;
