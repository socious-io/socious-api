ALTER TABLE
  impact_points_history
ADD
  COLUMN label text;
CREATE UNIQUE INDEX idx_disputes_mission_id ON disputes(mission_id);

-- Settign a defult for is_contributor flag conciders "they haven't Opt-In to the program" as default behavior
ALTER TABLE
  users
ALTER COLUMN
  is_contributor
SET
  DEFAULT NULL;

CREATE OR REPLACE FUNCTION public.set_users_identity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
      identity_verified,
      is_contributor
    FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$;


-- Updating the users with FALSE is_contributor flag indicating that they haven't Opt-In to the program ever since
-- Also Updating will also put the flag into the identities.meta Object
UPDATE
  users
SET
  is_contributor = NULL
WHERE
  is_contributor = FALSE;

-- Same for second line above
UPDATE
  users
SET
  is_contributor = TRUE
WHERE
  is_contributor = TRUE;
