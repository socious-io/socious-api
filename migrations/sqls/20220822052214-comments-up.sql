CREATE TABLE comments(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  post_id uuid NOT NULL,
  content text NOT NULL,
  reply_id uuid,
  replied boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment FOREIGN KEY (reply_id) REFERENCES comments(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION new_comment()
  RETURNS TRIGGER AS
$$
BEGIN
  
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE comments SET replied=true WHERE id=NEW.reply_id;
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_comment
    AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION new_comment();
