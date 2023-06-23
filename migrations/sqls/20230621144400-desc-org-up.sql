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
      verified_impact,
      wallet_address
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
