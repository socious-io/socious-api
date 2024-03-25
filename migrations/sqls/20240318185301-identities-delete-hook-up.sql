
DELETE FROM identities WHERE 
  NOT EXISTS (
      SELECT 1
      FROM users
      WHERE users.id = identities.id
  ) AND NOT EXISTS (
    SELECT 1
      FROM organizations
      WHERE organizations.id = identities.id
  );

  DROP TRIGGER IF EXISTS delete_identity ON organizations;
  DROP TRIGGER IF EXISTS delete_identity ON users;

CREATE TRIGGER delete_identity
    AFTER DELETE ON organizations FOR EACH ROW EXECUTE FUNCTION delete_identity();


CREATE TRIGGER delete_identity
    AFTER DELETE ON users FOR EACH ROW EXECUTE FUNCTION delete_identity();
