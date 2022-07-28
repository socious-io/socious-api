CREATE TYPE idetities_type AS ENUM ('users', 'organizations');

CREATE TABLE IF NOT EXISTS public.identities (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  id uuid UNIQUE NOT NULL,
  type idetities_type NOT NULL,
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (SELECT id, username, email, (NEW.first_name || ' ' || NEW.last_name) as name FROM users) t WHERE id = NEW.id);
    
  INSERT INTO identities (ref, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (ref) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (SELECT id, name, email FROM organizations) t WHERE id = NEW.id);
    
  INSERT INTO identities (ref, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (ref) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION delete_identity() 
RETURNS TRIGGER AS
$$
BEGIN
  DELETE FROM identities WHERE ref=OLD.id;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_identity
    AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_users_identity();

CREATE TRIGGER insert_identity
    AFTER INSERT ON users FOR EACH ROW EXECUTE FUNCTION set_users_identity();

CREATE TRIGGER delete_identity
    BEFORE DELETE ON users FOR EACH ROW EXECUTE FUNCTION delete_identity();


CREATE TRIGGER update_identity
    AFTER UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_orgs_identity();

CREATE TRIGGER insert_identity
    AFTER INSERT ON organizations FOR EACH ROW EXECUTE FUNCTION set_orgs_identity();

CREATE TRIGGER delete_identity
    BEFORE DELETE ON organizations FOR EACH ROW EXECUTE FUNCTION delete_identity();
