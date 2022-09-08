ALTER TABLE organizations
  ADD COLUMN created_by uuid;

CREATE OR REPLACE FUNCTION new_orgs()
  RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.created_by, NEW.id);
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;



CREATE TRIGGER new_orgs
    AFTER INSERT ON organizations FOR EACH ROW EXECUTE FUNCTION new_orgs();
