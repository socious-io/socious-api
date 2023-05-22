CREATE TABLE IF NOT EXISTS public.follows (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  follower_identity_id uuid NOT NULL,
  following_identity_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_follower_identity FOREIGN KEY (follower_identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_following_identity FOREIGN KEY (following_identity_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_followed ON follows (follower_identity_id, following_identity_id);


ALTER TABLE public.users
  ADD COLUMN followers int DEFAULT 0,
  ADD COLUMN followings int DEFAULT 0;

ALTER TABLE organizations
  ADD COLUMN followers int DEFAULT 0,
  ADD COLUMN followings int DEFAULT 0;


CREATE OR REPLACE FUNCTION followed()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE users SET followers=followers+1 FROM identities i WHERE users.id=NEW.following_identity_id AND users.id=i.id AND i.type='users';
  UPDATE users SET followings=followings+1 FROM identities i WHERE users.id=NEW.follower_identity_id AND users.id=i.id AND i.type='users';
  UPDATE organizations SET followers=followers+1 FROM identities i WHERE organizations.id=NEW.following_identity_id AND organizations.id=i.id AND i.type='organizations';
  UPDATE organizations SET followings=followings+1 FROM identities i WHERE organizations.id=NEW.follower_identity_id AND organizations.id=i.id AND i.type='organizations';
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION unfollowed()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE users SET followers=followers-1 FROM identities i WHERE users.id=OLD.following_identity_id AND users.id=i.id AND i.type='users';
  UPDATE users SET followings=followings-1 FROM identities i WHERE users.id=OLD.follower_identity_id AND users.id=i.id AND i.type='users';
  UPDATE organizations SET followers=followers-1 FROM identities i WHERE organizations.id=OLD.following_identity_id AND organizations.id=i.id AND i.type='organizations';
  UPDATE organizations SET followings=followings-1 FROM identities i WHERE organizations.id=OLD.follower_identity_id AND organizations.id=i.id AND i.type='organizations';
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_follow
    AFTER INSERT ON follows FOR EACH ROW EXECUTE FUNCTION followed();

CREATE TRIGGER delete_follow
    BEFORE DELETE ON follows FOR EACH ROW EXECUTE FUNCTION unfollowed();
