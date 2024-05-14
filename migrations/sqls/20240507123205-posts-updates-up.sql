ALTER TABLE posts ADD COLUMN comments int DEFAULT 0;
ALTER TABLE comments ADD COLUMN media_id uuid;

ALTER TABLE comments
  ADD CONSTRAINT fk_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL;



CREATE OR REPLACE FUNCTION new_comment()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET comments = comments + 1 WHERE id=NEW.post_id AND NEW.reply_id IS NULL;
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE comments SET replied=true WHERE id=NEW.reply_id;
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION remove_comment()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET comments = comments - 1 WHERE id=OLD.post_id;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;



CREATE TRIGGER del_comment
    BEFORE DELETE ON comments FOR EACH ROW EXECUTE FUNCTION remove_comment();


CREATE TABLE emojis (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  comment_id uuid,
  post_id uuid NOT NULL,
  emoji varchar(8) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_emoji ON emojis(identity_id, post_id, comment_id, emoji);


UPDATE posts 
SET comments = (
    SELECT COUNT(*) 
    FROM comments c 
    WHERE c.post_id = posts.id
);
