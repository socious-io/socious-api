CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      description,
      mission,
      email,
      m.url AS image,
      status,
      country,
      city,
      address,
      verified,
      verified_impact,
      wallet_address,
      hiring
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      users.id,
      username,
      email,
      (NEW.first_name || ' ' || NEW.last_name) AS name,
      m.url AS avatar,
      status,
      country,
      city,
      address,
      wallet_address,
      open_to_work,
      open_to_volunteer,
      identity_verified
    FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
UPDATE users SET id=id;
